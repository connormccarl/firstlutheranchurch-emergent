/**
 * Password hashing & verification using bcrypt (cost configurable via env).
 *
 * Why bcrypt:
 *   - Battle-tested for password storage.
 *   - Built-in salt, adaptive cost factor.
 *   - Constant-time `compare` resists timing attacks.
 *
 * `BCRYPT_COST` (env, default 12) trades CPU time for security. Each +1
 * doubles work. 12 ≈ 200ms on modern hardware — a good interactive balance.
 */
import bcrypt from "bcryptjs";

const BCRYPT_COST = parseInt(process.env.BCRYPT_COST || "12", 10);

/**
 * Hash a plaintext password with bcrypt. Enforces a minimum 8-char length.
 * Throws on invalid input so we never persist a weak hash.
 */
export async function hashPassword(plain: string): Promise<string> {
  if (!plain || plain.length < 8) {
    throw new Error("Password must be at least 8 characters long");
  }
  return bcrypt.hash(plain, BCRYPT_COST);
}

/**
 * Constant-time compare a plaintext password against a stored hash.
 * Returns false (not throw) for empty inputs.
 */
export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  if (!plain || !hash) return false;
  return bcrypt.compare(plain, hash);
}

/**
 * Heuristic password strength: integer score from 0 (very weak) to 4 (strong).
 * Used by the registration / change-password UI to nudge users toward better
 * passwords. NOT a security gate — combine with a min-length policy.
 */
export function passwordStrength(p: string): number {
  let score = 0;
  if (p.length >= 8) score++;
  if (p.length >= 12) score++;
  if (/[A-Z]/.test(p) && /[a-z]/.test(p)) score++;
  if (/[0-9]/.test(p) && /[^A-Za-z0-9]/.test(p)) score++;
  return score;
}
