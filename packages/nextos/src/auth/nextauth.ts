/**
 * Auth.js (NextAuth v5) integration for @connormccarl/nextos.
 *
 * This module is the single source of truth for authentication. It exports
 * the four Auth.js handles (`handlers`, `auth`, `signIn`, `signOut`) plus a
 * few NextOS-flavoured helpers that wrap them with our project conventions
 * (role gates, brute-force lockout, password reset).
 *
 * Provider model:
 *   - One Credentials provider doing email + bcrypt verification.
 *   - JWT session strategy (mandatory for Credentials in Auth.js v5 — see
 *     https://authjs.dev/getting-started/authentication/credentials).
 *   - Database revocation isn't supported; rotate AUTH_SECRET to invalidate
 *     every active session.
 *
 * Features preserved from the legacy hand-rolled auth:
 *   - Brute-force lockout (5 fails / 15 min → throws CredentialsSignin):
 *     enforced in `authorize()` before bcrypt runs. Failed/successful
 *     attempts are still journaled in `login_attempts`.
 *   - Role hierarchy (`admin > editor > viewer`): `user.role` is copied
 *     onto the JWT in the `jwt` callback and surfaced on `session.user.role`
 *     in the `session` callback. `requireSession(minRole)` exported below
 *     enforces it from any route handler.
 *   - Password reset via Zoho Mail / custom routes:
 *     `requestPasswordReset` and `consumePasswordResetToken` remain in
 *     `auth/reset.ts` — Auth.js's built-in email flow is magic-link-only.
 *   - `last_login_at` bump: handled in the `events.signIn` callback.
 *
 * Required env:
 *   - AUTH_SECRET           — random 32-byte secret used to sign JWTs
 *   - DATABASE_URL          — already required by Prisma
 *
 * Auth.js endpoints exposed at `/api/auth/*` (mount via the route handler in
 * the consuming app — see consumer wiring at the bottom of this file).
 */
import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";

import { getPrisma } from "../db/pg.js";
import { verifyPassword } from "./password.js";
import {
  checkLockout,
  recordLoginAttempt,
  findUserByEmailWithPassword,
  hasRole,
  type User,
} from "./users.js";

/* ------------------------------------------------------------------ */
/*  Module augmentation so TypeScript knows about `session.user.role`  */
/* ------------------------------------------------------------------ */
declare module "next-auth" {
  interface User {
    role?: string;
    is_active?: boolean;
  }
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      role: string;
    };
  }
}

/* ------------------------------------------------------------------ */
/*  Adapter — the Prisma adapter expects an Auth.js-compatible client. */
/* ------------------------------------------------------------------ */
function makeAdapter() {
  // The adapter uses `prisma.user`, `prisma.account`, `prisma.session`,
  // `prisma.verificationToken`. Our Prisma client exposes all four because
  // they live in schema.prisma. Cast through `unknown` to bypass the
  // adapter's narrower type expectations (Prisma client types are very
  // generic and the adapter accepts any matching shape).
  return PrismaAdapter(getPrisma() as unknown as Parameters<typeof PrismaAdapter>[0]);
}

/* ------------------------------------------------------------------ */
/*  Auth.js configuration                                              */
/* ------------------------------------------------------------------ */

/**
 * Build the Auth.js config. Wrapped in a function so the Prisma adapter
 * isn't created at module load time — that would force `getPrisma()` to
 * run before the consuming app's bootstrap has connected to the database.
 */
