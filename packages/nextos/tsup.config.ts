/**
 * tsup bundle config for @connormccarl/nextos.
 *
 * Two entry points:
 *   - `index` (client-safe): exports React components + CMS types
 *   - `server` (Node-only): exports DB/auth/email/CMS server APIs, plus the
 *     generated Prisma client
 *
 * External modules (kept as peer/runtime deps rather than inlined):
 *   - `react`, `react-dom`, `next` — peer deps, supplied by the host app
 *   - `pg`, `@prisma/client`, `@prisma/adapter-pg` — Node-only; resolving
 *     them from `node_modules` avoids duplicating the query runtime and the
 *     pre-built schema engine in our bundle
 *   - `bcryptjs`, `jsonwebtoken` — leaf utilities, leave external for size
 *
 * The Prisma client itself lives under `src/generated/prisma/` and is
 * imported via relative paths, so tsup compiles it as part of the bundle
 * (it doesn't need to be marked external).
 */
import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    server: "src/server.ts",
  },
  format: ["esm"],
  dts: true,
  sourcemap: true,
  clean: true,
  external: [
    "react",
    "react-dom",
    "next",
    "pg",
    "@prisma/client",
    "@prisma/client/runtime/client",
    "@prisma/adapter-pg",
    "bcryptjs",
    "jsonwebtoken",
    "next-auth",
    "next-auth/providers/credentials",
    "next-auth/jwt",
    "@auth/prisma-adapter",
    "@auth/core",
  ],
  splitting: false,
  treeshake: true,
});
