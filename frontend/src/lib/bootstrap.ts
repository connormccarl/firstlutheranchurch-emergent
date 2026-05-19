/**
 * Server-only startup hook. Runs migrations + seeds admin user.
 * Called by the first server-side import (route handler or page).
 */
import { createPool, migrate, seedAdmin } from "@connormccarl/nextos/server";

let initialized: Promise<void> | null = null;

export function ensureBootstrap(): Promise<void> {
  if (!initialized) {
    initialized = (async () => {
      createPool();
      try {
        await migrate();
      } catch (e) {
        console.error("[bootstrap] migrate failed:", e);
      }
      try {
        await seedAdmin();
      } catch (e) {
        console.error("[bootstrap] seedAdmin failed:", e);
      }
    })();
  }
  return initialized;
}
