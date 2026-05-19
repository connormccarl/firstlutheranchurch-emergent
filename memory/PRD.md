# First Lutheran Church of Miami — PRD

## Architecture (May 2026)
- **Frontend & Backend**: Next.js 15 App Router (TypeScript) at `/app/frontend` — port 3000
- **API proxy**: FastAPI at `/app/backend/server.py` forwards `/api/*` → Next.js (because the platform ingress is hard-coded to port 8001)
- **Database**: PostgreSQL 17 — managed by [@connormccarl/nextos](../packages/nextos)
- **Email**: Zoho Mail Send API — managed by [@connormccarl/nextos](../packages/nextos)
- **CMS + Auth toolkit**: standalone publishable `@connormccarl/nextos` v0.1.0 at `/app/packages/nextos`
- **Legacy**: MongoDB stopped. Old CRA frontend at `/app/frontend-old` for rollback.

## @connormccarl/nextos v0.1.0
Generic Next.js + PostgreSQL backend toolkit. Two entry points:
- `@connormccarl/nextos` — `AdminShell`, `Sidebar`, `LoginForm`, `DataTable`, `RecordForm`, `ResourcePage`, `defineCmsConfig`
- `@connormccarl/nextos/server` — DB pool, migrations, full auth (passwords, sessions, CSRF, password reset, brute-force lockout, role hierarchy), Zoho Mail client, CMS CRUD, ready-to-mount `authHandlers()`

Features in the package:
- bcrypt password hashing (cost 12, configurable via `BCRYPT_COST`)
- Opaque 32-byte session tokens, only SHA-256 hash stored in DB
- HTTP-only `Secure` `SameSite=Lax` session cookies + non-HttpOnly CSRF cookie (double-submit pattern)
- 30-day rolling sessions with sliding `last_seen_at` updates
- Brute-force lockout (5 failures/15 min → HTTP 429)
- User-enumeration timing protection (always runs bcrypt)
- One-shot password reset tokens (SHA-256 hashed, 60-min TTL, invalidates all sessions on use)
- Role hierarchy `admin > editor > viewer` with `hasRole()` / `requireRole()` helpers
- Idempotent SQL schema with `migrate()`; `seedAdmin()` reads `ADMIN_EMAIL`/`ADMIN_PASSWORD`
- Zoho Mail Send API (OAuth2 refresh-token, region-aware) with console-log fallback
- 10 unit tests, all passing

## Routes
### Public pages
`/`, `/events`, `/media`, `/ai-assistant`, `/schedule`, `/about`, `/gallery`, `/contact`, `/dr-tingting-article`, `/john-riley-article`, `/pastor-james-article`, `/pastor-james-video`, `/video/[videoId]`

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

## Completed this session (May 18 2026)
- Refactored CMS + DB + Email into a single standalone package `@connormccarl/nextos`
- Built complete user-account auth: hashing, sessions, CSRF, password reset, brute-force lockout, role hierarchy
- Added admin Users management page (`/admin/users`)
- Wrote comprehensive README (300+ lines) with examples for any Next.js app
- Added 10 unit tests; build green
- Verified end-to-end live: login, dashboard, CMS list/create/delete with CSRF, role gating, brute-force lockout

## Backlog / Next steps
- P1: Fill 5 `ZOHO_*` env vars to enable real password-reset & notification emails
- P1: Rotate `ADMIN_PASSWORD`
- P2: Add password-reset UI pages (`/forgot-password`, `/reset-password`)
- P2: Add Vercel cron route calling `purgeExpiredSessions()` daily
- P2: Decommission FastAPI proxy at deploy time
- P3: `npm publish @connormccarl/nextos` to the public npm registry
- P3: Convert remaining `.jsx` → `.tsx`
- P3: Add SSR/SSG to Home/About/Articles for SEO
