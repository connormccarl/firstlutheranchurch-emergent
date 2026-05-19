/**
 * Ready-to-mount Next.js App Router handlers for the full auth surface.
 *
 * Mount under `/api/auth/[...path]/route.ts`:
 *
 *   import { authHandlers } from "@connormccarl/nextos/server";
 *   export const { GET, POST } = authHandlers({
 *     resetUrlBase: "https://yoursite.com/reset-password",
 *   });
 *
 * Endpoints:
 *   POST /api/auth/login          {email, password}            -> sets session+csrf cookies
 *   POST /api/auth/logout                                       -> clears cookies
 *   GET  /api/auth/me                                           -> { user } | 401
 *   POST /api/auth/register       {email, password, name?}      -> sets session (if enabled)
 *   POST /api/auth/request-reset  {email}                       -> always 200
 *   POST /api/auth/reset          {token, password}             -> 200
 */
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import {
  createSession,
  validateSession,
  destroySession,
  sessionCookieOptions,
  csrfCookieOptions,
  clearCookieOptions,
  SESSION_COOKIE,
  compareCsrf,
} from "./session.js";
import {
  authenticateUser,
  registerUser,
  checkLockout,
  AuthError,
  AuthenticationError,
} from "./users.js";
import { requestPasswordReset, consumePasswordResetToken } from "./reset.js";

export interface AuthHandlerOptions {
  /**
   * Where the reset-password page lives on the consuming app.
   *
   * Accepts either:
   *   - A relative path (e.g. `"/reset-password"`) — the handler will prepend
   *     the request's own origin at runtime. This is the recommended form
   *     because it works correctly across preview, production, and custom
   *     domains without any per-environment config.
   *   - An absolute URL (e.g. `"https://example.com/reset-password"`) — used
   *     verbatim. Useful when reset links must point to a different domain.
   */
  resetUrlBase: string;
  /** Allow self-registration via POST /api/auth/register. Default: false. */
  allowRegistration?: boolean;
  /** Override default role assigned at registration. Default: "viewer". */
  defaultRole?: string;
}

/**
 * Resolve `resetUrlBase` against the incoming request when it is a relative
 * path. Absolute URLs (http/https) pass through unchanged.
 */
function resolveResetUrlBase(req: NextRequest, configured: string): string {
  if (/^https?:\/\//i.test(configured)) return configured;
  // Trust the platform's forwarded host (preview, production, custom domain).
  const proto =
    req.headers.get("x-forwarded-proto") ??
    req.nextUrl.protocol.replace(":", "") ??
    "https";
  const host =
    req.headers.get("x-forwarded-host") ??
    req.headers.get("host") ??
    req.nextUrl.host;
  const origin = `${proto}://${host}`;
  const path = configured.startsWith("/") ? configured : `/${configured}`;
  return `${origin}${path}`;
}

function jsonError(message: string, status: number, extras: Record<string, unknown> = {}) {
  return NextResponse.json({ detail: message, ...extras }, { status });
}

async function readClientIp(req: NextRequest): Promise<string | undefined> {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    undefined
  );
}

function applyCookies(res: NextResponse, opts: ReturnType<typeof sessionCookieOptions> | ReturnType<typeof clearCookieOptions>): void {
  res.cookies.set({
    name: opts.name,
    value: opts.value,
    httpOnly: opts.httpOnly,
    secure: opts.secure,
    sameSite: opts.sameSite,
    path: opts.path,
    maxAge: opts.maxAge,
  });
}

async function handleLogin(req: NextRequest): Promise<NextResponse> {
  const body = await req.json().catch(() => null);
  if (!body || !body.email || !body.password) {
    return jsonError("Email and password required", 400);
  }
  const ip = await readClientIp(req);
  const identifier = `${ip ?? "unknown"}:${String(body.email).toLowerCase()}`;
  const lockout = await checkLockout(identifier);
  if (lockout.locked) {
    return jsonError(
      `Too many failed attempts. Try again in ${lockout.retryAfterSeconds} seconds.`,
      429,
      { retryAfterSeconds: lockout.retryAfterSeconds },
    );
  }

  try {
    const user = await authenticateUser({
      email: body.email,
      password: body.password,
      ipAddress: ip,
    });
    const { token, csrfToken } = await createSession({
      userId: user.id,
      userAgent: req.headers.get("user-agent") ?? undefined,
      ipAddress: ip,
    });
    const res = NextResponse.json({ user });
    applyCookies(res, sessionCookieOptions(token));
    applyCookies(res, csrfCookieOptions(csrfToken));
    return res;
  } catch (e) {
    if (e instanceof AuthError) return jsonError(e.message, e.status);
    return jsonError("Login failed", 500);
  }
}

