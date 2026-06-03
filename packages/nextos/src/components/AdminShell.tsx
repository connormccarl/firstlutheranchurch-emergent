"use client";

/**
 * @module AdminShell
 *
 * Top-level admin layout. Renders the sidebar + page content with a
 * fixed-width brand header and an optional logout button. Consumed
 * via `import { AdminShell } from '@connormccarl/nextos'`.
 */
import React from "react";
import type { CmsConfig } from "../cms/types.js";
import { Sidebar } from "./Sidebar.js";

export interface AdminShellProps {
  config: CmsConfig;
  active?: string;
  user?: { name: string | null; email: string; role: string } | null;
  onLogout?: () => void;
  extraNav?: { slug: string; label: string; icon?: string; href: string }[];
  children: React.ReactNode;
}

export function AdminShell({
  config, active, user, onLogout, extraNav, children,
}: AdminShellProps) {
  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      <Sidebar
        config={config}
        active={active}
        user={user}
        onLogout={onLogout}
        extraNav={extraNav}
      />
      <main className="flex-1 min-w-0 overflow-x-auto">
        <div className="max-w-6xl mx-auto px-6 py-10">{children}</div>
      </main>
    </div>
  );
}
