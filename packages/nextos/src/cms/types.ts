/* CMS types — identical to v0.2.0 */
export type FieldType =
  | "text" | "textarea" | "richtext" | "number" | "date" | "time"
  | "select" | "url" | "email" | "boolean";

export interface FieldDef {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: string[];
  placeholder?: string;
  helpText?: string;
}

export interface ResourceDef {
  slug: string;
  label: string;
  singular: string;
  collection: string;
  fields: FieldDef[];
  readOnly?: boolean;
  tableColumns?: string[];
  icon?: string;
  /** Minimum role required to manage this resource. Default 'editor'. */
  minRole?: string;
}

export interface CmsConfig {
  siteName: string;
  resources: ResourceDef[];
}

export interface ResourceRecord {
  id: string;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
}

export function defineCmsConfig(cfg: CmsConfig): CmsConfig {
  const slugs = new Set<string>();
  for (const r of cfg.resources) {
    if (slugs.has(r.slug)) throw new Error(`Duplicate resource slug: ${r.slug}`);
    slugs.add(r.slug);
  }
  return cfg;
}
