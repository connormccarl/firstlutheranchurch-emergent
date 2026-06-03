// prisma.config.ts — Prisma CLI configuration for @connormccarl/nextos.
//
// In Prisma 7 the `url` field is no longer allowed in schema.prisma; the
// datasource URL is supplied here instead. We read `DATABASE_URL` from the
// environment (loaded via dotenv from /app/frontend/.env at CLI time).
import "dotenv/config";
import path from "node:path";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: path.join(__dirname, "prisma", "schema.prisma"),
  datasource: {
    url: process.env.DATABASE_URL ?? "",
  },
  migrations: {
    path: path.join(__dirname, "prisma", "migrations"),
  },
});
