/**
 * PrismaClient singleton + Prisma-backed `query()` / `withClient()` helpers.
 *
 * This is a drop-in replacement for the old `pg`-Pool layer (`db/pg.ts`).
 * Every consumer that used to call `query()` or `withClient()` keeps working
 * unchanged — they're now thin wrappers around `$queryRawUnsafe()` and the
 * Prisma client respectively.
 *
 * ## Singleton pattern (Next.js hot reload safe)
 * Next.js dev mode hot-reloads modules, which would otherwise create a new
 * `PrismaClient` (and therefore a new pg connection pool) on every code
 * change — quickly exhausting the database's connection limit. We stash the
 * client on `globalThis` so the same instance survives reloads.
 *
 * ## Driver adapter
 * Under Prisma 7 the recommended way to talk to PostgreSQL is via the
 * `@prisma/adapter-pg` driver adapter wrapping a `pg.Pool`. This delegates
 * pooling to the battle-tested `pg` library, removes the need for the
 * separate Rust query engine binary, and keeps the bundled package small.
 *
 * ## Identifier safety
 * For dynamic-table CMS queries we still need raw SQL with interpolated
 * identifiers. We expose `assertSafeIdentifier()` so the CMS layer can
 * validate table/column names BEFORE passing them to `$queryRawUnsafe`.
 *
 * Required env: `DATABASE_URL=postgresql://user:pass@host:port/db`
 */
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.js";

/** Cached on globalThis so hot reload re-uses the same connection pool. */
declare global {
  // eslint-disable-next-line no-var
  var __nextos_prisma: PrismaClient | undefined;
  // eslint-disable-next-line no-var
  var __nextos_pgPool: Pool | undefined;
}

export interface DbConfig {
  /** Override env DATABASE_URL with an explicit connection string. */
  connectionString?: string;
  /** Pool size cap. Default: 10. */
  max?: number;
  /** Idle client timeout in ms. Default: 30_000. */
  idleTimeoutMillis?: number;
}

/**
 * Lazily create (or return) the shared PrismaClient. Safe to call any number
 * of times — only the first call actually instantiates the client.
 *
 * Throws when `DATABASE_URL` is missing — failing fast is preferable to
 * silently using a bogus connection.
 */
export function createPool(cfg: DbConfig = {}): PrismaClient {
  if (!global.__nextos_prisma) {
    const connectionString = cfg.connectionString ?? process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error(
        "nextos: DATABASE_URL not set. Pass `connectionString` or define DATABASE_URL in env.",
      );
    }
    const pool = new Pool({
      connectionString,
      max: cfg.max ?? 10,
      idleTimeoutMillis: cfg.idleTimeoutMillis ?? 30_000,
    });
    global.__nextos_pgPool = pool;
    const adapter = new PrismaPg(pool);
    global.__nextos_prisma = new PrismaClient({ adapter });
  }
  return global.__nextos_prisma;
}

/** Get the shared PrismaClient, creating it on first access. */
export function getPool(): PrismaClient {
  if (!global.__nextos_prisma) return createPool();
  return global.__nextos_prisma;
}

/**
 * Validate an identifier (table or column name) so it's safe to interpolate
 * into a raw SQL string. Rejects anything that isn't a plain
 * `[A-Za-z_][A-Za-z0-9_]*` identifier — so a malicious slug like
 * `"; DROP TABLE users; --` throws rather than executing.
 *
 * Always call this before concatenating identifiers into raw SQL passed to
 * `$queryRawUnsafe`.
 */
export function assertSafeIdentifier(name: string): string {
  if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(name)) {
    throw new Error(`Unsafe identifier: ${name}`);
  }
  return name;
}

/**
 * Drop-in replacement for the old `pg`-style `query()`. Runs raw SQL with
 * positional parameters and returns just the rows.
 *
 * NOTE: backed by Prisma's `$queryRawUnsafe`, which is safe ONLY when:
 *   - all VALUES are passed via the `params` array (Prisma parameterises them)
 *   - all IDENTIFIERS interpolated into `text` have been validated by
 *     `assertSafeIdentifier()` first.
 *
 * Example:
 *   const users = await query<User>(`SELECT * FROM users WHERE email=$1`, [email]);
 */
export async function query<T = Record<string, unknown>>(
  text: string,
  params: unknown[] = [],
): Promise<T[]> {
  const rows = (await getPool().$queryRawUnsafe(text, ...params)) as T[];
  return rows;
}

/**
 * Acquire the shared Prisma client for a callback. Kept for API parity with
 * the old `pg`-Pool `withClient()` — but Prisma manages the underlying
 * connection itself, so all you really need is the client.
 *
 * Example:
 *   const ok = await withClient(async (client) => {
 *     return client.$executeRaw`DELETE FROM users WHERE id = ${id}`;
 *   });
 */
export async function withClient<T>(
  fn: (client: PrismaClient) => Promise<T>,
): Promise<T> {
  return fn(getPool());
}

/**
 * Direct access to the typed Prisma client for callers that want
 * model-level (`prisma.user.findMany()`) queries instead of raw SQL.
 */
export function getPrisma(): PrismaClient {
  return getPool();
}
