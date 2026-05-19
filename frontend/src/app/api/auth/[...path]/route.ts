import { authHandlers } from "@connormccarl/nextos/server";
import { ensureBootstrap } from "@/lib/bootstrap";

const { GET: _GET, POST: _POST } = authHandlers({
  resetUrlBase:
    (process.env.NEXT_PUBLIC_SITE_URL || "https://miami-lutheran-app.preview.emergentagent.com") +
    "/reset-password",
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