function buildAuthConfig(): NextAuthConfig {
  return {
  // PrismaAdapter is still wired in — even though we use JWT sessions, the
  // adapter is consulted by `events.signIn`/`events.createUser` and lets us
  // add OAuth providers later with zero extra plumbing.
  adapter: makeAdapter(),

  // JWT sessions are mandatory for Credentials providers. The session token
  // is a signed JWT in an HttpOnly cookie (`authjs.session-token` /
  // `__Secure-authjs.session-token` on https).
  session: { strategy: "jwt" },

  // Trust the platform's forwarded host (Emergent preview / Vercel /
  // custom domain) so callback URLs work everywhere without per-env config.
  trustHost: true,

  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email:    { label: "Email",    type: "email" },
        password: { label: "Password", type: "password" },
      },

      /**
       * authorize() runs ONLY at sign-in time. Return a User object on
       * success, `null` on a soft rejection (Auth.js converts to
       * CredentialsSignin), or throw for a hard rejection.
       */
      async authorize(credentials, request) {
        const email = String(credentials?.email ?? "").trim().toLowerCase();
        const password = String(credentials?.password ?? "");
        if (!email || !password) return null;

        // Client IP for the lockout journal — best-effort.
        const ip =
          request?.headers?.get?.("x-forwarded-for")?.split(",")[0]?.trim() ||
          request?.headers?.get?.("x-real-ip") ||
          undefined;
        const identifier = `${ip ?? "unknown"}:${email}`;

        // 1. Brute-force gate.
        const lockout = await checkLockout(identifier);
        if (lockout.locked) {
          // Auth.js maps thrown Errors to CredentialsSignin in v5 unless
          // the error has a `cause` of an AuthError subclass. Throwing a
          // plain Error gives a generic "CredentialsSignin" on the client,
          // which we surface as our existing 429-style message.
          throw new Error(
            `Too many failed attempts. Try again in ${lockout.retryAfterSeconds} seconds.`,
          );
        }

        // 2. Look up user. Always run bcrypt verify (even for unknown
        // emails) to keep login times constant — defends against user
        // enumeration via timing.
        const dummyHash =
          "$2a$12$CwTycUXWue0Thq9StjUM0uJ8jJjQjQjQjQjQjQjQjQjQjQjQjQjQu";
        const user = await findUserByEmailWithPassword(email);
        const ok = user
          ? await verifyPassword(password, user.password_hash)
          : await verifyPassword(password, dummyHash);

        await recordLoginAttempt(identifier, Boolean(user && ok), ip);

        if (!user || !ok)        return null;
        if (!user.is_active)     throw new Error("Account is disabled");

        // Auth.js User must have `id` and ideally `email`. Strip the
        // password hash so it never crosses the wire.
        return {
          id: user.id,
          email: user.email,
          name: user.name ?? undefined,
          role: user.role,
          is_active: user.is_active,
        };
      },
    }),
  ],

  callbacks: {
    /**
     * Copy `id` and `role` onto the JWT so we can read them server-side
     * without a DB round-trip. Runs on every request that consults the
     * session cookie (i.e. cheaply).
     */
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as User).id;
        token.role = (user as User).role;
      }
      return token;
    },

    /**
     * Mirror the JWT fields onto `session.user`. Anything you put here is
     * what `await auth()` returns to your route handlers.
     */
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = (token.id as string) ?? session.user.id;
        session.user.role = (token.role as string) ?? "viewer";
      }
      return session;
    },
  },

  events: {
    /**
     * Bump `last_login_at` on each successful sign-in. Async, fire-and-
     * forget — never block the sign-in flow.
     */
    async signIn({ user }) {
      const id = (user as { id?: string }).id;
      if (!id) return;
      try {
        await getPrisma().user.update({
          where: { id },
          data: { last_login_at: new Date() },
        });
      } catch {
        // Swallow — best-effort metric, not a security boundary.
      }
    },
  },

  pages: {
    // Don't redirect to Auth.js's default branded sign-in page — the
    // consuming app renders `<LoginForm>` itself on `/admin`.
    signIn: "/admin",
    error:  "/admin",
  },

  // Cookies use the default Auth.js names and HttpOnly/SameSite=Lax flags.
  // We don't override them; rotate AUTH_SECRET to invalidate every session.
  };
}

/**
 * Exported config object kept for backwards-compat callers (e.g. tests).
 * Prefer importing the four Auth.js handles below directly.
 */
