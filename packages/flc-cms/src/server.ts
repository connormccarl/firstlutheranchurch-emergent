/**
 * Server-side exports for @flc/cms.
 *  - createCMSHandlers: generic CRUD helpers backed by PostgreSQL (pg)
 *  - verifyAdminCookie / signAdminCookie: stateless password-gate helpers
 */
import { randomUUID, createHmac, timingSafeEqual } from "crypto";
import type { Pool } from "pg";
import type { CmsConfig, ResourceDef, ResourceRecord } from "./types.js";

const COOKIE_NAME = "flc_cms_admin";
const COOKIE_MAX_AGE = 60 * 60 * 12; // 12 hours

function getSecret(): string {
  return (
    process.env.CMS_SECRET ||
    process.env.NEXTAUTH_SECRET ||
    "flc-cms-dev-secret-change-me"
  );
}

function sign(payload: string): string {
  return createHmac("sha256", getSecret()).update(payload).digest("hex");
}

export function signAdminCookie(): { name: string; value: string; maxAge: number } {
  const issuedAt = Date.now();
  const payload = `admin.${issuedAt}`;
  const sig = sign(payload);
  return {
    name: COOKIE_NAME,
    value: `${payload}.${sig}`,
    maxAge: COOKIE_MAX_AGE,
  };
}

export function clearAdminCookie(): { name: string; value: string; maxAge: number } {
  return { name: COOKIE_NAME, value: "", maxAge: 0 };
}

export function verifyAdminCookie(cookieValue: string | undefined): boolean {
  if (!cookieValue) return false;
  const parts = cookieValue.split(".");
  if (parts.length !== 3) return false;
  const [role, issuedAtStr, sig] = parts;
  if (role !== "admin") return false;
  const issuedAt = parseInt(issuedAtStr, 10);
  if (!issuedAt || Date.now() - issuedAt > COOKIE_MAX_AGE * 1000) return false;
  const expected = sign(`${role}.${issuedAtStr}`);
  try {
    const a = Buffer.from(sig, "hex");
    const b = Buffer.from(expected, "hex");
    return a.length === b.length && timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export function checkAdminPassword(provided: string): boolean {
  const expected = process.env.ADMIN_PASSWORD || "";
  if (!expected) return false;
  if (provided.length !== expected.length) return false;
  return timingSafeEqual(Buffer.from(provided), Buffer.from(expected));
}

/* ---------- CRUD handlers (PostgreSQL) ---------- */

export interface CMSHandlerDeps {
  /** Returns a pg Pool (re-used across calls) */
  getPool: () => Pool;
  config: CmsConfig;
}

function findResource(config: CmsConfig, slug: string): ResourceDef | undefined {
  return config.resources.find((r) => r.slug === slug);
}

/** Safe identifier: letters, digits, underscore only. */
function ident(name: string): string {
  if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(name)) {
    throw new Error(`Unsafe identifier: ${name}`);
  }
  return `"${name}"`;
}

function castInputs(input: Record<string, unknown>, resource: ResourceDef): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const f of resource.fields) {
    if (f.key in input) {
      const v = input[f.key];
      if (v === "" || v === undefined) {
        out[f.key] = null;
      } else if (f.type === "number") {
        out[f.key] = typeof v === "number" ? v : parseFloat(String(v));
      } else if (f.type === "boolean") {
        out[f.key] = Boolean(v);
      } else {
        out[f.key] = v;
      }
    }
  }
  return out;
}

export interface ListOptions {
  limit?: number;
  skip?: number;
}

export async function listRecords(
  deps: CMSHandlerDeps,
  slug: string,
  opts: ListOptions = {},
): Promise<ResourceRecord[]> {
  const resource = findResource(deps.config, slug);
  if (!resource) throw new Error(`Unknown resource: ${slug}`);
  const limit = opts.limit ?? 500;
  const skip = opts.skip ?? 0;
  const sql = `
    SELECT * FROM ${ident(resource.collection)}
    ORDER BY created_at DESC NULLS LAST
    LIMIT $1 OFFSET $2
  `;
  const result = await deps.getPool().query(sql, [limit, skip]);
  return result.rows as ResourceRecord[];
}

export async function createRecord(
  deps: CMSHandlerDeps,
  slug: string,
  data: Record<string, unknown>,
): Promise<ResourceRecord> {
  const resource = findResource(deps.config, slug);
  if (!resource) throw new Error(`Unknown resource: ${slug}`);
  if (resource.readOnly) throw new Error(`Resource is read-only: ${slug}`);

  const sanitized = castInputs(data, resource);
  const now = new Date().toISOString();
  const id = randomUUID();
  const cols = ["id", ...Object.keys(sanitized), "created_at", "updated_at"];
  const values = [id, ...Object.values(sanitized), now, now];
  const placeholders = cols.map((_, i) => `$${i + 1}`).join(", ");

  const sql = `
    INSERT INTO ${ident(resource.collection)} (${cols.map(ident).join(", ")})
    VALUES (${placeholders})
    RETURNING *
  `;
  const result = await deps.getPool().query(sql, values);
  return result.rows[0] as ResourceRecord;
}

export async function updateRecord(
  deps: CMSHandlerDeps,
  slug: string,
  id: string,
  data: Record<string, unknown>,
): Promise<ResourceRecord | null> {
  const resource = findResource(deps.config, slug);
  if (!resource) throw new Error(`Unknown resource: ${slug}`);
  if (resource.readOnly) throw new Error(`Resource is read-only: ${slug}`);

  const sanitized = castInputs(data, resource);
  const keys = Object.keys(sanitized);
  if (!keys.length) {
    // Nothing to update; just bump updated_at
    const result = await deps
      .getPool()
      .query(
        `UPDATE ${ident(resource.collection)} SET updated_at=$1 WHERE id=$2 RETURNING *`,
        [new Date().toISOString(), id],
      );
    return (result.rows[0] as ResourceRecord) ?? null;
  }

  const sets = keys
    .map((k, i) => `${ident(k)}=$${i + 1}`)
    .concat([`"updated_at"=$${keys.length + 1}`])
    .join(", ");

  const values = [...Object.values(sanitized), new Date().toISOString(), id];
  const sql = `
    UPDATE ${ident(resource.collection)}
    SET ${sets}
    WHERE id=$${values.length}
    RETURNING *
  `;
  const result = await deps.getPool().query(sql, values);
  return (result.rows[0] as ResourceRecord) ?? null;
}

export async function deleteRecord(
  deps: CMSHandlerDeps,
  slug: string,
  id: string,
): Promise<boolean> {
  const resource = findResource(deps.config, slug);
  if (!resource) throw new Error(`Unknown resource: ${slug}`);
  if (resource.readOnly) throw new Error(`Resource is read-only: ${slug}`);
  const result = await deps
    .getPool()
    .query(`DELETE FROM ${ident(resource.collection)} WHERE id=$1`, [id]);
  return (result.rowCount ?? 0) > 0;
}
