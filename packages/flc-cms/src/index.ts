/**
 * Client-side exports for @flc/cms.
 * All UI is unstyled Tailwind-friendly and works inside Next.js App Router.
 */
export { AdminShell } from "./components/AdminShell.js";
export { DataTable } from "./components/DataTable.js";
export { RecordForm } from "./components/RecordForm.js";
export { PasswordGate } from "./components/PasswordGate.js";
export { Sidebar } from "./components/Sidebar.js";
export { ResourcePage } from "./components/ResourcePage.js";
export { defineCmsConfig } from "./lib/defineConfig.js";
export type {
  CmsConfig,
  ResourceDef,
  FieldDef,
  FieldType,
  ResourceRecord,
} from "./types.js";
