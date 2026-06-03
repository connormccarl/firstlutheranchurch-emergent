"use client";

/**
 * @module RecordForm
 *
 * Auto-generated create/edit form for any CMS resource. Renders one
 * input per `FieldDef`, coerces values to the declared type on submit,
 * and posts to the matching `/api/admin/[slug]` endpoint.
 */
import React, { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import type { ResourceDef, ResourceRecord } from "../cms/types.js";

export interface RecordFormProps {
  resource: ResourceDef;
  initial?: ResourceRecord | null;
  onClose: () => void;
  onSubmit: (data: Record<string, unknown>) => Promise<void>;
}

export function RecordForm({ resource, initial, onClose, onSubmit }: RecordFormProps) {
  const [values, setValues] = useState<Record<string, unknown>>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const v: Record<string, unknown> = {};
    for (const f of resource.fields) v[f.key] = initial?.[f.key] ?? "";
    setValues(v);
  }, [resource, initial]);

  const handleChange = (k: string, v: unknown) =>
    setValues((prev) => ({ ...prev, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await onSubmit(values);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4" data-testid="nextos-record-form" onClick={onClose}>
      <form onClick={(e) => e.stopPropagation()} onSubmit={submit} className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white">
          <h2 className="text-lg font-semibold text-slate-900">
            {initial ? `Edit ${resource.singular}` : `New ${resource.singular}`}
          </h2>
          <button type="button" onClick={onClose} data-testid="nextos-form-close" className="text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          {resource.fields.map((f) => {
            const id = `nextos-field-${f.key}`;
            const common = {
              id, "data-testid": id,
              value: (values[f.key] as string | number) ?? "",
              onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => handleChange(f.key, e.target.value),
              required: f.required,
              placeholder: f.placeholder,
              className: "w-full mt-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
            };
            return (
              <div key={f.key}>
                <label htmlFor={id} className="block text-xs font-medium text-slate-700">
                  {f.label}{f.required && <span className="text-red-500"> *</span>}
                </label>
                {f.type === "textarea" || f.type === "richtext" ? (
                  <textarea rows={f.type === "richtext" ? 8 : 4} {...common} />
                ) : f.type === "select" ? (
                  <select {...common}>
                    <option value="">Select…</option>
                    {(f.options || []).map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                ) : f.type === "boolean" ? (
                  <input id={id} data-testid={id} type="checkbox"
                    checked={Boolean(values[f.key])}
                    onChange={(e) => handleChange(f.key, e.target.checked)}
                    className="mt-2 h-4 w-4 rounded border-slate-300" />
                ) : f.type === "date" ? <input type="date" {...common} />
                : f.type === "time" ? <input type="time" {...common} />
                : f.type === "number" ? <input type="number" {...common} />
                : <input type={f.type} {...common} />}
                {f.helpText && <p className="text-xs text-slate-500 mt-1">{f.helpText}</p>}
              </div>
            );
          })}
          {error && <p className="text-sm text-red-600" data-testid="nextos-form-error">{error}</p>}
        </div>
        <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-end gap-2 sticky bottom-0 bg-white">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50">Cancel</button>
          <button type="submit" disabled={saving} data-testid="nextos-form-submit" className="px-4 py-2 text-sm rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white inline-flex items-center gap-2">
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}Save
          </button>
        </div>
      </form>
    </div>
  );
}
