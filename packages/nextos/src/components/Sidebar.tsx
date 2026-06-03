"use client";

/**
 * @module Sidebar
 *
 * Admin sidebar nav. Builds links from a CmsConfig and a list of
 * extra static links (e.g. Users, Export). Highlights the active
 * resource based on the current path.
 */
import React from "react";
import {
  LayoutDashboard, Calendar, Image as ImageIcon, Film, FileText,
  Mail, Heart, Users, Download, LogOut, Settings, Database, Shield,
} from "lucide-react";
import type { CmsConfig } from "../cms/types.js";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  dashboard: LayoutDashboard,
  calendar: Calendar,
  image: ImageIcon,
  film: Film,
  text: FileText,
  mail: Mail,
  heart: Heart,
  users: Users,
  download: Download,
  settings: Settings,
  database: Database,
  shield: Shield,
};

export interface SidebarProps {
  config: CmsConfig;
  active?: string;
  extraNav?: { slug: string; label: string; icon?: string; href: string }[];
  user?: { name: string | null; email: string; role: string } | null;
  onLogout?: () => void;
}

export function Sidebar({ config, active, extraNav, user, onLogout }: SidebarProps) {
  const items = [
    { slug: "dashboard", label: "Dashboard", icon: "dashboard", href: "/admin" },
    ...config.resources.map((r) => ({
      slug: r.slug,
      label: r.label,
      icon: r.icon,
      href: `/admin/${r.slug}`,
    })),
    ...(extraNav || []),
  ];
  return (
    <aside data-testid="nextos-sidebar" className="w-64 shrink-0 bg-slate-900 text-slate-200 flex flex-col">
      <div className="px-6 py-6 border-b border-slate-800">
        <div className="text-xs uppercase tracking-widest text-slate-500">CMS</div>
        <div className="text-lg font-semibold text-white truncate">{config.siteName}</div>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {items.map((it) => {
          const Icon = ICONS[it.icon || "settings"] || Settings;
          const isActive = active === it.slug;
          return (
            <a
              key={it.slug}
              href={it.href}
              data-testid={`nextos-nav-${it.slug}`}
              className={[
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                isActive
                  ? "bg-slate-700 text-white"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white",
              ].join(" ")}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="truncate">{it.label}</span>
            </a>
          );
        })}
      </nav>
      {user && (
        <div className="px-4 py-3 border-t border-slate-800 text-sm">
          <div className="font-medium text-white truncate">{user.name || user.email}</div>
          <div className="text-xs text-slate-500 truncate">{user.email}</div>
          <div className="text-[10px] uppercase tracking-wider text-amber-400 mt-1">
            {user.role}
          </div>
        </div>
      )}
      {onLogout && (
        <button
          type="button"
          onClick={onLogout}
          data-testid="nextos-logout-button"
          className="m-3 flex items-center gap-2 px-3 py-2 text-sm rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Log out
        </button>
      )}
    </aside>
  );
}
