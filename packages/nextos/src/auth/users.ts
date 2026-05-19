/**
 * User management: register, login, lookup, role checks.
 */
import { query, withClient } from "../db/pg.js";
import { hashPassword, verifyPassword } from "./password.js";
import type { User } from "./session.js";

export type Role = "admin" | "editor" | "viewer" | string;

/**
 * Role hierarchy: admin > editor > viewer.
 * `requireRole(user, 'editor')` returns true for admins as well.
 */
const ROLE_RANK: Record<string, number> = {
  viewer: 1,
  editor: 2,
  admin: 3,
};

export function hasRole(user: { role: string } | null | undefined, required: Role): boolean {
  if (!user) return false;
  const userRank = ROLE_RANK[user.role] ?? 0;
  const requiredRank = ROLE_RANK[required] ?? 0;
  return userRank >= requiredRank;
}

export function requireRole<T extends { role: string }>(user: T | null, required: Role): T {
  if (!hasRole(user, required)) {
    throw new AuthorizationError(`Role '${required}' required`);
  }
  return user as T;
}

export class AuthError extends Error {
  status: number;
  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}
export class AuthorizationError extends AuthError {
  constructor(message: string) {
    super(message, 403);
  }
}
export class AuthenticationError extends AuthError {
  constructor(message: string) {
    super(message, 401);
  }
}

/* ---------- User CRUD ---------- */

export interface RegisterInput {
  email: string;
  password: string;
  name?: string;
  role?: Role;
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export async function findUserByEmail(email: string): Promise<User | null> {
  const rows = await query<User>(
    `SELECT id, email, name, role, is_active, email_verified, created_at, last_login_at, metadata
     FROM users WHERE LOWER(email) = $1`,
    [normalizeEmail(email)],
  );
  return rows[0] ?? null;
}

export async function findUserById(id: string): Promise<User | null> {
  const rows = await query<User>(
    `SELECT id, email, name, role, is_active, email_verified, created_at, last_login_at, metadata
     FROM users WHERE id = $1`,
    [id],
  );
  return rows[0] ?? null;
}

export async function registerUser(input: RegisterInput): Promise<User> {
  const email = normalizeEmail(input.email);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new AuthError("Invalid email address");
  }
  const existing = await findUserByEmail(email);
  if (existing) throw new AuthError("Email already registered");

  const password_hash = await hashPassword(input.password);
  const role = input.role ?? "viewer";
  const rows = await query<User>(
    `INSERT INTO users (email, password_hash, name, role)
     VALUES ($1, $2, $3, $4)
     RETURNING id, email, name, role, is_active, email_verified, created_at, last_login_at, metadata`,
    [email, password_hash, input.name ?? null, role],
  );
  return rows[0];
}

export interface LoginInput {
  email: string;
  password: string;
  ipAddress?: string;
}

export async function authenticateUser(input: LoginInput): Promise<User> {
  const email = normalizeEmail(input.email);
  const rows = await query<{ id: string; password_hash: string; is_active: boolean }>(
    `SELECT id, password_hash, is_active FROM users WHERE LOWER(email) = $1`,
    [email],
  );

  // Always run bcrypt compare to mitigate user-enumeration timing attacks.
  const hash = rows[0]?.password_hash ?? "$2a$12$invalidinvalidinvalidinvalidinvalidinvalidinvalidinvalid";
  const valid = await verifyPassword(input.password, hash);

  await logLoginAttempt(`${input.ipAddress ?? "unknown"}:${email}`, valid, input.ipAddress);

  if (!rows.length || !valid) {
    throw new AuthenticationError("Invalid email or password");
  }
  if (!rows[0].is_active) {
    throw new AuthenticationError("Account is disabled");
  }

  await query(`UPDATE users SET last_login_at = now() WHERE id = $1`, [rows[0].id]);

  const user = await findUserById(rows[0].id);
  if (!user) throw new AuthenticationError("User not found");
  return user;
}

export async function changePassword(userId: string, newPassword: string): Promise<void> {
  const password_hash = await hashPassword(newPassword);
  await query(`UPDATE users SET password_hash = $1, updated_at = now() WHERE id = $2`, [
    password_hash,
    userId,
  ]);
}

export async function listUsers(): Promise<User[]> {
  return query<User>(
    `SELECT id, email, name, role, is_active, email_verified, created_at, last_login_at, metadata
     FROM users ORDER BY created_at DESC`,
  );
}

export async function setUserRole(userId: string, role: Role): Promise<User | null> {
  const rows = await query<User>(
    `UPDATE users SET role = $1, updated_at = now() WHERE id = $2
     RETURNING id, email, name, role, is_active, email_verified, created_at, last_login_at, metadata`,
    [role, userId],
  );
  return rows[0] ?? null;
}

export async function setUserActive(userId: string, isActive: boolean): Promise<User | null> {
  const rows = await query<User>(
    `UPDATE users SET is_active = $1, updated_at = now() WHERE id = $2
     RETURNING id, email, name, role, is_active, email_verified, created_at, last_login_at, metadata`,
    [isActive, userId],
  );
  return rows[0] ?? null;
}

export async function deleteUser(userId: string): Promise<boolean> {
  const result = await withClient(async (c) => c.query("DELETE FROM users WHERE id = $1", [userId]));
  return (result.rowCount ?? 0) > 0;
}

/* ---------- Brute-force protection ---------- */

async function logLoginAttempt(
  identifier: string,
  succeeded: boolean,
  ipAddress?: string,
): Promise<void> {
  await query(
    `INSERT INTO login_attempts (identifier, succeeded, ip_address) VALUES ($1, $2, $3)`,
    [identifier, succeeded, ipAddress ?? null],
  );
}

export interface LockoutCheck {
  locked: boolean;
  retryAfterSeconds: number;
  failedAttempts: number;
}

export async function checkLockout(identifier: string): Promise<LockoutCheck> {
  const maxFailures = parseInt(process.env.MAX_LOGIN_FAILURES || "5", 10);
  const windowMin = parseInt(process.env.LOGIN_LOCKOUT_MINUTES || "15", 10);

  const rows = await query<{ count: string; oldest: string | null }>(
    `SELECT
       COUNT(*)::text AS count,
       MIN(attempted_at)::text AS oldest
     FROM login_attempts
     WHERE identifier = $1
       AND succeeded = false
       AND attempted_at > now() - ($2 || ' minutes')::interval`,
    [identifier, windowMin.toString()],
  );
  const failed = parseInt(rows[0]?.count || "0", 10);
  if (failed < maxFailures) {
    return { locked: false, retryAfterSeconds: 0, failedAttempts: failed };
  }
  const oldest = rows[0]?.oldest ? new Date(rows[0].oldest).getTime() : Date.now();
  const retryAt = oldest + windowMin * 60 * 1000;
  const retryAfter = Math.max(0, Math.floor((retryAt - Date.now()) / 1000));
  return { locked: true, retryAfterSeconds: retryAfter, failedAttempts: failed };
}
