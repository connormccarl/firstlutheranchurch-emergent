/**
 * One-shot schema runner.
 *
 * All bundled DDL uses `IF NOT EXISTS` so this is idempotent and safe to
 * call on every cold start. The first call applies the schema; subsequent
 * calls become no-ops thanks to the in-process `migrated` flag.
 *
 * Typical usage:
 *   // In a "bootstrap" module that runs at first request:
 *   import { migrate, seedAdmin } from "@connormccarl/nextos/server";
 *   await migrate();
 *   await seedAdmin();
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

/**
 * Apply the schema. Call once at app startup (the in-memory guard prevents
 * accidental re-runs within the same process). Pass `force: true` in tests
 * to re-apply the schema between test suites.
 */
export async function migrate(opts: MigrateOptions = {}): Promise<void> {
  if (migrated && !opts.force) return;
  const sql = opts.sql ?? SCHEMA_SQL;
  await getPool().query(sql);
  migrated = true;
}