async function handleLogout(): Promise<NextResponse> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  await destroySession(token);
  const res = NextResponse.json({ ok: true });
  applyCookies(res, clearCookieOptions(SESSION_COOKIE));
  applyCookies(res, clearCookieOptions("nextos_csrf"));
  return res;
}

async function handleMe(): Promise<NextResponse> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  const valid = await validateSession(token);
  if (!valid) return jsonError("Unauthorized", 401);
  return NextResponse.json({ user: valid.user, csrfToken: valid.session.csrf_token });
}

async function handleRegister(
  req: NextRequest,
  opts: AuthHandlerOptions,
): Promise<NextResponse> {
  if (!opts.allowRegistration) {
    return jsonError("Registration disabled", 403);
  }
  const body = await req.json().catch(() => null);
  if (!body || !body.email || !body.password) {
    return jsonError("Email and password required", 400);
  }
  try {
    const user = await registerUser({
      email: body.email,
      password: body.password,
      name: body.name,
      role: opts.defaultRole ?? "viewer",
    });
    const { token, csrfToken } = await createSession({
      userId: user.id,
      userAgent: req.headers.get("user-agent") ?? undefined,
      ipAddress: await readClientIp(req),
    });
    const res = NextResponse.json({ user });
    applyCookies(res, sessionCookieOptions(token));
    applyCookies(res, csrfCookieOptions(csrfToken));
    return res;
  } catch (e) {
    if (e instanceof AuthError) return jsonError(e.message, e.status);
    return jsonError("Registration failed", 500);
  }
}

async function handleRequestReset(
  req: NextRequest,
  opts: AuthHandlerOptions,
): Promise<NextResponse> {
  const body = await req.json().catch(() => null);
  if (!body?.email) return jsonError("Email required", 400);
  // Derive the reset URL from the live request so preview/production/custom
  // domain users all get a link pointing back to the host they're using.
  const resetUrlBase = resolveResetUrlBase(req, opts.resetUrlBase);
  const result = await requestPasswordReset(body.email, { resetUrlBase });
  // Don't leak account existence
  return NextResponse.json({ ok: true, devToken: result.devToken });
}

async function handleReset(req: NextRequest): Promise<NextResponse> {
  const body = await req.json().catch(() => null);
  if (!body?.token || !body?.password) {
    return jsonError("Token and password required", 400);
  }
  try {
    await consumePasswordResetToken({ token: body.token, newPassword: body.password });
    return NextResponse.json({ ok: true });
  } catch (e) {
    if (e instanceof AuthError) return jsonError(e.message, e.status);
    return jsonError("Reset failed", 500);
  }
}

export function authHandlers(opts: AuthHandlerOptions) {
  return {
    async POST(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
      const { path } = await ctx.params;
      const route = (path ?? []).join("/");
      switch (route) {
        case "login":
          return handleLogin(req);
        case "logout":
          return handleLogout();
        case "register":
          return handleRegister(req, opts);
        case "request-reset":
          return handleRequestReset(req, opts);
        case "reset":
          return handleReset(req);
        default:
          return jsonError("Not found", 404);
      }
    },
    async GET(_req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
      const { path } = await ctx.params;
      const route = (path ?? []).join("/");
      if (route === "me") return handleMe();
      return jsonError("Not found", 404);
    },
  };
}

/**
 * Convenience: read the current user inside any server component or route handler.
 * Returns `null` when no session.
 */
export async function getCurrentUser() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  const valid = await validateSession(token);
  return valid?.user ?? null;
}

/**
 * Require a session for a given role. Throws an AuthError when not authorized.
 * Use inside route handlers; convert the error to a Response.
 */
export async function requireSession(minRole?: string) {
  const user = await getCurrentUser();
  if (!user) throw new AuthenticationError("Authentication required");
  if (minRole) {
    const { hasRole } = await import("./users.js");
    if (!hasRole(user, minRole)) {
      throw new AuthError(`Role '${minRole}' required`, 403);
    }
  }
  return user;
}

/**
 * Verify CSRF token on a state-changing request.
 * Pass the request to grab `X-CSRF-Token`; the comparator uses the cookie.
 */
export async function assertCsrf(req: NextRequest): Promise<void> {
  const headerToken = req.headers.get("x-csrf-token") ?? undefined;
  const cookieToken = (await cookies()).get("nextos_csrf")?.value;
  if (!compareCsrf(headerToken, cookieToken)) {
    throw new AuthError("Invalid CSRF token", 403);
  }
}
