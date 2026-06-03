"use client";

/**
 * @module DataTable
 *
 * Auto-generated list view for any CMS resource. Reads field defs
 * off the resource and renders one column per `tableColumns` entry
 * (or first 5 fields). Provides edit + delete row actions.
 */
import React from "react";
import { Pencil, Trash2 } from "lucide-react";
import type { ResourceDef, ResourceRecord } from "../cms/types.js";

export interface DataTableProps {
  resource: ResourceDef;
  records: ResourceRecord[];
  onEdit?: (r: ResourceRecord) => void;
  onDelete?: (r: ResourceRecord) => void;
}

function formatCell(value: unknown): string {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "string" && value.length > 60) return value.slice(0, 57) + "…";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

export function DataTable({ resource, records, onEdit, onDelete }: DataTableProps) {
  const columns =
    resource.tableColumns ?? resource.fields.slice(0, 4).map((f) => f.key);

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full text-sm" data-testid={`nextos-table-${resource.slug}`}>
        <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
          <tr>
            {columns.map((c) => {
              const field = resource.fields.find((f) => f.key === c);
              return (
                <th key={c} className="px-4 py-3 font-semibold">
                  {field?.label ?? c}
                </th>
              );
            })}
            {!resource.readOnly && <th className="px-4 py-3 font-semibold text-right">Actions</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {records.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length + (resource.readOnly ? 0 : 1)}
                className="px-4 py-10 text-center text-slate-400"
              >
                No records yet.
              </td>
            </tr>
          ) : (
            records.map((r) => (
              <tr key={r.id} className="hover:bg-slate-50" data-testid={`nextos-row-${r.id}`}>
                {columns.map((c) => (
                  <td key={c} className="px-4 py-3 text-slate-700 align-top">
                    {formatCell(r[c])}
                  </td>
                ))}
                {!resource.readOnly && (
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    {onEdit && (
                      <button
                        type="button"
                        onClick={() => onEdit(r)}
                        data-testid={`nextos-edit-${r.id}`}
                        className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 mr-3"
                      >
                        <Pencil className="w-4 h-4" />
                        Edit
                      </button>
                    )}
                    {onDelete && (
                      <button
                        type="button"
                        onClick={() => onDelete(r)}
                        data-testid={`nextos-delete-${r.id}`}
                        className="inline-flex items-center gap-1 text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
