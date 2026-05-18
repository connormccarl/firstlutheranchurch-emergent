# First Lutheran Church of Miami — PRD

## Architecture (May 2026)
- **Frontend & Backend**: Next.js 15 App Router (TypeScript) at `/app/frontend` — port 3000
- **API proxy**: FastAPI at `/app/backend/server.py` forwards `/api/*` → Next.js (because the platform's ingress is hard-coded to port 8001)
- **Database**: **PostgreSQL 17** — remote managed DB at `74.208.24.75:1691` (connection string in `DATABASE_URL`). All previous MongoDB collections migrated.
- **Email**: **Zoho Mail Send API** with OAuth2 refresh-token flow (`/app/frontend/src/lib/email.ts`). Graceful fallback to console-log when Zoho env vars are unset.
- **CMS package**: standalone publishable `@flc/cms` at `/app/packages/flc-cms` (now Postgres-backed; v0.2.0)
- **Legacy**: MongoDB service is stopped. Old CRA frontend preserved at `/app/frontend-old` for rollback.

## PostgreSQL schema (`/app/frontend/src/lib/schema.sql`)
Tables: `events`, `event_registrations`, `contact_forms`, `donations`, `gallery`, `media`, `site_content` — each has `id` PK, `created_at`, `updated_at`, plus a JSONB `extra` for forward-compat.

## @flc/cms v0.2.0
PostgreSQL-backed CMS toolkit. Two entry points:
- `@flc/cms` — `AdminShell`, `Sidebar`, `PasswordGate`, `DataTable`, `RecordForm`, `ResourcePage`, `defineCmsConfig`
- `@flc/cms/server` — `signAdminCookie`, `verifyAdminCookie`, `checkAdminPassword`, generic `listRecords` / `createRecord` / `updateRecord` / `deleteRecord` (parameterized `pg` queries with safe identifier quoting)

Build: `tsup` → ESM + `.d.ts`. Tests: 7 passing (`tsx --test`).

## Zoho Mail integration
`/app/frontend/src/lib/email.ts` exposes:
- `sendEmail(opts)` — full-featured: subject, body, to, cc, bcc, html flag, askReceipt
- `sendEmailNotification(subject, body, to)` — backward-compatible boolean helper
- In-memory access-token cache (refreshed at ≥1 min before expiry)
- Region-aware base URLs (`com` / `eu` / `in` / `au`)
- Auth header uses `Zoho-oauthtoken` prefix (not `Bearer`) per Zoho docs
- Falls back to console log when any of `ZOHO_CLIENT_ID/SECRET/REFRESH_TOKEN/ACCOUNT_ID/FROM_ADDRESS` are missing

## Routes
### Public pages
`/`, `/events`, `/media`, `/ai-assistant`, `/schedule`, `/about`, `/gallery`, `/contact`, `/dr-tingting-article`, `/john-riley-article`, `/pastor-james-article`, `/pastor-james-video`, `/video/[videoId]`

### Admin (password-gated)
`/admin`, `/admin/events`, `/admin/gallery`, `/admin/media`, `/admin/site-content`, `/admin/registrations`, `/admin/contact`, `/admin/donations`, `/admin/export`

### Public APIs
- `GET/POST /api/events`, `GET/PUT/DELETE /api/events/[id]`
- `POST /api/event-registrations`, `POST /api/contact`, `POST /api/donations`
- `GET /api/export/excel`, `GET /api/export/counts`

### Admin APIs (cookie-gated)
- `POST /api/admin/login`, `POST /api/admin/logout`, `GET /api/admin/me`
- `GET/POST /api/admin/[slug]`, `PUT/DELETE /api/admin/[slug]/[id]`

## Completed this session (May 18 2026)
- Migrated all collections from MongoDB → PostgreSQL (12 events, 28 reg, 16 contact, 22 donations, 12 media)
- Built `lib/pg.ts` connection pool; rewrote every API route to use parameterized SQL
- Refactored `@flc/cms` server CRUD helpers from Mongo to Postgres; package version bumped to 0.2.0
- Implemented Zoho Mail integration with OAuth refresh-token flow
- Stopped MongoDB service; removed `mongodb` dep from the host app

## Backlog / Next steps
- P1: Fill in the 5 `ZOHO_*` env vars to enable real email sending
- P1: Rotate `ADMIN_PASSWORD` and `CMS_SECRET` for production
- P2: Add a re-run script for the MongoDB → PG migration if MongoDB is ever revived
- P2: Decommission the FastAPI proxy at deploy time
- P2: Convert remaining `.jsx` → `.tsx`
- P3: Add SSR/SSG to Home/About/Articles for SEO
- P3: Publish `@flc/cms@0.2.0` to npm
