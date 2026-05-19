# Test Credentials

## Admin (seeded automatically from ADMIN_EMAIL / ADMIN_PASSWORD)
- **URL**: https://miami-lutheran-app.preview.emergentagent.com/admin
- **Email**: `pastorjamesdunham@gmail.com`
- **Password**: `ChangeMe2026!`
- **Role**: `admin`
- Environment variables (in `/app/frontend/.env`):
  - `ADMIN_EMAIL=pastorjamesdunham@gmail.com`
  - `ADMIN_PASSWORD=ChangeMe2026!`

## Public auth pages
- **Forgot password**: https://miami-lutheran-app.preview.emergentagent.com/forgot-password
  - When Zoho creds are missing, the response includes a `devToken` and the page shows a dev-mode reset link to click directly.
- **Reset password**: https://miami-lutheran-app.preview.emergentagent.com/reset-password?token=…
  - Accepts a `token` query parameter from the email link.

## Cron
- **Endpoint**: `GET/POST /api/cron/cleanup`
- **Auth**: If `CRON_SECRET` env var is set, requires `Authorization: Bearer <CRON_SECRET>`. Open otherwise (preview).
- **Schedule** (Vercel): `0 3 * * *` (daily at 03:00 UTC) — see `/app/frontend/vercel.json`.
- **What it does**: purges expired sessions, login attempts older than 7 days, and password resets older than 1 day.

## PostgreSQL
- Connection: `DATABASE_URL=postgresql://firstlutheranchurch:xRkokVfKiAKW@74.208.24.75:1691/firstlutheranchurch`

## Roles
- `admin` — full access (CRUD on resources, manage users)
- `editor` — CRUD on resources, no user management
- `viewer` — read-only access
