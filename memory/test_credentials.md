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

## Auth flow (NextAuth.js / Auth.js v5)
- **Login**: `POST /api/auth/callback/credentials` with form-urlencoded `csrfToken`, `email`, `password`
- **Get CSRF token**: `GET /api/auth/csrf` → `{csrfToken}` (also sets the csrf-token cookie)
- **Session check**: `GET /api/auth/session` → `{ user: { id, email, name, role } }` when signed in, `null` otherwise
- **Logout**: `POST /api/auth/signout` (CSRF required)
- **Session cookie**: `__Secure-authjs.session-token` (HttpOnly, Secure, SameSite=Lax, 30-day expiry)
- **Session strategy**: JWT (mandatory for Auth.js Credentials provider)

## Public auth pages (custom — Auth.js doesn't ship a password-reset flow)
- **Forgot password**: https://miami-lutheran-app.preview.emergentagent.com/forgot-password
- **Reset password**: https://miami-lutheran-app.preview.emergentagent.com/reset-password?token=…
- **Endpoints**: `POST /api/password/request`, `POST /api/password/reset`

## Cron
- **Endpoint**: `GET/POST /api/cron/cleanup` (Vercel cron daily at 03:00 UTC via `vercel.json`)

## PostgreSQL
- `DATABASE_URL=postgresql://flc:xRkokVfKiAKW@74.208.24.75:1691/firstlutheranchurch`
- Schema applied via Prisma migrations (`0_init`, `1_nextauth_compat`)
- Tables: `users`, `accounts`, `sessions`, `verification_tokens`, `password_resets`, `login_attempts`

## Roles (hierarchy: admin > editor > viewer)
- `admin` — full access, manage users
- `editor` — CRUD on CMS resources
- `viewer` — read-only

## PayPal (test sandbox)
- `NEXT_PUBLIC_PAYPAL_CLIENT_ID` — set in `/app/frontend/.env`
- `NEXT_PUBLIC_PAYPAL_HOSTED_BUTTON_ID` — set in `/app/frontend/.env`
