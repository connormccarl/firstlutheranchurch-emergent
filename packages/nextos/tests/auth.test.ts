/**
 * Unit tests for @connormccarl/nextos.
 * Uses the Node.js built-in test runner via tsx.
 *
 * These tests don't touch the database — they cover the pure helpers
 * (password hashing, role checks, cookie config, CSRF compare, etc.).
 */
import { test } from "node:test";
import assert from "node:assert/strict";

import { hashPassword, verifyPassword, passwordStrength } from "../src/auth/password.ts";
import { hasRole, AuthError, AuthorizationError, AuthenticationError } from "../src/auth/users.ts";
import {
  sessionCookieOptions,
  csrfCookieOptions,
  clearCookieOptions,
  compareCsrf,
  SESSION_COOKIE,
  CSRF_COOKIE,
} from "../src/auth/session.ts";
import { defineCmsConfig } from "../src/cms/types.ts";

test("hashPassword produces a bcrypt hash and verifyPassword round-trips", async () => {
  const hash = await hashPassword("hunter22!");
  assert.match(hash, /^\$2[aby]\$/);
  assert.equal(await verifyPassword("hunter22!", hash), true);
  assert.equal(await verifyPassword("wrong", hash), false);
});

test("hashPassword rejects short passwords", async () => {
  await assert.rejects(() => hashPassword("short"));
});

test("passwordStrength scores 0–4", () => {
  assert.equal(passwordStrength(""), 0);
  assert.equal(passwordStrength("hunter22"), 1);
  assert.ok(passwordStrength("Hunter22!Letme") >= 3);
});

test("hasRole respects hierarchy", () => {
  const admin = { role: "admin" };
  const editor = { role: "editor" };
  const viewer = { role: "viewer" };
  assert.equal(hasRole(admin, "viewer"), true);
  assert.equal(hasRole(admin, "editor"), true);
  assert.equal(hasRole(admin, "admin"), true);
  assert.equal(hasRole(editor, "admin"), false);
  assert.equal(hasRole(editor, "editor"), true);
  assert.equal(hasRole(viewer, "editor"), false);
  assert.equal(hasRole(null, "viewer"), false);
});

test("AuthError carries HTTP status", () => {
  assert.equal(new AuthError("x").status, 400);
  assert.equal(new AuthenticationError("x").status, 401);
  assert.equal(new AuthorizationError("x").status, 403);
});

test("session cookie options enforce httpOnly + sameSite=lax", () => {
  const c = sessionCookieOptions("abc");
  assert.equal(c.name, SESSION_COOKIE);
  assert.equal(c.value, "abc");
  assert.equal(c.httpOnly, true);
  assert.equal(c.sameSite, "lax");
  assert.equal(c.path, "/");
  assert.ok(c.maxAge > 0);
});

test("csrf cookie options NOT httpOnly so JS can echo it back", () => {
  const c = csrfCookieOptions("xyz");
  assert.equal(c.name, CSRF_COOKIE);
  assert.equal(c.httpOnly, false);
});

test("clearCookieOptions zeroes maxAge", () => {
  const c = clearCookieOptions(SESSION_COOKIE);
  assert.equal(c.maxAge, 0);
  assert.equal(c.value, "");
});

test("compareCsrf timing-safe equality", () => {
  assert.equal(compareCsrf("aaaa", "aaaa"), true);
  assert.equal(compareCsrf("aaaa", "aaab"), false);
  assert.equal(compareCsrf("", "aaaa"), false);
  assert.equal(compareCsrf(undefined, undefined), false);
});

test("defineCmsConfig validates unique slugs", () => {
  defineCmsConfig({
    siteName: "x",
    resources: [
      { slug: "events", label: "E", singular: "E", collection: "events", fields: [] },
    ],
  });
  assert.throws(() =>
    defineCmsConfig({
      siteName: "x",
      resources: [
        { slug: "a", label: "A", singular: "A", collection: "a", fields: [] },
        { slug: "a", label: "B", singular: "B", collection: "b", fields: [] },
      ],
    }),
  );
});
