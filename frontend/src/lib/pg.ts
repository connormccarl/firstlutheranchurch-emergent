/**
 * PostgreSQL connection pool. Re-used across hot reloads in dev.
 */
import { Pool, PoolClient } from "pg";

const DATABASE_URL = process.env.DATABASE_URL;

declare global {
  // eslint-disable-next-line no-var
  var _pgPool: Pool | undefined;
}

if (!DATABASE_URL) {
  // Fail fast in production; allow build-time tooling to load this module
  if (process.env.NODE_ENV === "production") {
    throw new Error("DATABASE_URL is not set");
  }
}

export function getPool(): Pool {
  if (!global._pgPool) {
    global._pgPool = new Pool({
      connectionString: DATABASE_URL,
      max: 10,
      idleTimeoutMillis: 30_000,
    });
  }
  return global._pgPool;
}

export async function query<T = Record<string, unknown>>(
  text: string,
  params?: unknown[],
): Promise<T[]> {
  const pool = getPool();
  const result = await pool.query(text, params as never[]);
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
