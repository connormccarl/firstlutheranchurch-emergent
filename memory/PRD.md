# First Lutheran Church of Miami — PRD

## Original Problem Statement
First Lutheran Church of Miami web app — multilingual church site with worship info, events with online registration, donation system (PayPal + Zeffy), media gallery (YouTube embeds), AI spiritual assistant, contact form, scheduling, and pastor/musician articles. **Now also bundled with a reusable CMS package (`@flc/cms`)** for pastor & staff to manage content.

## Architecture (Feb 2026)
- **Frontend & Backend**: Next.js 15 App Router (TypeScript) at `/app/frontend` — port 3000
- **API Proxy**: thin FastAPI at `/app/backend/server.py` on port 8001 that forwards every `/api/*` request to Next.js (the platform's ingress hardcodes `/api/*` → 8001)
- **Database**: MongoDB
- **CMS package**: standalone publishable `@flc/cms` at `/app/packages/flc-cms`
- **Old CRA frontend**: preserved at `/app/frontend-old` for rollback

## /admin section
- Password-gated (HMAC-signed cookie, 12 h TTL)
- Distinct dashboard with dark sidebar
- Manages: Events (CRUD), Gallery (CRUD), Media (CRUD), Site Content (CRUD), Registrations (read-only), Contact Submissions (read-only), Donations (read-only)
- Plus: `/admin/export` — Excel workbook export

## @flc/cms — NPM package
Standalone, publishable at `/app/packages/flc-cms`. Two entry points:
- `@flc/cms` — React components: `AdminShell`, `Sidebar`, `PasswordGate`, `DataTable`, `RecordForm`, `ResourcePage`, `defineCmsConfig`
- `@flc/cms/server` — server helpers: `signAdminCookie`, `verifyAdminCookie`, `checkAdminPassword`, `listRecords`, `createRecord`, `updateRecord`, `deleteRecord`

**Build**: `tsup` → ESM + `.d.ts`.
**Tests**: 7 passing (`tsx --test`).

## Routes (host app)
- Public: `/`, `/events`, `/media`, `/ai-assistant`, `/schedule`, `/about`, `/gallery`, `/contact`, `/dr-tingting-article`, `/john-riley-article`, `/pastor-james-article`, `/pastor-james-video`, `/video/[videoId]`
- Admin (password-gated): `/admin`, `/admin/events`, `/admin/gallery`, `/admin/media`, `/admin/site-content`, `/admin/registrations`, `/admin/contact`, `/admin/donations`, `/admin/export`

## API endpoints
### Public
- `GET/POST /api/events`, `GET/PUT/DELETE /api/events/[id]`
- `POST /api/event-registrations`, `POST /api/contact`, `POST /api/donations`
- `GET /api/export/excel`, `GET /api/export/counts`

### Admin (cookie-gated)
- `POST /api/admin/login`, `POST /api/admin/logout`, `GET /api/admin/me`
- `GET/POST /api/admin/[slug]`, `PUT/DELETE /api/admin/[slug]/[id]`

## Completed in current session (May 18 2026)
- Full CRA → Next.js 15 App Router (TS) migration
- FastAPI → Next.js API routes for all backend logic, plus FastAPI proxy shim
- Excel export feature (admin + direct API)
- `@flc/cms` standalone NPM package (src, build, tsup, 7 unit tests, README)
- `/admin` dashboard: password gate, sidebar, dashboard with live counts, CRUD pages for Events / Gallery / Media / Site Content, read-only views for Registrations / Contact / Donations

## Backlog / Next steps
- P1: Wire real SMTP credentials so contact/registration emails actually send
- P1: Rotate `ADMIN_PASSWORD` and `CMS_SECRET` before going to production
- P2: Decommission FastAPI proxy at deploy time (route `/api/*` directly to Next.js)
- P2: Convert remaining `.jsx` to `.tsx`
- P2: Add SSR/SSG to Home/About/Articles for SEO
- P3: Publish `@flc/cms` to npm (`npm publish --access public`)
- P3: Run full testing-agent regression pass on the new CMS flows
