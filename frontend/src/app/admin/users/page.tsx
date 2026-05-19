"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Loader2, Trash2 } from "lucide-react";

type User = {
  id: string;
  email: string;
  name: string | null;
  role: string;
  is_active: boolean;
  created_at: string;
  last_login_at: string | null;
};

const ROLES = ["admin", "editor", "viewer"];

function csrfHeader(): Record<string, string> {
  const t = (window as unknown as { __NEXTOS_CSRF__?: string }).__NEXTOS_CSRF__;
  return t ? { "X-CSRF-Token": t } : {};
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newName, setNewName] = useState("");
  const [newRole, setNewRole] = useState("editor");

  const reload = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin-users", { credentials: "include" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setUsers(await res.json());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    reload();
  }, []);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await fetch("/api/admin-users", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...csrfHeader() },
        credentials: "include",
        body: JSON.stringify({ email: newEmail, password: newPassword, name: newName, role: newRole }),
      });
      if (!res.ok) throw new Error((await res.json())?.detail || "Failed");
      setNewEmail(""); setNewPassword(""); setNewName(""); setNewRole("editor");
      setCreating(false);
      reload();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed");
    }
  };

  const updateRole = async (u: User, role: string) => {
    await fetch(`/api/admin-users/${u.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", ...csrfHeader() },
      credentials: "include",
      body: JSON.stringify({ role }),
    });
    reload();
  };

  const toggleActive = async (u: User) => {
    await fetch(`/api/admin-users/${u.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", ...csrfHeader() },
      credentials: "include",
      body: JSON.stringify({ is_active: !u.is_active }),
    });
    reload();
  };

  const remove = async (u: User) => {
    if (!confirm(`Delete user ${u.email}?`)) return;
    await fetch(`/api/admin-users/${u.id}`, {
      method: "DELETE",
      headers: csrfHeader(),
      credentials: "include",
    });
    reload();
  };

  return (
    <div data-testid="admin-users-page">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Users</h1>
          <p className="text-sm text-slate-500">Manage staff accounts and roles.</p>
        </div>
        <Button onClick={() => setCreating(true)} data-testid="new-user-button">
          <Plus className="w-4 h-4 mr-1" />New user
        </Button>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      {creating && (
        <form onSubmit={create} className="bg-white border border-slate-200 rounded-xl p-4 mb-6 grid grid-cols-5 gap-2 items-end">
          <input className="px-3 py-2 rounded border text-sm" placeholder="email"     value={newEmail}    onChange={(e) => setNewEmail(e.target.value)} required type="email" />
          <input className="px-3 py-2 rounded border text-sm" placeholder="full name" value={newName}     onChange={(e) => setNewName(e.target.value)} />
          <input className="px-3 py-2 rounded border text-sm" placeholder="password (min 8)" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required type="password" minLength={8} />
          <select className="px-3 py-2 rounded border text-sm" value={newRole} onChange={(e) => setNewRole(e.target.value)}>
            {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
          <div className="flex gap-2">
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white" data-testid="create-user-submit">Create</Button>
            <Button type="button" variant="outline" onClick={() => setCreating(false)}>Cancel</Button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="flex items-center gap-2 text-slate-500">
          <Loader2 className="w-4 h-4 animate-spin" />Loading…
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Last login</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50" data-testid={`user-row-${u.id}`}>
                  <td className="px-4 py-3 text-slate-800">{u.email}</td>
                  <td className="px-4 py-3 text-slate-600">{u.name || "—"}</td>
                  <td className="px-4 py-3">
                    <select
                      value={u.role}
                      onChange={(e) => updateRole(u, e.target.value)}
                      className="px-2 py-1 rounded border text-sm"
                      data-testid={`user-role-${u.id}`}
                    >
                      {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => toggleActive(u)}
                      className={`text-xs px-2 py-1 rounded-full ${u.is_active ? "bg-green-50 text-green-700" : "bg-slate-100 text-slate-500"}`}
                    >
                      {u.is_active ? "Active" : "Disabled"}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-slate-500 text-xs">
                    {u.last_login_at ? new Date(u.last_login_at).toLocaleString() : "Never"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => remove(u)}
                      className="text-red-600 hover:text-red-800 inline-flex items-center gap-1"
                      data-testid={`delete-user-${u.id}`}
                    >
                      <Trash2 className="w-4 h-4" />Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
