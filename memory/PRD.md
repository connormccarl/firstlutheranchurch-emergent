# First Lutheran Church of Miami — PRD

## Architecture (Feb 2026)
- **Frontend & Backend**: Next.js 15 App Router (TypeScript) at `/app/frontend` — port 3000
- **API proxy (preview only)**: FastAPI at `/app/backend/server.py` forwards `/api/*` → Next.js. Required for the Emergent Kubernetes ingress wired to port 8001. **Not deployed in production** (Vercel runs Next.js directly; `.vercelignore` documents the exclusion).
- **Database**: PostgreSQL 17 (external) — managed by [@connormccarl/nextos](../packages/nextos)
- **Email**: Zoho Mail Send API — managed by [@connormccarl/nextos](../packages/nextos)
- **CMS + Auth toolkit**: standalone publishable `@connormccarl/nextos` v0.1.0 at `/app/packages/nextos`
- **Logo**: Self-hosted at `/app/frontend/public/flc-logo.png` (served from `/flc-logo.png`)

## @connormccarl/nextos v0.1.0
Generic Next.js + PostgreSQL backend toolkit. Two entry points:
- `@connormccarl/nextos` — `AdminShell`, `Sidebar`, `LoginForm`, `DataTable`, `RecordForm`, `ResourcePage`, `defineCmsConfig`
- `@connormccarl/nextos/server` — DB pool, migrations, full auth (passwords, sessions, CSRF, password reset, brute-force lockout, role hierarchy), Zoho Mail client, CMS CRUD, ready-to-mount `authHandlers()`

Features:
- bcrypt password hashing (cost 12, configurable via `BCRYPT_COST`)
- Opaque 32-byte session tokens (only SHA-256 hash in DB)
- HTTP-only `Secure` `SameSite=Lax` session cookies + double-submit CSRF cookie
- 30-day rolling sessions, sliding `last_seen_at` updates
- Brute-force lockout (5 failures/15 min → HTTP 429)
- User-enumeration timing protection (always runs bcrypt)
- One-shot password reset tokens (60-min TTL, invalidates all sessions on use)
- **Auth handlers now derive the reset URL origin per-request** (`x-forwarded-host`/`host`) so reset links work on preview, production and custom domains without per-env config.
- Role hierarchy `admin > editor > viewer` with `hasRole()` / `requireRole()` helpers
- Idempotent SQL schema with `migrate()`; `seedAdmin()` rotates password when env changes
- Zoho Mail Send API (OAuth2 refresh-token, region-aware) with console-log fallback
- Heavy inline TSDoc on every public function — see `/app/packages/nextos/src/*` for usage examples.

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
- ✅ Full deployment health check via Deployer Agent — **0 blockers, production-ready**
- ✅ Fixed auth reset URL to derive origin per-request (preview/prod/custom domain all work)
- ✅ Moved PayPal client ID and hosted button ID to `NEXT_PUBLIC_PAYPAL_*` env vars
- ✅ Cleaned `.gitignore` (removed `.env` blockers, added `test_credentials.md`)
- ✅ Documented FastAPI proxy as preview-only; added `/app/frontend/.vercelignore`
- ✅ Renamed all 17 application `.jsx` components to `.tsx`
- ✅ Added file-level JSDoc headers to every renamed component
- ✅ Expanded TSDoc comments across the entire `@connormccarl/nextos` package (password, session, reset, seed, pg, migrate, cms/server, cms/types)
- ✅ Updated logo to the new FLC shield (Bible / globe / chalice / dove) — self-hosted at `/flc-logo.png`

## Backlog / Next steps
- P1: Fill 5 `ZOHO_*` env vars to enable real password-reset & notification emails
- P1: Rotate `ADMIN_PASSWORD` to a strong value (currently `ChangeMe2026!`)
- P2: Add Vercel cron route verification (cleanup runs daily at 03:00 UTC)
- P3: Convert 46 shadcn UI `.jsx` components in `src/components/ui/` to `.tsx`
- P3: `npm publish @connormccarl/nextos` to the public npm registry
- P3: Add SSR/SSG to Home/About/Articles for SEO
