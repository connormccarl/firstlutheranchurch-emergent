/**
 * CMS resource type definitions.
 *
 * A `CmsConfig` declares the resources your admin UI should expose. Each
 * `ResourceDef` maps a URL slug to a Postgres `collection` (table) plus a
 * list of `FieldDef` describing how to render & validate the form.
 *
 * Example:
 *
 *   defineCmsConfig({
 *     siteName: "My Site",
 *     resources: [
 *       {
 *         slug: "events",
 *         label: "Events",
 *         singular: "Event",
 *         collection: "events",
 *         fields: [
 *           { key: "title", label: "Title", type: "text", required: true },
 *           { key: "starts_at", label: "Start", type: "date", required: true },
 *         ],
 *       },
 *     ],
 *   });
 */

/** Supported field types — these map 1:1 onto HTML inputs and SQL columns. */
export type FieldType =
  | "text" | "textarea" | "richtext" | "number" | "date" | "time"
  | "select" | "url" | "email" | "boolean";

/** Single column / form field. */
export interface FieldDef {
  /** SQL column name (must be a valid identifier). */
  key: string;
  /** Human label shown in the admin form. */
  label: string;
  /** Input type. Drives both the rendered HTML control and JS coercion. */
  type: FieldType;
  /** Marks the field required in the admin form (not enforced in SQL). */
  required?: boolean;
  /** For `type: "select"` — list of allowed values. */
  options?: string[];
  /** HTML placeholder. */
  placeholder?: string;
  /** Help text shown beneath the input. */
  helpText?: string;
}

/** A single CMS resource — one DB table mapped to an admin section. */
export interface ResourceDef {
  /** URL-safe slug. Used in `/admin/[slug]` and `/api/admin/[slug]`. */
  slug: string;
  /** Plural label, e.g. "Events". */
  label: string;
  /** Singular label, e.g. "Event". Used in "Create Event" buttons. */
  singular: string;
  /** Postgres table name. */
  collection: string;
  /** Field definitions, rendered in the admin form in order. */
  fields: FieldDef[];
  /** Hide create / update / delete actions. Useful for inbox-style tables. */
  readOnly?: boolean;
  /** Override the default list-view columns (defaults to first 5 field keys). */
  tableColumns?: string[];
  /** Lucide icon name shown in the sidebar. */
  icon?: string;
  /** Minimum role required to manage this resource. Default 'editor'. */
  minRole?: string;
}

/** Top-level config: one site, many resources. */
export interface CmsConfig {
  siteName: string;
  resources: ResourceDef[];
}

/** Shape of a row coming back from the CMS server. */
export interface ResourceRecord {
  id: string;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
}

/**
 * Helper that validates a `CmsConfig` and returns it unchanged.
 * Currently checks: no duplicate resource slugs.
 *
 * Usage:
 *   export default defineCmsConfig({ … });
 */
export function defineCmsConfig(cfg: CmsConfig): CmsConfig {
  const slugs = new Set<string>();
  for (const r of cfg.resources) {
    if (slugs.has(r.slug)) throw new Error(`Duplicate resource slug: ${r.slug}`);
    slugs.add(r.slug);
  }
  return cfg;
}
