import type { CmsConfig } from "../types.js";

/**
 * Identity helper that gives consumers IDE autocomplete when defining their
 * CMS configuration:
 *
 *   export const cms = defineCmsConfig({ siteName: "...", resources: [...] });
 */
export function defineCmsConfig(cfg: CmsConfig): CmsConfig {
  // basic uniqueness check
  const slugs = new Set<string>();
  for (const r of cfg.resources) {
    if (slugs.has(r.slug)) {
      throw new Error(`Duplicate resource slug: ${r.slug}`);
    }
    slugs.add(r.slug);
  }
  return cfg;
}
