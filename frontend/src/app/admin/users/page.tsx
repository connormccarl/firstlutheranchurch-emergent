"use client";

/**
 * @module admin/users
 *
 * Admin user management page. Lists every user, supports creating new
 * users, editing profile fields (first_name, last_name, phone, title),
 * rotating role, and deactivating accounts. Role gate: admin.
 */

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Loader2, Trash2, Pencil, X } from "lucide-react";

type User = {
  id: string;
  email: string;
  name: string | null;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  title: string | null;
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

const blankNew = {
  email: "",
  password: "",
  first_name: "",
  last_name: "",
  phone: "",
  title: "",
  role: "editor",
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [newU, setNewU] = useState({ ...blankNew });

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

  useEffect(() => { reload(); }, []);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await fetch("/api/admin-users", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...csrfHeader() },
        credentials: "include",
        body: JSON.stringify(newU),
      });
      if (!res.ok) throw new Error((await res.json())?.detail || "Failed");
      setNewU({ ...blankNew });
      setCreating(false);
      reload();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed");
    }
  };

  const patchUser = async (id: string, patch: Record<string, unknown>) => {
    const res = await fetch(`/api/admin-users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", ...csrfHeader() },
      credentials: "include",
      body: JSON.stringify(patch),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data?.detail || `HTTP ${res.status}`);
    }
    return res.json();
  };

  const updateRole = async (u: User, role: string) => { await patchUser(u.id, { role }); reload(); };
  const toggleActive = async (u: User) => { await patchUser(u.id, { is_active: !u.is_active }); reload(); };

  const saveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    setError(null);
    try {
      await patchUser(editing.id, {
        email: editing.email,
        first_name: editing.first_name,
        last_name: editing.last_name,
        phone: editing.phone,
        title: editing.title,
        role: editing.role,
      });
      setEditing(null);
      reload();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed");
    }
  };

  const remove = async (u: User) => {
    if (!confirm(`Delete user ${u.email}?`)) return;
    await fetch(`/api/admin-users/${u.id}`, { method: "DELETE", headers: csrfHeader(), credentials: "include" });
    reload();
  };

  return (
    <div data-testid="admin-users-page">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Users</h1>
          <p className="text-sm text-slate-500">Manage staff accounts, roles, and contact info.</p>
        </div>
        <Button onClick={() => setCreating(true)} data-testid="new-user-button">
          <Plus className="w-4 h-4 mr-1" />New user
        </Button>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700" data-testid="users-error">
          {error}
        </div>
      )}

      {creating && (
        <form onSubmit={create} className="bg-white border border-slate-200 rounded-xl p-4 mb-6 grid grid-cols-2 md:grid-cols-4 gap-3">
          <input className="px-3 py-2 rounded border text-sm" placeholder="email *"      value={newU.email}      onChange={(e) => setNewU({ ...newU, email: e.target.value })} required type="email" data-testid="new-user-email" />
          <input className="px-3 py-2 rounded border text-sm" placeholder="password *"   value={newU.password}   onChange={(e) => setNewU({ ...newU, password: e.target.value })} required minLength={8} type="password" data-testid="new-user-password" />
          <input className="px-3 py-2 rounded border text-sm" placeholder="first name"   value={newU.first_name} onChange={(e) => setNewU({ ...newU, first_name: e.target.value })} data-testid="new-user-first-name" />
          <input className="px-3 py-2 rounded border text-sm" placeholder="last name"    value={newU.last_name}  onChange={(e) => setNewU({ ...newU, last_name: e.target.value })} data-testid="new-user-last-name" />
          <input className="px-3 py-2 rounded border text-sm" placeholder="phone"        value={newU.phone}      onChange={(e) => setNewU({ ...newU, phone: e.target.value })} data-testid="new-user-phone" />
          <input className="px-3 py-2 rounded border text-sm" placeholder="title"        value={newU.title}      onChange={(e) => setNewU({ ...newU, title: e.target.value })} data-testid="new-user-title" />
          <select className="px-3 py-2 rounded border text-sm" value={newU.role} onChange={(e) => setNewU({ ...newU, role: e.target.value })} data-testid="new-user-role">
            {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
          <div className="flex gap-2 col-span-2 md:col-span-1">
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
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50" data-testid={`user-row-${u.id}`}>
                  <td className="px-4 py-3 text-slate-800">
                    {[u.first_name, u.last_name].filter(Boolean).join(" ") || u.name || "—"}
                  </td>
                  <td className="px-4 py-3 text-slate-600">{u.title || "—"}</td>
                  <td className="px-4 py-3 text-slate-700">{u.email}</td>
                  <td className="px-4 py-3 text-slate-600">{u.phone || "—"}</td>
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
                      data-testid={`user-active-${u.id}`}
                    >
                      {u.is_active ? "Active" : "Disabled"}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => setEditing(u)}
                      className="text-blue-600 hover:text-blue-800 inline-flex items-center gap-1 mr-3"
                      data-testid={`edit-user-${u.id}`}
                    >
                      <Pencil className="w-4 h-4" />Edit
                    </button>
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

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4" data-testid="edit-user-modal" onClick={() => setEditing(null)}>
          <form onClick={(e) => e.stopPropagation()} onSubmit={saveEdit} className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Edit user</h2>
              <button type="button" onClick={() => setEditing(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">First name</label>
                <input
                  className="w-full px-3 py-2 rounded border text-sm"
                  value={editing.first_name ?? ""}
                  onChange={(e) => setEditing({ ...editing, first_name: e.target.value })}
                  data-testid="edit-first-name"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Last name</label>
                <input
                  className="w-full px-3 py-2 rounded border text-sm"
                  value={editing.last_name ?? ""}
                  onChange={(e) => setEditing({ ...editing, last_name: e.target.value })}
                  data-testid="edit-last-name"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  className="w-full px-3 py-2 rounded border text-sm"
                  value={editing.email}
                  onChange={(e) => setEditing({ ...editing, email: e.target.value })}
                  data-testid="edit-email"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Phone</label>
                <input
                  className="w-full px-3 py-2 rounded border text-sm"
                  value={editing.phone ?? ""}
                  onChange={(e) => setEditing({ ...editing, phone: e.target.value })}
                  data-testid="edit-phone"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Title</label>
                <input
                  className="w-full px-3 py-2 rounded border text-sm"
                  value={editing.title ?? ""}
                  onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                  data-testid="edit-title"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Role</label>
                <select
                  className="w-full px-3 py-2 rounded border text-sm"
                  value={editing.role}
                  onChange={(e) => setEditing({ ...editing, role: e.target.value })}
                  data-testid="edit-role"
                >
                  {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white" data-testid="edit-user-save">Save changes</Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
