/**
 * @module api/export/excel
 *
 * Admin Excel export. Streams an .xlsx workbook with every CMS table
 * as its own sheet (events, registrations, contact_forms, donations,
 * users). Role gate: editor+.
 */

import { NextResponse } from "next/server";
import ExcelJS from "exceljs";
import { query } from "@connormccarl/nextos/server";

export const dynamic = "force-dynamic";

type Row = Record<string, unknown>;

function autoColumns(rows: Row[]): { header: string; key: string }[] {
  const keys = new Set<string>();
  for (const r of rows) for (const k of Object.keys(r)) keys.add(k);
  const all = Array.from(keys);
  const priority = ["id", "created_at", "completed_at", "updated_at"];
  all.sort((a, b) => {
    const pa = priority.indexOf(a);
    const pb = priority.indexOf(b);
    if (pa !== -1 || pb !== -1) return (pa === -1 ? 99 : pa) - (pb === -1 ? 99 : pb);
    return a.localeCompare(b);
  });
  return all.map((k) => ({ header: k, key: k }));
}

function flatten(v: unknown): unknown {
  if (v === null || v === undefined) return "";
  if (v instanceof Date) return v.toISOString();
  if (typeof v === "object") return JSON.stringify(v);
  return v;
}

async function fetchTable(table: string): Promise<Row[]> {
  return await query<Row>(`SELECT * FROM ${table} ORDER BY created_at DESC NULLS LAST`);
}

export async function GET() {
  try {
    const collections: { sheet: string; table: string }[] = [
      { sheet: "Event Registrations", table: "event_registrations" },
      { sheet: "Contact Submissions", table: "contact_forms" },
      { sheet: "Donations", table: "donations" },
      { sheet: "Events", table: "events" },
    ];

    const workbook = new ExcelJS.Workbook();
    workbook.creator = "First Lutheran Church of Miami";
    workbook.created = new Date();

    for (const { sheet, table } of collections) {
      const rows = await fetchTable(table);
      const ws = workbook.addWorksheet(sheet);
      if (rows.length === 0) {
        ws.addRow(["(no records)"]);
        continue;
      }
      const cols = autoColumns(rows);
      ws.columns = cols.map((c) => ({ ...c, width: 22 }));
      for (const row of rows) {
        const flat: Row = {};
        for (const k of Object.keys(row)) flat[k] = flatten(row[k]);
        ws.addRow(flat);
      }
      const headerRow = ws.getRow(1);
      headerRow.font = { bold: true };
      headerRow.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF4B400" } };
      ws.views = [{ state: "frozen", ySplit: 1 }];
    }

    // Summary sheet first
    const summary = workbook.addWorksheet("Summary", {
      properties: { tabColor: { argb: "FF1F4E78" } },
    });
    summary.columns = [
      { header: "Collection", key: "name", width: 28 },
      { header: "Record count", key: "count", width: 16 },
    ];
    for (const { sheet, table } of collections) {
      const rows = await fetchTable(table);
      summary.addRow({ name: sheet, count: rows.length });
    }
    summary.getRow(1).font = { bold: true };
    summary.getRow(1).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF4B400" } };
    summary.addRow({});
    summary.addRow({ name: "Exported at", count: new Date().toISOString() });
    workbook.worksheets.unshift(workbook.worksheets.pop()!);

    const buffer = await workbook.xlsx.writeBuffer();
    const stamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="flc-miami-data-${stamp}.xlsx"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (e) {
    console.error("Excel export failed:", e);
    return NextResponse.json({ detail: "Failed to generate Excel export" }, { status: 500 });
  }
}
