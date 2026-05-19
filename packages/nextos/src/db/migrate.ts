/**
 * One-shot schema runner. Idempotent (all DDL uses IF NOT EXISTS).
 */
import { getPool } from "./pg.js";
import { SCHEMA_SQL } from "./schema-sql.js";

let migrated = false;

export interface MigrateOptions {
  /** Custom SQL to run instead of the bundled schema. */
  sql?: string;
  /** Skip the in-memory "migrated" guard (useful in tests). */
  force?: boolean;
}

export async function migrate(opts: MigrateOptions = {}): Promise<void> {
  if (migrated && !opts.force) return;
  const sql = opts.sql ?? SCHEMA_SQL;
  await getPool().query(sql);
  migrated = true;
}
