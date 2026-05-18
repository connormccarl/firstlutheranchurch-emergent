"use client";
import React from "react";
import type { CmsConfig } from "../types.js";
import { Sidebar } from "./Sidebar.js";

export interface AdminShellProps {
  config: CmsConfig;
  /** Currently active resource slug (or "dashboard", "export", etc.) */
  active?: string;
  /** Logout handler — typically posts to /api/admin/logout then router.push("/admin") */
  onLogout?: () => void;
  children: React.ReactNode;
  /** Extra sidebar items appended after resources (e.g. Export) */
  extraNav?: { slug: string; label: string; icon?: string; href: string }[];
}

export function AdminShell({
  config,
  active,
  onLogout,
  children,
  extraNav,
}: AdminShellProps) {
  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      <Sidebar
        config={config}
        active={active}
        onLogout={onLogout}
        extraNav={extraNav}
      />
      <main className="flex-1 min-w-0 overflow-x-auto">
        <div className="max-w-6xl mx-auto px-6 py-10">{children}</div>
      </main>
    </div>
  );
}
