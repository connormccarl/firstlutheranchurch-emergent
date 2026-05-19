/**
 * @connormccarl/nextos — client-side exports.
 * Tree-shakable React components and types for any Next.js App Router app.
 */
export { AdminShell } from "./components/AdminShell.js";
export { Sidebar } from "./components/Sidebar.js";
export { DataTable } from "./components/DataTable.js";
export { RecordForm } from "./components/RecordForm.js";
export { ResourcePage } from "./components/ResourcePage.js";
export { LoginForm } from "./components/LoginForm.js";

export { defineCmsConfig } from "./cms/types.js";
export type {
  CmsConfig,
  ResourceDef,
  FieldDef,
  FieldType,
  ResourceRecord,
} from "./cms/types.js";
