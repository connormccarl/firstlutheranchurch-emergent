/**
 * Server-side session management.
 *
 * Design: opaque session tokens (random 32-byte URL-safe strings).
 * The plaintext token is stored only in the user's httpOnly cookie; the
 * database stores SHA-256 hash of the token. This means a database leak
 * does NOT compromise active sessions.
 *
 * Each session also carries a CSRF token, stored in a *non-httpOnly* cookie
 * + the database; client must echo it back in the X-CSRF-Token header for
 * any non-GET request.
 */
import { randomBytes, createHash, timingSafeEqual } from "crypto";
import { query } from "../db/pg.js";

export interface User {
  id: string;
  email: string;
  name: string | null;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  title: string | null;
  role: string;
  is_active: boolean;
  email_verified: boolean;
  created_at: string;
  last_login_at: string | null;
  metadata: Record<string, unknown>;
}

export interface Session {
  id: string;
  user_id: string;
  csrf_token: string;
  expires_at: string;
  user_agent: string | null;
  ip_address: string | null;
}

export const SESSION_COOKIE = "nextos_session";
export const CSRF_COOKIE = "nextos_csrf";

function ttlMs(): number {
  const days = parseInt(process.env.SESSION_TTL_DAYS || "30", 10);
  return days * 24 * 60 * 60 * 1000;
}

function generateToken(bytes = 32): string {
  return randomBytes(bytes).toString("base64url");
}

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export interface CreateSessionInput {
  userId: string;
  userAgent?: string;
  ipAddress?: string;
}

export interface CreateSessionResult {
  token: string;
  csrfToken: string;
  session: Session;
}

export async function createSession(
  input: CreateSessionInput,
): Promise<CreateSessionResult> {
  const token = generateToken();
  const csrfToken = generateToken(24);
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + ttlMs()).toISOString();

  const rows = await query<Session>(
    `INSERT INTO sessions (user_id, token_hash, csrf_token, user_agent, ip_address, expires_at)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id, user_id, csrf_token, expires_at, user_agent, ip_address`,
    [input.userId, tokenHash, csrfToken, input.userAgent ?? null, input.ipAddress ?? null, expiresAt],
  );

  return { token, csrfToken, session: rows[0] };
}

export interface ValidateSessionResult {
  user: User;
  session: Session;
}

export async function validateSession(
  token: string | undefined,
): Promise<ValidateSessionResult | null> {
  if (!token) return null;
  const tokenHash = hashToken(token);
  const rows = await query<User & Session>(
    `SELECT
       u.id, u.email, u.name, u.first_name, u.last_name, u.phone, u.title,
       u.role, u.is_active, u.email_verified,
       u.created_at, u.last_login_at, u.metadata,
       s.id AS session_id, s.user_id, s.csrf_token, s.expires_at,
       s.user_agent, s.ip_address
     FROM sessions s
     JOIN users u ON u.id = s.user_id
     WHERE s.token_hash = $1 AND s.expires_at > now() AND u.is_active = true`,
    [tokenHash],
  );
  if (!rows.length) return null;

  const r = rows[0] as never as {
    id: string;
    email: string;
    name: string | null;
    first_name: string | null;
    last_name: string | null;
    phone: string | null;
    title: string | null;
    role: string;
    is_active: boolean;
    email_verified: boolean;
    created_at: string;
    last_login_at: string | null;
    metadata: Record<string, unknown>;
    session_id: string;
    user_id: string;
    csrf_token: string;
    expires_at: string;
    user_agent: string | null;
    ip_address: string | null;
  };

  // Sliding window: bump last_seen_at and optionally extend expiry
  await query(
    `UPDATE sessions SET last_seen_at = now() WHERE id = $1`,
    [r.session_id],
  );

  return {
    user: {
      id: r.id,
      email: r.email,
      name: r.name,
      first_name: r.first_name,
      last_name: r.last_name,
      phone: r.phone,
      title: r.title,
      role: r.role,
      is_active: r.is_active,
      email_verified: r.email_verified,
      created_at: r.created_at,
      last_login_at: r.last_login_at,
      metadata: r.metadata,
    },
    session: {
      id: r.session_id,
      user_id: r.user_id,
      csrf_token: r.csrf_token,
      expires_at: r.expires_at,
      user_agent: r.user_agent,
      ip_address: r.ip_address,
    },
  };
}

export async function destroySession(token: string | undefined): Promise<void> {
  if (!token) return;
  await query(`DELETE FROM sessions WHERE token_hash = $1`, [hashToken(token)]);
}

export async function destroyAllUserSessions(userId: string): Promise<void> {
  await query(`DELETE FROM sessions WHERE user_id = $1`, [userId]);
}

export async function purgeExpiredSessions(): Promise<number> {
  const rows = await query<{ count: string }>(
    `WITH del AS (DELETE FROM sessions WHERE expires_at < now() RETURNING 1)
     SELECT COUNT(*)::text AS count FROM del`,
  );
  return parseInt(rows[0]?.count || "0", 10);
}

/* ---------- CSRF helpers ---------- */

export function compareCsrf(a: string | undefined, b: string | undefined): boolean {
  if (!a || !b || a.length !== b.length) return false;
  try {
    return timingSafeEqual(Buffer.from(a), Buffer.from(b));
  } catch {
    return false;
  }
}

/* ---------- Cookie config ---------- */

export interface CookieOptions {
  name: string;
  value: string;
  httpOnly: boolean;
  secure: boolean;
  sameSite: "lax" | "strict" | "none";
  path: string;
  maxAge: number;
}

export function sessionCookieOptions(value: string): CookieOptions {
  return {
    name: SESSION_COOKIE,
    value,
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "lax",
    path: "/",
    maxAge: Math.floor(ttlMs() / 1000),
  };
}

export function csrfCookieOptions(value: string): CookieOptions {
  return {
    name: CSRF_COOKIE,
    // CSRF cookie must be readable by JS so the client can echo it back
    value,
    httpOnly: false,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "lax",
    path: "/",
    maxAge: Math.floor(ttlMs() / 1000),
  };
}

export function clearCookieOptions(name: string): CookieOptions {
  return {
    name,
    value: "",
    httpOnly: name === SESSION_COOKIE,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  };
}
