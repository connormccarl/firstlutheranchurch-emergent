/**
 * PostgreSQL connection pool — shared singleton.
 *
 * Why a singleton on `globalThis`?
 *   Next.js dev mode hot-reloads modules, which would normally create a new
 *   Pool on every code edit. Stashing the pool on `globalThis` survives the
 *   reload and prevents connection-leak warnings on the DB side.
 *
 * Required env: `DATABASE_URL=postgresql://user:pass@host:port/db`
 * Optional knobs:
 *   - `max` (default 10) — max concurrent connections from this process
 *   - `idleTimeoutMillis` (default 30s) — when to recycle idle clients
 */
import { Pool, PoolClient } from "pg";

declare global {
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
 * Lazily create the shared pool. Safe to call multiple times — only the
 * first call instantiates a real Pool; subsequent calls return the cached
 * instance.
 */
export function createPool(cfg: DbConfig = {}): Pool {
  if (!global.__nextos_pgPool) {
    const connectionString = cfg.connectionString ?? process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error(
        "nextos: DATABASE_URL not set. Pass `connectionString` or define DATABASE_URL in env.",
      );
    }
    global.__nextos_pgPool = new Pool({
      connectionString,
      max: cfg.max ?? 10,
      idleTimeoutMillis: cfg.idleTimeoutMillis ?? 30_000,
    });
  }
  return global.__nextos_pgPool;
}

/** Get the shared pool, creating it on first access. */
export function getPool(): Pool {
  if (!global.__nextos_pgPool) return createPool();
  return global.__nextos_pgPool;
}

/**
 * Convenience wrapper around `pool.query()` that returns just the rows.
 * Parameters use `$1, $2, …` placeholders — never string-concatenate user input.
 *
 * Example:
 *   const users = await query<User>(`SELECT * FROM users WHERE email=$1`, [email]);
 */
export async function query<T = Record<string, unknown>>(
  text: string,
  params?: unknown[],
): Promise<T[]> {
  const result = await getPool().query(text, params as never[]);
  return result.rows as T[];
}

/**
 * Acquire a dedicated client (for transactions / LISTEN / temp tables) and
 * guarantee it's released even when the callback throws.
 *
 * Example:
 *   await withClient(async (client) => {
 *     await client.query("BEGIN");
 *     ...
 *     await client.query("COMMIT");
 *   });
 */
export async function withClient<T>(
  fn: (client: PoolClient) => Promise<T>,
): Promise<T> {
  const client = await getPool().connect();
  try {
    return await fn(client);
  } finally {
    client.release();
  }
}
