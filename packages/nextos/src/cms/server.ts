/**
 * CMS server helpers: generic CRUD over arbitrary Postgres tables.
 *
 * Safety model:
 *   - All table / column identifiers are validated against `/^[A-Za-z_][A-Za-z0-9_]*$/`
 *     and then double-quoted (`ident()`), so a malicious slug never reaches
 *     the SQL parser.
 *   - All values use parameterised queries (`$1, $2, …`) — no string concat.
 *   - `readOnly` resources reject create/update/delete with a clear error.
 *
 * The CMS UI calls these helpers through `/api/admin/[slug]` route handlers.
 * Resources are declared in the consuming app's `cms.config.ts`.
 */
import { randomUUID } from "crypto";
import { query } from "../db/pg.js";
import type { CmsConfig, ResourceDef, ResourceRecord } from "./types.js";

function findResource(config: CmsConfig, slug: string): ResourceDef | undefined {
  return config.resources.find((r) => r.slug === slug);
}

/**
 * Validate an identifier (table or column name) and wrap it in double-quotes.
 * Rejects anything that isn't a plain alphanumeric/underscore identifier — so
 * a user-supplied slug like `"; DROP TABLE users; --` will throw, not execute.
 */
function ident(name: string): string {
  if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(name)) {
    throw new Error(`Unsafe identifier: ${name}`);
  }
  return `"${name}"`;
}

/**
 * Coerce incoming form values to the column type declared in the resource
 * definition. Empty strings become NULL so a blank text input doesn't write
 * "" into a column that should be null.
 */
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

/**
 * List rows for a resource, newest first. Defaults to 500 rows max — bump
 * via `limit` for large tables, but consider pagination instead.
 */
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

/**
 * Insert a new row. Generates a UUID for `id`, sets `created_at`/`updated_at`,
 * and returns the full row (including any DB-side defaults).
 */
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

/**
 * Update an existing row by id. Only columns present in `data` are touched;
 * `updated_at` is always refreshed. Returns the updated row, or null if the
 * id didn't match.
 */
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
    // No field updates — just bump updated_at so audit logs reflect the touch.
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

/**
 * Hard-delete a row by id. Returns true if a row was removed, false if not found.
 * Consider soft-delete (e.g. an `is_deleted` flag) if you need recovery.
 */
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
