"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AdminShell, PasswordGate } from "@flc/cms";
import { cms } from "@/cms.config";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [auth, setAuth] = useState<"checking" | "yes" | "no">("checking");

  const refresh = async () => {
    try {
      const res = await fetch("/api/admin/me", { credentials: "include" });
      const data = await res.json();
      setAuth(data.authenticated ? "yes" : "no");
    } catch {
      setAuth("no");
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleLogout = async () => {
    await fetch("/api/admin/logout", {
      method: "POST",
      credentials: "include",
    });
    setAuth("no");
    router.push("/admin");
  };

  if (auth === "checking") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-slate-400 text-sm">
        Loading…
      </div>
    );
  }

  if (auth === "no") {
    return (
      <PasswordGate
        title="First Lutheran Miami — CMS"
        subtitle="Pastor & staff access only"
        onSuccess={refresh}
      />
    );
  }

  // Derive active slug from pathname:  /admin -> dashboard, /admin/events -> events
  const segment = pathname.replace(/^\/admin\/?/, "").split("/")[0];
  const active = segment || "dashboard";

  return (
    <AdminShell
      config={cms}
      active={active}
      onLogout={handleLogout}
      extraNav={[
        { slug: "export", label: "Export", icon: "download", href: "/admin/export" },
      ]}
    >
      {children}
    </AdminShell>
  );
}
