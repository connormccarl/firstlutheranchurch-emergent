/**
 * Optional admin seeding helper. Safe to call on every cold start.
 *
 * Behaviour:
 *   - If no admin user exists with `ADMIN_EMAIL`, creates one with role `admin`.
 *   - If the admin already exists, ensures role=admin and is_active=true.
 *   - If the env password no longer matches the stored hash, rotates the
 *     hash (so changing ADMIN_PASSWORD in env effectively rotates the password
 *     on next start — no DB shell required).
 *
 * Reads `ADMIN_EMAIL` and `ADMIN_PASSWORD` from `process.env` unless explicit
 * values are passed. Skips silently if either is missing.
 */
import { findUserByEmail, registerUser, changePassword } from "./users.js";
import { verifyPassword } from "./password.js";
import { query } from "../db/pg.js";

export interface SeedOptions {
  email?: string;
  password?: string;
  name?: string;
}

export async function seedAdmin(opts: SeedOptions = {}): Promise<void> {
  const email = (opts.email ?? process.env.ADMIN_EMAIL ?? "").trim();
  const password = opts.password ?? process.env.ADMIN_PASSWORD ?? "";
  if (!email || !password) return;

  const existing = await findUserByEmail(email);
  if (!existing) {
    await registerUser({
      email,
      password,
      name: opts.name ?? "Administrator",
      role: "admin",
    });
    return;
  }

  // Bump role/active flag if the row already existed but was demoted/disabled.
  await query(
    `UPDATE users SET role = 'admin', is_active = true WHERE id = $1`,
    [existing.id],
  );

  // If the env password differs from the stored hash, rotate the password.
  // This is how operators rotate ADMIN_PASSWORD: change env → restart.
  const rows = await query<{ password_hash: string }>(
    `SELECT password_hash FROM users WHERE id = $1`,
    [existing.id],
  );
  if (rows[0] && !(await verifyPassword(password, rows[0].password_hash))) {
    await changePassword(existing.id, password);
  }
}
