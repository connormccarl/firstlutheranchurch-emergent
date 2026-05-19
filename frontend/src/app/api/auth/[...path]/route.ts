/**
 * Auth API surface — login, logout, /me, request-reset, reset.
 *
 * Implementation lives in `@connormccarl/nextos/server`. We pass a *relative*
 * `resetUrlBase` so the package can derive the live origin from each request
 * (x-forwarded-host / host headers). This means the same code works on the
 * Emergent preview URL, Vercel production, and any custom domain without
 * touching environment variables.
 */
import { authHandlers } from "@connormccarl/nextos/server";
import { ensureBootstrap } from "@/lib/bootstrap";

const { GET: _GET, POST: _POST } = authHandlers({
  // Relative path → origin is resolved per-request inside the package.
  resetUrlBase: "/reset-password",
  allowRegistration: false,
  defaultRole: "viewer",
});

export async function GET(req: Parameters<typeof _GET>[0], ctx: Parameters<typeof _GET>[1]) {
  await ensureBootstrap();
  return _GET(req, ctx);
}
export async function POST(req: Parameters<typeof _POST>[0], ctx: Parameters<typeof _POST>[1]) {
  await ensureBootstrap();
  return _POST(req, ctx);
}
