/**
 * PostgreSQL connection pool. Re-uses a single pool across hot reloads.
 */
import { Pool, PoolClient } from "pg";

declare global {
  // eslint-disable-next-line no-var
  var __nextos_pgPool: Pool | undefined;
}

export interface DbConfig {
  connectionString?: string;
  max?: number;
  idleTimeoutMillis?: number;
}

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

export function getPool(): Pool {
  if (!global.__nextos_pgPool) return createPool();
  return global.__nextos_pgPool;
}

export async function query<T = Record<string, unknown>>(
  text: string,
  params?: unknown[],
): Promise<T[]> {
  const result = await getPool().query(text, params as never[]);
  return result.rows as T[];
}

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
