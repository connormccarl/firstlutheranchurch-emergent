/**
 * Basic unit tests for @flc/cms server helpers.
 * Runs with the Node.js built-in test runner — no jest/vitest needed.
 *   yarn test
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  signAdminCookie,
  verifyAdminCookie,
  checkAdminPassword,
  clearAdminCookie,
} from "../src/server.ts";
import { defineCmsConfig } from "../src/lib/defineConfig.ts";

test("signAdminCookie produces a verifiable cookie", () => {
  process.env.CMS_SECRET = "test-secret-1234";
  const c = signAdminCookie();
  assert.equal(c.name, "flc_cms_admin");
  assert.ok(c.value.split(".").length === 3);
  assert.ok(c.maxAge > 0);
  assert.ok(verifyAdminCookie(c.value));
});

test("verifyAdminCookie rejects tampered values", () => {
  process.env.CMS_SECRET = "test-secret-1234";
  const c = signAdminCookie();
  const parts = c.value.split(".");
  parts[2] = "0".repeat(parts[2].length);
  assert.equal(verifyAdminCookie(parts.join(".")), false);
});

test("verifyAdminCookie rejects empty and malformed", () => {
  assert.equal(verifyAdminCookie(undefined), false);
  assert.equal(verifyAdminCookie(""), false);
  assert.equal(verifyAdminCookie("not-a-cookie"), false);
});

test("clearAdminCookie has maxAge 0", () => {
  const c = clearAdminCookie();
  assert.equal(c.maxAge, 0);
  assert.equal(c.value, "");
});

test("checkAdminPassword respects ADMIN_PASSWORD env var", () => {
  process.env.ADMIN_PASSWORD = "letmein";
  assert.equal(checkAdminPassword("letmein"), true);
  assert.equal(checkAdminPassword("wrong"), false);
  assert.equal(checkAdminPassword(""), false);
  delete process.env.ADMIN_PASSWORD;
  assert.equal(checkAdminPassword("letmein"), false);
});

test("defineCmsConfig accepts unique slugs", () => {
  const cfg = defineCmsConfig({
    siteName: "Test",
    resources: [
      {
        slug: "events",
        label: "Events",
        singular: "Event",
        collection: "events",
        fields: [{ key: "title", label: "Title", type: "text" }],
      },
    ],
  });
  assert.equal(cfg.resources.length, 1);
});

test("defineCmsConfig rejects duplicate slugs", () => {
  assert.throws(() =>
    defineCmsConfig({
      siteName: "Test",
      resources: [
        {
          slug: "events",
          label: "Events",
          singular: "Event",
          collection: "events",
          fields: [],
        },
        {
          slug: "events",
          label: "Other",
          singular: "Other",
          collection: "x",
          fields: [],
        },
      ],
    }),
  );
});
