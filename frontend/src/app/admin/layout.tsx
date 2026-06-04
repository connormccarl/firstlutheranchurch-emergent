"use client";

/**
 * @module admin/layout
 *
 * Shared chrome for every `/admin/*` page: sidebar, top bar, logout
 * control, session gate. Reads the Auth.js JWT-backed session via
 * `/api/auth/session`. Redirects unauthenticated visitors to the
 * embedded LoginForm.
 */

import { useEffect, useState, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AdminShell, LoginForm } from "@connormccarl/nextos";
import { cms } from "@/cms.config";

type Me = {
  user: { id: string; email: string; name: string | null; role: string };
} | null;

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [me, setMe] = useState<Me | "checking">("checking");

  const refresh = useCallback(async () => {
    try {
      // Auth.js exposes the session at /api/auth/session. Shape:
      //   {} when signed out, { user: { id, email, name, role } } when signed in.
      const res = await fetch("/api/auth/session", { credentials: "include" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.user?.id) {
        setMe(null);
        return;
      }
      setMe({
        user: {
          id: data.user.id,
          email: data.user.email,
          name: data.user.name ?? null,
          role: data.user.role ?? "viewer",
        },
      });
    } catch {
      setMe(null);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const handleLogout = async () => {
    // Auth.js logout is a POST with a CSRF token.
    const csrfRes = await fetch("/api/auth/csrf", { credentials: "include" });
    const { csrfToken } = await csrfRes.json();
    await fetch("/api/auth/signout", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ csrfToken, callbackUrl: "/admin", json: "true" }),
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
        // Hard-navigate so the session cookie is included in the next request.
        // (React state refresh races the browser's cookie commit.)
        onSuccess={() => window.location.assign("/admin")}
      />
    );
  }

  const segment = pathname.replace(/^\/admin\/?/, "").split("/")[0];
  const active = segment || "dashboard";

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
      {children}
    </AdminShell>
  );
}
