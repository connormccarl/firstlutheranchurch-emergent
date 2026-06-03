"use client";

/**
 * @module admin/index
 *
 * Admin landing page. If the visitor isn't logged in, shows the
 * LoginForm from @connormccarl/nextos; otherwise renders a quick
 * dashboard with CMS resource counts and links.
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import {
  Calendar,
  Image as ImageIcon,
  Film,
  FileText,
  Users,
  Mail,
  Heart,
} from "lucide-react";
import { cms } from "@/cms.config";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  calendar: Calendar,
  image: ImageIcon,
  film: Film,
  text: FileText,
  users: Users,
  mail: Mail,
  heart: Heart,
};

export default function AdminDashboardPage() {
  const [counts, setCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    (async () => {
      const out: Record<string, number> = {};
      await Promise.all(
        cms.resources.map(async (r) => {
          try {
            const res = await fetch(`/api/admin/${r.slug}`, { credentials: "include" });
            if (!res.ok) return;
            const data = await res.json();
            out[r.slug] = Array.isArray(data) ? data.length : 0;
          } catch {
            /* ignore */
          }
        }),
      );
      setCounts(out);
    })();
  }, []);

  return (
    <div data-testid="admin-dashboard">
      <h1 className="text-2xl font-bold text-slate-900 mb-1">Dashboard</h1>
      <p className="text-sm text-slate-500 mb-8">
        Welcome to the {cms.siteName} CMS. Pick a section from the left, or jump
        in below.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {cms.resources.map((r) => {
          const Icon = ICONS[r.icon || "text"] || FileText;
          return (
            <Link key={r.slug} href={`/admin/${r.slug}`}>
              <Card
                className="hover:shadow-md transition-shadow cursor-pointer"
                data-testid={`dashboard-card-${r.slug}`}
              >
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-blue-50 text-blue-700">
                      <Icon className="w-5 h-5" />
                    </div>
                    {r.readOnly && (
                      <span className="text-[10px] uppercase tracking-wider text-slate-400">
                        read-only
                      </span>
                    )}
                  </div>
                  <div className="text-2xl font-bold text-slate-900">
                    {counts[r.slug] ?? "—"}
                  </div>
                  <div className="text-sm text-slate-500 mt-1">{r.label}</div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
