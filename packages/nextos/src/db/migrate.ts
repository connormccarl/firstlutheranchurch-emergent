/**
 * Schema bootstrap.
 *
 * As of the Prisma migration, schema management has shifted to Prisma Migrate
 * (`prisma migrate deploy` runs in CI/CD; the existing DB was baselined with
 * `prisma migrate resolve --applied 0_init`). However, we keep `migrate()`
 * around for two reasons:
 *
 *   1. **Backwards compatibility.** The Next.js bootstrap (`lib/bootstrap.ts`)
 *      calls `migrate()` on first server-side import. Removing the export
 *      would break consumers we don't control.
 *   2. **First-run convenience.** When a brand-new database is bootstrapped
 *      without running the Prisma CLI yet, we still want the auth tables to
 *      exist so login/seedAdmin can succeed. The bundled SQL is idempotent
 *      (`CREATE TABLE IF NOT EXISTS …`) so this is safe to run repeatedly.
 *
 * Going forward, schema changes should be made by editing
 * `prisma/schema.prisma` and running `prisma migrate dev`. Update
 * `SCHEMA_SQL` (in `schema-sql.ts`) only to keep the legacy bootstrap path
 * in sync — it does NOT replace migrations.
 */
import { getPool } from "./pg.js";
import { SCHEMA_SQL } from "./schema-sql.js";

let migrated = false;

export interface MigrateOptions {
  /** Custom SQL to run instead of the bundled schema. */
  sql?: string;
  /** Skip the in-memory "already migrated" guard (useful in tests). */
  force?: boolean;
}

/**
 * Apply the legacy idempotent schema. In a Prisma-managed setup this is a
 * defensive no-op after the first call.
 *
 * Note: uses `$executeRawUnsafe` because the schema contains multiple
 * statements (CREATE TABLE, ALTER TABLE, CREATE INDEX). Prisma's
 * tagged-template `$executeRaw` only supports a single statement.
 */
export async function migrate(opts: MigrateOptions = {}): Promise<void> {
  if (migrated && !opts.force) return;
  const sql = opts.sql ?? SCHEMA_SQL;
  await getPool().$executeRawUnsafe(sql);
  migrated = true;
}
