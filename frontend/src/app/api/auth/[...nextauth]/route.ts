/**
 * @module api/auth/[...nextauth]
 *
 * Auth.js v5 catch-all route. Every `/api/auth/*` request flows through
 * the handlers built by NextAuth in `@connormccarl/nextos/server`:
 *
 *   GET  /api/auth/session         → current session (used by `useSession()`)
 *   GET  /api/auth/csrf            → Auth.js CSRF token
 *   GET  /api/auth/providers       → enabled providers metadata
 *   POST /api/auth/callback/credentials  → Credentials sign-in (email + password)
 *   POST /api/auth/signout         → sign out
 *
 * Our custom password-reset endpoints remain at `/api/password/*` and are
 * intentionally NOT routed through Auth.js (Auth.js's built-in email flow
 * is magic-link-only).
 */
import { handlers } from "@connormccarl/nextos/server";
import { ensureBootstrap } from "@/lib/bootstrap";

const { GET: _GET, POST: _POST } = handlers;

export async function GET(req: Request) {
  await ensureBootstrap();
  return _GET(req);
}
export async function POST(req: Request) {
  await ensureBootstrap();
  return _POST(req);
}
