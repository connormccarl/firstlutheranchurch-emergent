"use client";

/**
 * @module ResourcePage
 *
 * High-level wrapper that glues DataTable + RecordForm together for
 * a single CMS resource. Used by `/admin/[slug]/page.tsx`.
 */
import React, { useEffect, useState, useCallback } from "react";
import { Plus, Loader2, RefreshCw } from "lucide-react";
import type { ResourceDef, ResourceRecord } from "../cms/types.js";
import { DataTable } from "./DataTable.js";
import { RecordForm } from "./RecordForm.js";

export interface ResourcePageProps {
  resource: ResourceDef;
  endpoint?: string;
  /** CSRF token for write requests (read from /api/auth/me). */
  csrfToken?: string;
}

export function ResourcePage({ resource, endpoint, csrfToken }: ResourcePageProps) {
  const base = endpoint || `/api/admin/${resource.slug}`;
  const [records, setRecords] = useState<ResourceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<ResourceRecord | null>(null);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const headers = (): Record<string, string> => {
    const h: Record<string, string> = { "Content-Type": "application/json" };
    if (csrfToken) h["X-CSRF-Token"] = csrfToken;
    return h;
  };

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(base, { credentials: "include" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setRecords(Array.isArray(data) ? data : data.records || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, [base]);

  useEffect(() => { reload(); }, [reload]);

  const submitNew = async (data: Record<string, unknown>) => {
    const res = await fetch(base, { method: "POST", headers: headers(), credentials: "include", body: JSON.stringify(data) });
    if (!res.ok) throw new Error((await res.json().catch(() => ({})))?.detail || `HTTP ${res.status}`);
    await reload();
  };

  const submitEdit = async (data: Record<string, unknown>) => {
    if (!editing) return;
    const res = await fetch(`${base}/${editing.id}`, { method: "PUT", headers: headers(), credentials: "include", body: JSON.stringify(data) });
    if (!res.ok) throw new Error((await res.json().catch(() => ({})))?.detail || `HTTP ${res.status}`);
    await reload();
  };

  const handleDelete = async (r: ResourceRecord) => {
    if (!confirm(`Delete this ${resource.singular.toLowerCase()}?`)) return;
    const res = await fetch(`${base}/${r.id}`, { method: "DELETE", headers: headers(), credentials: "include" });
    if (res.ok) setRecords((prev) => prev.filter((x) => x.id !== r.id));
  };

  return (
    <div data-testid={`nextos-resource-${resource.slug}`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{resource.label}</h1>
          <p className="text-sm text-slate-500">
            {resource.readOnly ? "Read-only — view records only." : `Manage ${resource.label.toLowerCase()}.`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={reload} className="inline-flex items-center gap-1 px-3 py-2 text-sm rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100" data-testid={`nextos-refresh-${resource.slug}`}>
            <RefreshCw className="w-4 h-4" />Refresh
          </button>
          {!resource.readOnly && (
            <button type="button" onClick={() => setCreating(true)} data-testid={`nextos-new-${resource.slug}`} className="inline-flex items-center gap-1 px-3 py-2 text-sm rounded-lg bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="w-4 h-4" />New {resource.singular}
            </button>
          )}
        </div>
      </div>
      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700" data-testid="nextos-list-error">
          {error}
        </div>
      )}
      {loading ? (
        <div className="flex items-center gap-2 text-slate-500">
          <Loader2 className="w-4 h-4 animate-spin" />Loading…
        </div>
      ) : (
        <DataTable
          resource={resource}
          records={records}
          onEdit={resource.readOnly ? undefined : (r) => setEditing(r)}
          onDelete={resource.readOnly ? undefined : handleDelete}
        />
      )}
      {creating && <RecordForm resource={resource} onClose={() => setCreating(false)} onSubmit={submitNew} />}
      {editing && <RecordForm resource={resource} initial={editing} onClose={() => setEditing(null)} onSubmit={submitEdit} />}
    </div>
  );
}
