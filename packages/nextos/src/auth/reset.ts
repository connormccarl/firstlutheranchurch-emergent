/**
 * Password reset flow:
 *   1. requestPasswordReset(email) → creates a one-shot token and emails the user
 *      (token is shown only once; only its SHA-256 hash is stored)
 *   2. consumePasswordResetToken(token, newPassword) → validates and updates
 */
import { randomBytes, createHash } from "crypto";
import { query } from "../db/pg.js";
import { findUserByEmail, changePassword, AuthError } from "./users.js";
import { sendEmail } from "../email/zoho.js";

const RESET_TTL_MIN = parseInt(process.env.PASSWORD_RESET_TTL_MINUTES || "60", 10);

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export interface RequestResetOptions {
  /** Full URL of the reset page on the consuming app, e.g. https://site.com/reset-password */
  resetUrlBase: string;
  /** Optional override; defaults to ZOHO_FROM_ADDRESS */
  from?: string;
  /** Optional override for the email subject */
  subject?: string;
}

export interface RequestResetResult {
  ok: boolean;
  /** Set when no real email was sent (so caller can show it once for dev). */
  devToken?: string;
}

export async function requestPasswordReset(
  email: string,
  opts: RequestResetOptions,
): Promise<RequestResetResult> {
  const user = await findUserByEmail(email);
  if (!user) {
    // Don't leak whether the email exists
    return { ok: true };
  }

  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + RESET_TTL_MIN * 60_000).toISOString();
  await query(
    `INSERT INTO password_resets (user_id, token_hash, expires_at) VALUES ($1, $2, $3)`,
    [user.id, hashToken(token), expiresAt],
  );

  const url = `${opts.resetUrlBase}?token=${encodeURIComponent(token)}`;
  const subject = opts.subject ?? "Password reset request";
  const body = [
    `Hi${user.name ? " " + user.name : ""},`,
    "",
    "Someone requested a password reset for your account.",
    `If that was you, click the link below within the next ${RESET_TTL_MIN} minutes:`,
    "",
    url,
    "",
    "If you did not request this, you can safely ignore this email.",
  ].join("\n");

  const result = await sendEmail({ subject, body, to: user.email, html: false });

  // In dev (no Zoho creds), we surface the token so the operator can complete the flow
  return { ok: true, devToken: result.fallback === "logged" ? token : undefined };
}

export interface ConsumeResetInput {
  token: string;
  newPassword: string;
}

export async function consumePasswordResetToken(input: ConsumeResetInput): Promise<void> {
  const rows = await query<{ id: string; user_id: string; used_at: string | null; expires_at: string }>(
    `SELECT id, user_id, used_at, expires_at FROM password_resets WHERE token_hash = $1`,
    [hashToken(input.token)],
  );
  const row = rows[0];
  if (!row) throw new AuthError("Invalid or expired token");
  if (row.used_at) throw new AuthError("Token already used");
  if (new Date(row.expires_at).getTime() < Date.now()) {
    throw new AuthError("Token expired");
  }
  await changePassword(row.user_id, input.newPassword);
  await query(`UPDATE password_resets SET used_at = now() WHERE id = $1`, [row.id]);
  // Invalidate all existing sessions for this user
  await query(`DELETE FROM sessions WHERE user_id = $1`, [row.user_id]);
}
