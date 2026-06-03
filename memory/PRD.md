# First Lutheran Church of Miami — PRD

## Architecture (Feb 2026)
- **Frontend & Backend**: Next.js 15 App Router (TypeScript) at `/app/frontend` — port 3000
- **API proxy (preview only)**: FastAPI at `/app/backend/server.py` forwards `/api/*` → Next.js. Required for the Emergent Kubernetes ingress wired to port 8001. **Not deployed in production** (Vercel runs Next.js directly; `.vercelignore` documents the exclusion).
- **Database**: PostgreSQL 17 (external @ `74.208.24.75:1691`) — accessed via **Prisma 7.8** with the `@prisma/adapter-pg` driver adapter, managed by [@connormccarl/nextos](../packages/nextos)
- **Email**: Zoho Mail Send API — managed by [@connormccarl/nextos](../packages/nextos)
- **CMS + Auth toolkit**: standalone publishable `@connormccarl/nextos` v0.1.0 at `/app/packages/nextos`
- **Logo**: Self-hosted at `/app/frontend/public/flc-logo.png` (served from `/flc-logo.png`)

## @connormccarl/nextos v0.1.0
Generic Next.js + PostgreSQL backend toolkit. Two entry points:
- `@connormccarl/nextos` — `AdminShell`, `Sidebar`, `LoginForm`, `DataTable`, `RecordForm`, `ResourcePage`, `defineCmsConfig`
- `@connormccarl/nextos/server` — Prisma client + helpers, migrations, full auth (passwords, sessions, CSRF, password reset, brute-force lockout, role hierarchy), Zoho Mail client, CMS CRUD, ready-to-mount `authHandlers()`

Features:
- **Prisma ORM 7.8** with `prisma-client` generator + `@prisma/adapter-pg` driver adapter
- Hot-reload-safe Prisma singleton on `globalThis`
- Backwards-compatible `query()` and `withClient()` helpers (now backed by `prisma.$queryRawUnsafe`)
- `assertSafeIdentifier()` exported for CMS dynamic-table queries
- Typed Prisma models for `User`, `Session`, `PasswordReset`, `LoginAttempt`
- Dynamic CMS tables intentionally unmodelled → consumed via `$queryRawUnsafe`
- bcrypt password hashing (cost 12, configurable via `BCRYPT_COST`)
- Opaque 32-byte session tokens (only SHA-256 hash in DB)
- HTTP-only `Secure` `SameSite=Lax` session cookies + double-submit CSRF cookie
- 30-day rolling sessions, sliding `last_seen_at`
- Brute-force lockout (5 failures / 15 min → HTTP 429)
- One-shot password reset tokens (60-min TTL, invalidates sessions on use)
- Reset URL origin derived per-request (preview / prod / custom domain all work)
- Role hierarchy `admin > editor > viewer`
- `seedAdmin()` rotates password automatically when `ADMIN_PASSWORD` env changes
- Zoho Mail Send API (OAuth2 refresh-token, region-aware) with console-log fallback
- Heavy inline TSDoc + JSDoc across every public function & module

## Prisma workflow
- **Schema**: `/app/packages/nextos/prisma/schema.prisma`
- **Config**: `/app/packages/nextos/prisma.config.ts`
- **Generated client**: `/app/packages/nextos/src/generated/prisma/` (bundled by tsup)
- **Generate**: `yarn prisma:generate` (auto-runs before `yarn build`)
- **Pulling from existing DB**: `yarn prisma db pull` (requires DB connectivity)
- **Baseline (run once on first connection)**:
  ```
  cd /app/packages/nextos
  ./node_modules/.bin/prisma migrate diff --from-empty \
      --to-schema-datamodel prisma/schema.prisma --script \
      > prisma/migrations/0_init/migration.sql
  ./node_modules/.bin/prisma migrate resolve --applied 0_init
  ```
- **Schema changes going forward**: edit `schema.prisma` → `yarn prisma migrate dev --name <change>` (dev) → `yarn prisma migrate deploy` (prod/CI)
- **Legacy `migrate()` (called by `lib/bootstrap.ts`)** still applies the bundled idempotent SQL as a defensive fallback — safe with Prisma migrations because all DDL uses `IF NOT EXISTS`.

