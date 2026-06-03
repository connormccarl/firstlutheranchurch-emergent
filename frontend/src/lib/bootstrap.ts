/**
 * @module lib/bootstrap
 *
 * Server-only startup hook. The very first server-side import (route
 * handler or server component) calls `ensureBootstrap()`, which:
 *   1. instantiates the shared Prisma client (and pg pool)
 *   2. runs the idempotent schema bootstrap (legacy compatibility)
 *   3. seeds the admin user from ADMIN_EMAIL / ADMIN_PASSWORD
 * Subsequent calls are no-ops thanks to the cached promise.
 */
import { createPool, migrate, seedAdmin } from "@connormccarl/nextos/server";

// Cached promise so all callers share the same bootstrap pass.
let initialized: Promise<void> | null = null;

/**
 * Lazy idempotent bootstrap. Call from any server-side entry point that
 * touches the database. Errors are logged but never thrown so a transient
 * DB outage doesn't crash unrelated pages — every consumer is expected to
 * handle its own DB failures.
 */
export function ensureBootstrap(): Promise<void> {
  if (!initialized) {
    initialized = (async () => {
      // 1. Create the shared Prisma client (also caches the pg pool).
      createPool();
      // 2. Apply the legacy idempotent schema. This is a defensive no-op
      //    on a Prisma-managed database (use `prisma migrate deploy` in CI).
      try {
        await migrate();
      } catch (e) {
        console.error("[bootstrap] migrate failed:", e);
      }
      // 3. Seed / rotate the admin user from env. Skips silently if
      //    ADMIN_EMAIL or ADMIN_PASSWORD is unset.
      try {
        await seedAdmin();
      } catch (e) {
        console.error("[bootstrap] seedAdmin failed:", e);
      }
    })();
  }
  return initialized;
}
