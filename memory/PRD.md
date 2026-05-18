# First Lutheran Church of Miami — PRD

## Original Problem Statement
First Lutheran Church of Miami web app — multilingual church site featuring worship info, events with online registration, donation system (PayPal + Zeffy), media gallery (YouTube embeds), AI spiritual assistant, contact form, scheduling with Pastor James, and pastor/musician articles.

## Architecture (as of Feb 2026 — Next.js migration)
- **Frontend & Backend**: Next.js 15 App Router (TypeScript) at `/app/frontend` — port 3000
  - All pages use App Router (`src/app/<route>/page.tsx`)
  - All React components: `'use client'` directives, located in `src/components/`
  - API routes under `src/app/api/...` (TypeScript) — replaces the previous FastAPI server
- **Database**: MongoDB (via `mongodb` Node driver) — `MONGO_URL`, `DB_NAME` from `.env`
- **Email notifications**: Nodemailer (logs only if SMTP not configured) — routed to `pastorjamesdunham@gmail.com`
- **Legacy FastAPI backend** still runs at `/app/backend` on port 8001 (no longer called from the frontend; can be retired)
- **Old CRA frontend** preserved at `/app/frontend-old` as a rollback backup

## Routes
- `/` Home, `/about`, `/events`, `/media`, `/ai-assistant`, `/schedule`, `/gallery`, `/contact`
- `/dr-tingting-article`, `/john-riley-article`, `/pastor-james-article`, `/pastor-james-video`
- `/video/[videoId]` — generic YouTube embed page

## API endpoints (Next.js route handlers)
- `GET /api` — health
- `GET/POST /api/events`, `GET/PUT/DELETE /api/events/[id]`
- `POST /api/event-registrations` (writes to MongoDB + sends email notification)
- `POST /api/contact` (writes to MongoDB + sends email notification)
- `POST /api/donations`, `GET /api/donations`

## Completed (Feb 18, 2026 — this session)
- Full migration of CRA + React Router + FastAPI to Next.js 15 App Router + TypeScript
- All 17 components migrated with router shims (`useLocation` → `usePathname`, `<Link to>` → `<Link href>`)
- All shadcn UI components have `'use client'` directive
- MongoDB + email API routes ported from FastAPI to Next.js route handlers
- Live tested end-to-end through preview URL (https://miami-lutheran-app.preview.emergentagent.com)
- All 13 page routes return 200; all 3 form endpoints (contact, event-registrations, donations) persist to MongoDB

## Backlog / Next steps
- P1: Configure real SMTP credentials (`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`) so emails actually send instead of logging only
- P1: Decommission `/app/backend` FastAPI process (no longer called)
- P2: Convert remaining `.jsx` components to `.tsx` for full TypeScript strictness
- P2: Add SSR/SSG where appropriate (Home, About can be statically generated)
- P3: Run full testing-agent regression pass on the migrated site
- P3: Deploy to production

## Test credentials
None required — all routes are public.
