/**
 * @module api/cron/cleanup
 *
 * Daily housekeeping. Triggered by Vercel cron via `vercel.json`
 * (schedule: 0 3 * * * UTC). Currently purges expired sessions.
 */

/**
 * Daily cron endpoint to purge expired sessions and stale login attempts.
 * Protect with CRON_SECRET if exposed publicly:
 *   curl -H "Authorization: Bearer $CRON_SECRET" https://site.com/api/cron/cleanup
 *
 * On Vercel, schedule via vercel.json:
 *   { "crons": [{ "path": "/api/cron/cleanup", "schedule": "0 3 * * *" }] }
 */
import { NextRequest, NextResponse } from "next/server";
import { purgeExpiredSessions, query } from "@connormccarl/nextos/server";

export const dynamic = "force-dynamic";

function authorize(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return true; // open in dev/preview when not configured
  const hdr = req.headers.get("authorization") || "";
  return hdr === `Bearer ${secret}`;
}

async function purgeOldLoginAttempts(): Promise<number> {
  const rows = await query<{ count: string }>(
    `WITH del AS (
       DELETE FROM login_attempts
       WHERE attempted_at < now() - INTERVAL '7 days'
       RETURNING 1
     )
     SELECT COUNT(*)::text AS count FROM del`,
  );
  return parseInt(rows[0]?.count || "0", 10);
}

async function purgeOldPasswordResets(): Promise<number> {
  const rows = await query<{ count: string }>(
    `WITH del AS (
       DELETE FROM password_resets
       WHERE expires_at < now() - INTERVAL '1 day'
       RETURNING 1
     )
     SELECT COUNT(*)::text AS count FROM del`,
  );
  return parseInt(rows[0]?.count || "0", 10);
}

async function runCleanup() {
  const [sessions, attempts, resets] = await Promise.all([
    purgeExpiredSessions(),
    purgeOldLoginAttempts(),
    purgeOldPasswordResets(),
  ]);
  return {
    ok: true,
    deleted: { sessions, login_attempts: attempts, password_resets: resets },
    ran_at: new Date().toISOString(),
  };
}

export async function GET(req: NextRequest) {
  if (!authorize(req))
    return NextResponse.json({ detail: "Unauthorized" }, { status: 401 });
  try {
    return NextResponse.json(await runCleanup());
  } catch (e) {
    return NextResponse.json(
      { detail: e instanceof Error ? e.message : "Cleanup failed" },
      { status: 500 },
    );
  }
}

// Vercel cron uses POST in some setups; support both methods.
export const POST = GET;
