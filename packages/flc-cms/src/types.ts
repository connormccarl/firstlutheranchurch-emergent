/* CMS shared types */

export type FieldType =
  | "text"
  | "textarea"
  | "richtext"
  | "number"
  | "date"
  | "time"
  | "select"
  | "url"
  | "email"
  | "boolean";

export interface FieldDef {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: string[]; // for select
  placeholder?: string;
  helpText?: string;
}

export interface ResourceDef {
  /** Unique slug; used in routes (/admin/<slug>) and API (/api/admin/<slug>) */
  slug: string;
  /** Human-readable name (e.g. "Events") */
  label: string;
  /** Singular form (e.g. "Event") */
  singular: string;
  /** MongoDB collection name */
  collection: string;
  /** Field schema (for create/edit form & table columns) */
  fields: FieldDef[];
  /** If true, no create/edit/delete allowed (audit log style) */
  readOnly?: boolean;
  /** Columns shown in the table view; defaults to first 4 fields */
  tableColumns?: string[];
  /** lucide icon name (string only — host resolves it) */
  icon?: string;
}

export interface CmsConfig {
  /** Site title shown in the admin header */
  siteName: string;
  /** All managed resources */
  resources: ResourceDef[];
}

export interface ResourceRecord {
  id: string;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
}
