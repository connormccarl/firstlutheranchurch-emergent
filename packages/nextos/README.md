# @connormccarl/nextos

A batteries-included **Next.js + PostgreSQL** backend toolkit. Drop it into any Next.js 14/15 App Router app and you get:

- 🔐 **Authentication** — bcrypt password hashing, opaque session tokens (SHA-256 hashed in DB), HTTP-only cookies, CSRF tokens, brute-force lockout, password reset
- 👥 **Authorization** — built-in role hierarchy (`admin` > `editor` > `viewer`) with `hasRole()` / `requireRole()` helpers; extend with your own roles
- 📨 **Transactional email** — Zoho Mail Send API (OAuth2 refresh-token flow), gracefully falls back to console logging when not configured
- 🗂️ **CMS** — define your resources once, get CRUD UI + API for free
- 🐘 **PostgreSQL data layer** — pooled connection, type-safe `query()` helper, idempotent migrations
- 📦 **Two tree-shakable entrypoints** — `@connormccarl/nextos` (client UI) and `@connormccarl/nextos/server` (everything Node-only)
- 🧪 **Tested** — 10+ unit tests with Node's built-in test runner

---

## Install

```bash
npm install @connormccarl/nextos pg bcryptjs lucide-react
# peer deps you already have in any Next.js app:
#   next, react, react-dom
```

Run the schema once at app startup:

```ts
// app/lib/db.ts
import { createPool, migrate } from "@connormccarl/nextos/server";
createPool();           // reads DATABASE_URL from env
await migrate();        // idempotent; safe to call on every cold start
```

Optional: seed an admin user from env:

```ts
import { seedAdmin } from "@connormccarl/nextos/server";
await seedAdmin();      // reads ADMIN_EMAIL + ADMIN_PASSWORD from env
```

### Required env vars

```bash
# .env
DATABASE_URL=postgresql://user:pass@host:port/db
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=at-least-8-characters

# Optional
SESSION_TTL_DAYS=30
MAX_LOGIN_FAILURES=5
LOGIN_LOCKOUT_MINUTES=15
PASSWORD_RESET_TTL_MINUTES=60
BCRYPT_COST=12

# Optional: Zoho Mail (sending real emails)
ZOHO_REGION=com           # com | eu | in | au
ZOHO_CLIENT_ID=...
ZOHO_CLIENT_SECRET=...
ZOHO_REFRESH_TOKEN=...
ZOHO_ACCOUNT_ID=...
ZOHO_FROM_ADDRESS=admin@yourdomain.com
```

---

## Quick start

### 1. Mount the auth API

```ts
// app/api/auth/[...path]/route.ts
import { authHandlers } from "@connormccarl/nextos/server";

export const { GET, POST } = authHandlers({
  resetUrlBase: "https://yoursite.com/reset-password",
  allowRegistration: false,        // gate self-signup
  defaultRole: "viewer",
});
```

This single file gives you:

| Method | Path | Purpose |
| --- | --- | --- |
| `POST` | `/api/auth/login` | `{ email, password }` → sets session + CSRF cookies |
| `POST` | `/api/auth/logout` | clears cookies and revokes session |
| `GET`  | `/api/auth/me` | returns `{ user, csrfToken }` or `401` |
| `POST` | `/api/auth/register` | self-registration (only when `allowRegistration: true`) |
| `POST` | `/api/auth/request-reset` | `{ email }` → sends reset email via Zoho |
| `POST` | `/api/auth/reset` | `{ token, password }` → resets and clears sessions |

### 2. Drop in a login page

```tsx
// app/login/page.tsx
"use client";
import { LoginForm } from "@connormccarl/nextos";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  return (
    <LoginForm
      title="Sign in"
      forgotHref="/forgot-password"
      onSuccess={() => router.push("/admin")}
    />
  );
}
```

### 3. Protect a server component / route handler

```ts
// app/admin/layout.tsx
import { getCurrentUser } from "@connormccarl/nextos/server";
import { redirect } from "next/navigation";

export default async function AdminLayout({ children }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return <>{children}</>;
}
```

```ts
// app/api/admin/users/route.ts
import { requireSession, listUsers } from "@connormccarl/nextos/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await requireSession("admin");
    return NextResponse.json(await listUsers());
  } catch (e: any) {
    return NextResponse.json({ detail: e.message }, { status: e.status ?? 500 });
  }
}
```

### 4. Add a CMS resource

```ts
// app/cms.config.ts
import { defineCmsConfig } from "@connormccarl/nextos";

export const cms = defineCmsConfig({
  siteName: "My Site",
  resources: [
    {
      slug: "events",
      label: "Events",
      singular: "Event",
      collection: "events",          // must be an existing PG table
      icon: "calendar",
      fields: [
        { key: "title", label: "Title", type: "text", required: true },
        { key: "date",  label: "Date",  type: "date", required: true },
        { key: "time",  label: "Time",  type: "time" },
        {
          key: "type", label: "Type", type: "select",
          options: ["worship", "study", "social"],
        },
      ],
      tableColumns: ["title", "date", "type"],
    },
  ],
});
```