## Routes
### Public pages
`/`, `/events`, `/media`, `/ai-assistant`, `/schedule`, `/about`, `/gallery`, `/contact`, `/dr-tingting-article`, `/john-riley-article`, `/pastor-james-article`, `/pastor-james-video`, `/video/[videoId]`, `/forgot-password`, `/reset-password`

### Admin (session + role gated)
`/admin`, `/admin/events`, `/admin/gallery`, `/admin/media`, `/admin/site-content`, `/admin/registrations`, `/admin/contact`, `/admin/donations`, `/admin/users`, `/admin/export`

### Public APIs
- `GET/POST /api/events`, `GET/PUT/DELETE /api/events/[id]`
- `POST /api/event-registrations`, `POST /api/contact`, `POST /api/donations`
- `GET /api/export/excel`, `GET /api/export/counts`

### Auth APIs (mounted via `authHandlers`)
- `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me`
- `POST /api/auth/register` (currently disabled; only admins create users)
- `POST /api/auth/request-reset`, `POST /api/auth/reset`

### Admin APIs (session + CSRF + role gated)
- `GET/POST /api/admin/[slug]`, `PUT/DELETE /api/admin/[slug]/[id]`
- `GET/POST /api/admin-users`, `PUT/DELETE /api/admin-users/[id]`

## Completed this session (Feb 19 2026)
- ✅ Migrated entire DB layer from raw `pg.Pool` to **Prisma 7.8** with driver adapter
- ✅ Authored `prisma/schema.prisma` (User / Session / PasswordReset / LoginAttempt) + `prisma.config.ts`
- ✅ Generated Prisma client into `src/generated/prisma/`, wired `prisma generate` into the tsup `build` script
- ✅ Re-implemented `query()` / `withClient()` as Prisma-backed shims so no consumer needed to be rewritten
- ✅ Exported `getPrisma()` + `assertSafeIdentifier()` for typed/raw access
- ✅ Updated `tsup.config.ts` to mark `@prisma/client` + `@prisma/adapter-pg` as external
- ✅ Added file-level JSDoc/TSDoc headers to all 14 API route handlers, all 5 admin pages, `lib/bootstrap.ts`, `cms.config.ts`, and all 6 NextOS React components
- ✅ Verified package builds clean (`dist/server.js` 55KB, `dist/server.d.ts` 269KB with full Prisma types)
- ✅ Verified Next.js compiles and serves static pages (Home/About/Events all 200)
- ⚠ DB endpoints (login, /me, etc.) currently time out because the **external PostgreSQL host at 74.208.24.75:1691 is unreachable from the preview pod** (same TCP timeout before our code changes — this is an infrastructure/network issue, not a code issue). All paths recover automatically once the host is reachable again.

## Backlog / Next steps
- 🔴 **P0**: Restore external PostgreSQL connectivity (currently TCP timeout — verify with `nc -zv 74.208.24.75 1691` or check IONOS/host firewall)
- 🟢 **P1**: Once DB is back, run baseline migration (`prisma migrate diff` + `prisma migrate resolve --applied 0_init`)
- 🟢 **P1**: Fill 5 `ZOHO_*` env vars to enable real password-reset & notification emails
- 🟢 **P1**: Rotate `ADMIN_PASSWORD` (just change env + restart — `seedAdmin` rotates the stored hash)
- 🟡 **P2**: Verify Vercel cron `/api/cron/cleanup` runs daily after deploy
- 🔵 **P3**: Gradually migrate raw `query()` / `withClient()` calls to typed Prisma model methods (`prisma.user.findMany()`, etc.)
- 🔵 **P3**: Convert remaining 46 shadcn `ui/*.jsx` to `.tsx` with proper `forwardRef` types
- 🔵 **P3**: `npm publish @connormccarl/nextos` to the public npm registry
- 🔵 **P3**: SSR/SSG on Home/About/Articles for SEO