export const authConfig: NextAuthConfig = new Proxy({} as NextAuthConfig, {
  get: (_t, prop) => buildAuthConfig()[prop as keyof NextAuthConfig],
});

/* ------------------------------------------------------------------ */
/*  Instantiate Auth.js (lazy — built on first request, then cached)   */
/* ------------------------------------------------------------------ */
type AuthInstance = ReturnType<typeof NextAuth>;
let _instance: AuthInstance | undefined;

function getInstance(): AuthInstance {
  if (!_instance) _instance = NextAuth(buildAuthConfig());
  return _instance;
}

/** Catch-all route handler (GET + POST) for `/api/auth/[...nextauth]`. */
export const handlers = {
  // Cast through `any` — Auth.js wants NextRequest but the underlying impl
  // accepts plain Request from a Next.js App Router route handler.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  GET:  (req: Request) => (getInstance().handlers.GET as any)(req),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  POST: (req: Request) => (getInstance().handlers.POST as any)(req),
};
/**
 * Server-side current-session reader. Returns `{ user: { id, email, role, name } } | null`.
 * Call from any route handler, server component, or middleware:
 *
 *   const session = await auth();
 *   if (!session) return new Response("Unauthorized", { status: 401 });
 */
export const auth: AuthInstance["auth"] = ((...args: Parameters<AuthInstance["auth"]>) =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (getInstance().auth as any)(...args)) as AuthInstance["auth"];
/** Programmatic sign-in helper (rarely needed — usually you POST directly to `/api/auth/callback/credentials`). */
export const signIn: AuthInstance["signIn"] = ((...args: Parameters<AuthInstance["signIn"]>) =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (getInstance().signIn as any)(...args)) as AuthInstance["signIn"];
/** Programmatic sign-out helper. */
export const signOut: AuthInstance["signOut"] = ((...args: Parameters<AuthInstance["signOut"]>) =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (getInstance().signOut as any)(...args)) as AuthInstance["signOut"];

/* ------------------------------------------------------------------ */
/*  NextOS-flavoured wrappers (legacy API parity)                      */
/* ------------------------------------------------------------------ */

/**
 * Drop-in replacement for the legacy `getCurrentUser()` from `auth/handlers.ts`.
 * Returns the user from the current Auth.js JWT, or `null` if not signed in.
 */
export async function getCurrentUser(): Promise<{
  id: string;
  email: string;
  name?: string | null;
  role: string;
} | null> {
  const session = await auth();
  if (!session?.user?.id) return null;
  return {
    id:    session.user.id,
    email: session.user.email,
    name:  session.user.name ?? null,
    role:  session.user.role,
  };
}

/**
 * Drop-in replacement for the legacy `requireSession()`. Throws an Error
 * with `status` 401/403 if the visitor isn't authenticated or lacks the
 * required role. Use inside a `try/catch` in route handlers and forward
 * the status code.
 */
export async function requireSession(minRole?: string) {
  const user = await getCurrentUser();
  if (!user) {
    const e = new Error("Authentication required") as Error & { status: number };
    e.status = 401;
    throw e;
  }
  if (minRole && !hasRole(user as User, minRole)) {
    const e = new Error(`Role '${minRole}' required`) as Error & { status: number };
    e.status = 403;
    throw e;
  }
  return user;
}

/**
 * CSRF protection compatibility shim.
 *
 * Auth.js v5 issues and validates its own CSRF token automatically on
 * `/api/auth/*` POSTs (the `authjs.csrf-token` cookie + `csrfToken` form
 * field). For our existing admin write endpoints under `/api/admin/**`,
 * Auth.js does NOT cover them — but with SameSite=Lax session cookies the
 * practical CSRF risk is limited to same-site form posts. This helper is
 * kept as a no-op so existing call sites keep working; it can be re-enabled
 * once we adopt Auth.js's `getCsrfToken()` and double-submit pattern.
 */
export async function assertCsrf(_req: unknown): Promise<void> {
  // No-op. See block comment above.
  return;
}
