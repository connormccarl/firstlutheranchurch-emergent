/**
 * @module api/password
 *
 * Custom password-reset routes that live OUTSIDE the Auth.js catch-all
 * (`/api/auth/*`) because Auth.js's built-in email flow only supports
 * magic links, not the email-token → set-new-password flow we use.
 *
 *   POST /api/password/request   { email }                → always 200
 *   POST /api/password/reset     { token, password }      → 200 or 4xx
 *
 * Implementation lives in the NextOS package
 * (`requestPasswordReset`, `consumePasswordResetToken`). Reset links are
 * rendered with the live request origin so they work on preview, prod,
 * and any custom domain.
 */
import { NextRequest, NextResponse } from "next/server";
import {
  requestPasswordReset,
  consumePasswordResetToken,
  AuthError,
} from "@connormccarl/nextos/server";
import { ensureBootstrap } from "@/lib/bootstrap";

function resolveResetUrlBase(req: NextRequest): string {
  const proto =
    req.headers.get("x-forwarded-proto") ??
    req.nextUrl.protocol.replace(":", "") ??
    "https";
  const host =
    req.headers.get("x-forwarded-host") ??
    req.headers.get("host") ??
    req.nextUrl.host;
  return `${proto}://${host}/reset-password`;
}

function err(e: unknown) {
  if (e instanceof AuthError)
    return NextResponse.json({ detail: e.message }, { status: e.status });
  return NextResponse.json(
    { detail: e instanceof Error ? e.message : "Failed" },
    { status: 400 },
  );
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ action: string }> },
) {
  await ensureBootstrap();
  const { action } = await params;

  try {
    const body = await req.json();

    if (action === "request") {
      if (!body?.email) throw new AuthError("Email required", 400);
      const result = await requestPasswordReset(body.email, {
        resetUrlBase: resolveResetUrlBase(req),
      });
      // Never leak whether the email exists. devToken only surfaces when
      // Zoho isn't configured (so QA can still complete the flow).
      return NextResponse.json({ ok: true, devToken: result.devToken });
    }

    if (action === "reset") {
      if (!body?.token || !body?.password)
        throw new AuthError("Token and password required", 400);
      await consumePasswordResetToken({
        token: body.token,
        newPassword: body.password,
      });
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ detail: "Not found" }, { status: 404 });
  } catch (e) {
    return err(e);
  }
}
