"use client";

/**
 * @module admin/layout
 *
 * Shared chrome for every `/admin/*` page: sidebar, top bar, logout
 * control, session gate. Redirects unauthenticated visitors to /admin
 * (which renders the LoginForm).
 */

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AdminShell, LoginForm } from "@connormccarl/nextos";
import { cms } from "@/cms.config";

type Me = {
  user: { id: string; email: string; name: string | null; role: string };
  csrfToken: string;
} | null;

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [me, setMe] = useState<Me | "checking">("checking");

  const refresh = async () => {
    try {
      const res = await fetch("/api/auth/me", { credentials: "include" });
      if (!res.ok) throw new Error("not authenticated");
      const data = await res.json();
      setMe({ user: data.user, csrfToken: data.csrfToken });
    } catch {
      setMe(null);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    setMe(null);
    router.push("/admin");
  };

  if (me === "checking") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-slate-400 text-sm">
        Loading…
      </div>
    );
  }

  if (me === null) {
    return (
      <LoginForm
        title="First Lutheran Miami — CMS"
        subtitle="Pastor & staff access only"
        forgotHref="/forgot-password"
        onSuccess={refresh}
      />
    );
  }

  const segment = pathname.replace(/^\/admin\/?/, "").split("/")[0];
  const active = segment || "dashboard";

  // Expose CSRF token globally so child server-bound fetches can pick it up
  return (
    <AdminShell
      config={cms}
      active={active}
      user={me.user}
      onLogout={handleLogout}
      extraNav={[
        { slug: "users", label: "Users", icon: "shield", href: "/admin/users" },
        { slug: "export", label: "Export", icon: "download", href: "/admin/export" },
      ]}
    >
      <CsrfProvider token={me.csrfToken}>{children}</CsrfProvider>
    </AdminShell>
  );
}

// Tiny client-only provider to share CSRF via window
function CsrfProvider({
  token,
  children,
}: {
  token: string;
  children: React.ReactNode;
}) {
  useEffect(() => {
    (window as unknown as { __NEXTOS_CSRF__: string }).__NEXTOS_CSRF__ = token;
  }, [token]);
  return <>{children}</>;
}
