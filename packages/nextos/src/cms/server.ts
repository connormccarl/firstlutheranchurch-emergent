/**
 * CMS server helpers: generic CRUD over Postgres tables, with safe identifier quoting.
 */
import { randomUUID } from "crypto";
import { query } from "../db/pg.js";
import type { CmsConfig, ResourceDef, ResourceRecord } from "./types.js";

function findResource(config: CmsConfig, slug: string): ResourceDef | undefined {
  return config.resources.find((r) => r.slug === slug);
}

function ident(name: string): string {
  if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(name)) {
    throw new Error(`Unsafe identifier: ${name}`);
  }
  return `"${name}"`;
}

function castInputs(
  input: Record<string, unknown>,
  resource: ResourceDef,
): Record<string, unknown> {
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
  config: CmsConfig,
  slug: string,
  opts: ListOptions = {},
): Promise<ResourceRecord[]> {
  const resource = findResource(config, slug);
  if (!resource) throw new Error(`Unknown resource: ${slug}`);
  const limit = opts.limit ?? 500;
  const skip = opts.skip ?? 0;
  return query<ResourceRecord>(
    `SELECT * FROM ${ident(resource.collection)}
     ORDER BY created_at DESC NULLS LAST
     LIMIT $1 OFFSET $2`,
    [limit, skip],
  );
}

export async function createRecord(
  config: CmsConfig,
  slug: string,
  data: Record<string, unknown>,
): Promise<ResourceRecord> {
  const resource = findResource(config, slug);
  if (!resource) throw new Error(`Unknown resource: ${slug}`);
  if (resource.readOnly) throw new Error(`Resource is read-only: ${slug}`);

  const sanitized = castInputs(data, resource);
  const now = new Date().toISOString();
  const id = randomUUID();
  const cols = ["id", ...Object.keys(sanitized), "created_at", "updated_at"];
  const values = [id, ...Object.values(sanitized), now, now];
  const placeholders = cols.map((_, i) => `$${i + 1}`).join(", ");
  const sql = `INSERT INTO ${ident(resource.collection)} (${cols.map(ident).join(", ")})
               VALUES (${placeholders}) RETURNING *`;
  const rows = await query<ResourceRecord>(sql, values);
  return rows[0];
}

export async function updateRecord(
  config: CmsConfig,
  slug: string,
  id: string,
  data: Record<string, unknown>,
): Promise<ResourceRecord | null> {
  const resource = findResource(config, slug);
  if (!resource) throw new Error(`Unknown resource: ${slug}`);
  if (resource.readOnly) throw new Error(`Resource is read-only: ${slug}`);

  const sanitized = castInputs(data, resource);
  const keys = Object.keys(sanitized);
  if (!keys.length) {
    const rows = await query<ResourceRecord>(
      `UPDATE ${ident(resource.collection)} SET updated_at=$1 WHERE id=$2 RETURNING *`,
      [new Date().toISOString(), id],
    );
    return rows[0] ?? null;
  }
  const sets = keys
    .map((k, i) => `${ident(k)}=$${i + 1}`)
    .concat([`"updated_at"=$${keys.length + 1}`])
    .join(", ");
  const values = [...Object.values(sanitized), new Date().toISOString(), id];
  const rows = await query<ResourceRecord>(
    `UPDATE ${ident(resource.collection)} SET ${sets} WHERE id=$${values.length} RETURNING *`,
    values,
  );
  return rows[0] ?? null;
}

export async function deleteRecord(
  config: CmsConfig,
  slug: string,
  id: string,
): Promise<boolean> {
  const resource = findResource(config, slug);
  if (!resource) throw new Error(`Unknown resource: ${slug}`);
  if (resource.readOnly) throw new Error(`Resource is read-only: ${slug}`);
  const rows = await query(
    `DELETE FROM ${ident(resource.collection)} WHERE id=$1 RETURNING id`,
    [id],
  );
  return rows.length > 0;
}
