# Test Credentials

## Admin (seeded automatically from ADMIN_EMAIL / ADMIN_PASSWORD)
- **URL**: https://miami-lutheran-app.preview.emergentagent.com/admin
- **Email**: `pastorjamesdunham@gmail.com`
- **Password**: `ChangeMe2026!`
- **Profile**: James Dunham, Senior Pastor, 305-373-4457
- **Role**: `admin`
- Environment variables (in `/app/frontend/.env`):
  - `ADMIN_EMAIL=pastorjamesdunham@gmail.com`
  - `ADMIN_PASSWORD=ChangeMe2026!`

## Additional test user
- **Email**: `tingting@flc.org`
- **Password**: `TestPass2026!`
- **Profile**: Tingting Chen, Director of Music, 305-555-9999
- **Role**: `editor`

## Public auth pages
- **Forgot password**: https://miami-lutheran-app.preview.emergentagent.com/forgot-password
- **Reset password**: https://miami-lutheran-app.preview.emergentagent.com/reset-password?token=…
- Note: reset links now resolve their origin from the live request, so they
  also work on the production Vercel domain and any custom DNS host.

## Cron
- **Endpoint**: `GET/POST /api/cron/cleanup` (Vercel cron daily at 03:00 UTC via `vercel.json`)

## PostgreSQL
- `DATABASE_URL=postgresql://firstlutheranchurch:xRkokVfKiAKW@74.208.24.75:1691/firstlutheranchurch`

## Roles
- `admin` — full access (CRUD on resources, manage users)
- `editor` — CRUD on resources, no user management
- `viewer` — read-only access

## PayPal (test sandbox)
- `NEXT_PUBLIC_PAYPAL_CLIENT_ID` — set in `/app/frontend/.env`
- `NEXT_PUBLIC_PAYPAL_HOSTED_BUTTON_ID` — set in `/app/frontend/.env`