```tsx
// app/admin/[slug]/page.tsx
"use client";
import { ResourcePage } from "@connormccarl/nextos";
import { cms } from "@/cms.config";
import { use } from "react";

export default function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const resource = cms.resources.find((r) => r.slug === slug)!;
  return <ResourcePage resource={resource} />;
}
```

```ts
// app/api/admin/[slug]/route.ts
import { cmsListRecords, cmsCreateRecord, requireSession } from "@connormccarl/nextos/server";
import { NextRequest, NextResponse } from "next/server";
import { cms } from "@/cms.config";

export async function GET(_: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  await requireSession("viewer");
  const { slug } = await params;
  return NextResponse.json(await cmsListRecords(cms, slug));
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  await requireSession("editor");
  const { slug } = await params;
  return NextResponse.json(await cmsCreateRecord(cms, slug, await req.json()));
}
```

---

## Security model

| Concern | Decision |
| --- | --- |
| Password hashing | bcrypt, cost 12 (configurable via `BCRYPT_COST`) |
| Session tokens | 32-byte random URL-safe strings (256 bits). Only SHA-256 hash stored in DB. |
| Cookie flags | `HttpOnly`, `Secure` (off in dev), `SameSite=Lax`, `Path=/`, 30-day rolling expiry |
| CSRF | Double-submit cookie pattern. `nextos_csrf` cookie (non-HttpOnly) must match `X-CSRF-Token` header on writes. Use `assertCsrf(req)` in your route handlers. |
| Brute force | 5 failed attempts per `IP:email` in 15 min → 429 with retry-after |
| User enumeration | Always runs bcrypt on login (even when user doesn't exist) |
| Password reset | One-shot tokens, SHA-256 hashed at rest, 60-min default TTL, revokes all sessions on use |
| Email verification | Schema includes `email_verified` flag (not currently enforced by handlers; toggle manually) |
| Session invalidation | `destroyAllUserSessions(userId)` on password change |

---

## API reference

### Client (`@connormccarl/nextos`)

```ts
import {
  // UI components
  AdminShell, Sidebar, DataTable, RecordForm, ResourcePage, LoginForm,
  // Type helpers
  defineCmsConfig,
} from "@connormccarl/nextos";
import type {
  CmsConfig, ResourceDef, FieldDef, FieldType, ResourceRecord,
} from "@connormccarl/nextos";
```

### Server (`@connormccarl/nextos/server`)

```ts
// DB
createPool(cfg?), getPool(), query<T>(sql, params), withClient(fn), migrate()

// Auth: passwords
hashPassword(plain), verifyPassword(plain, hash), passwordStrength(plain)

// Auth: users
registerUser({email, password, name?, role?})
authenticateUser({email, password, ipAddress?})
findUserByEmail(email), findUserById(id)
changePassword(userId, newPassword)
listUsers(), setUserRole(userId, role), setUserActive(userId, isActive)
deleteUser(userId), checkLockout(identifier)
hasRole(user, role), requireRole(user, role)

// Auth: sessions
createSession({userId, userAgent?, ipAddress?})
validateSession(token), destroySession(token), destroyAllUserSessions(userId)
purgeExpiredSessions()                  // run periodically (cron / Vercel cron)
sessionCookieOptions(token), csrfCookieOptions(token), clearCookieOptions(name)
compareCsrf(a, b)
SESSION_COOKIE, CSRF_COOKIE             // cookie names

// Auth: password reset
requestPasswordReset(email, { resetUrlBase })
consumePasswordResetToken({ token, newPassword })

// Auth: routes & guards
authHandlers({ resetUrlBase, allowRegistration?, defaultRole? })
getCurrentUser()                        // server component / route handler
requireSession(minRole?)                // throws AuthError; catch and respond
assertCsrf(req)                         // throws AuthError on mismatch

// Auth: seeding
seedAdmin({ email?, password?, name? }) // reads ADMIN_EMAIL/ADMIN_PASSWORD by default

// Email
sendEmail({ subject, body, to, cc?, bcc?, html?, askReceipt? })

// CMS
cmsListRecords(cfg, slug, opts?)
cmsCreateRecord(cfg, slug, data)
cmsUpdateRecord(cfg, slug, id, data)
cmsDeleteRecord(cfg, slug, id)
```

### Errors

```ts
import { AuthError, AuthenticationError, AuthorizationError } from "@connormccarl/nextos/server";
```

All carry a `.status` property; convert to HTTP response with:

```ts
catch (e: any) {
  return NextResponse.json({ detail: e.message }, { status: e.status ?? 500 });
}
```

---

## Roles

Built-in hierarchy: `admin` > `editor` > `viewer`. `hasRole(user, 'editor')` returns `true` for admins as well. Unknown roles get rank `0` (always denied unless they exactly match). To use custom roles, just pass them to `registerUser({ role: 'super' })` and check with `user.role === 'super'`.

---

## Periodic cleanup

Add a cron route (or external scheduler) to purge expired sessions:

```ts
// app/api/cron/cleanup/route.ts
import { purgeExpiredSessions } from "@connormccarl/nextos/server";
export async function GET() {
  return Response.json({ deleted: await purgeExpiredSessions() });
}
```

---

## Develop

```bash
yarn install
yarn build           # tsup → dist/
yarn test            # 10 unit tests, ~1.5s
yarn typecheck
```

## License

MIT
