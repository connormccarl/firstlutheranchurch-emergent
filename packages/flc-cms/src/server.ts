/**
 * Server-side exports for @flc/cms.
 * Includes:
 *  - createCMSHandlers: generic Next.js route handlers for CRUD on any resource
 *  - verifyAdminCookie / signAdminCookie: stateless password-gate helpers
 */
import { randomUUID, createHmac, timingSafeEqual } from "crypto";
import type { Db } from "mongodb";
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

/* ---------- CRUD handlers ---------- */

export interface CMSHandlerDeps {
  getDb: () => Promise<Db>;
  config: CmsConfig;
}

function findResource(config: CmsConfig, slug: string): ResourceDef | undefined {
  return config.resources.find((r) => r.slug === slug);
}

function sanitize(input: Record<string, unknown>, resource: ResourceDef): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const f of resource.fields) {
    if (f.key in input) {
      const v = input[f.key];
      if (f.type === "number") {
        out[f.key] = typeof v === "number" ? v : parseFloat(String(v));
      } else if (f.type === "boolean") {
        out[f.key] = Boolean(v);
      } else {
        out[f.key] = v ?? "";
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
  opts: ListOptions = {}
): Promise<ResourceRecord[]> {
  const resource = findResource(deps.config, slug);
  if (!resource) throw new Error(`Unknown resource: ${slug}`);
  const db = await deps.getDb();
  return (await db
    .collection(resource.collection)
    .find({}, { projection: { _id: 0 } })
    .sort({ created_at: -1 })
    .skip(opts.skip || 0)
    .limit(opts.limit || 500)
    .toArray()) as unknown as ResourceRecord[];
}

export async function createRecord(
  deps: CMSHandlerDeps,
  slug: string,
  data: Record<string, unknown>
): Promise<ResourceRecord> {
  const resource = findResource(deps.config, slug);
  if (!resource) throw new Error(`Unknown resource: ${slug}`);
  if (resource.readOnly) throw new Error(`Resource is read-only: ${slug}`);
  const now = new Date().toISOString();
  const record: ResourceRecord = {
    id: randomUUID(),
    ...sanitize(data, resource),
    created_at: now,
    updated_at: now,
  };
  const db = await deps.getDb();
  await db.collection(resource.collection).insertOne({ ...record });
  return record;
}

export async function updateRecord(
  deps: CMSHandlerDeps,
  slug: string,
  id: string,
  data: Record<string, unknown>
): Promise<ResourceRecord | null> {
  const resource = findResource(deps.config, slug);
  if (!resource) throw new Error(`Unknown resource: ${slug}`);
  if (resource.readOnly) throw new Error(`Resource is read-only: ${slug}`);
  const update = { ...sanitize(data, resource), updated_at: new Date().toISOString() };
  const db = await deps.getDb();
  const result = await db
    .collection(resource.collection)
    .findOneAndUpdate({ id }, { $set: update }, { returnDocument: "after", projection: { _id: 0 } });
  return (result as unknown as ResourceRecord | null) ?? null;
}

export async function deleteRecord(
  deps: CMSHandlerDeps,
  slug: string,
  id: string
): Promise<boolean> {
  const resource = findResource(deps.config, slug);
  if (!resource) throw new Error(`Unknown resource: ${slug}`);
  if (resource.readOnly) throw new Error(`Resource is read-only: ${slug}`);
  const db = await deps.getDb();
  const result = await db.collection(resource.collection).deleteOne({ id });
  return result.deletedCount > 0;
}
