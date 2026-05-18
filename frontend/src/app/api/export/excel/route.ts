import { NextResponse } from "next/server";
import ExcelJS from "exceljs";
import { getDb } from "@/lib/mongo";

export const dynamic = "force-dynamic";

type Row = Record<string, unknown>;

function autoColumns(rows: Row[]): { header: string; key: string }[] {
  const keys = new Set<string>();
  for (const r of rows) for (const k of Object.keys(r)) keys.add(k);
  // Stable, friendly ordering: id, created_at first if present, then alpha
  const all = Array.from(keys);
  const priority = ["id", "created_at", "completed_at", "updated_at"];
  all.sort((a, b) => {
    const pa = priority.indexOf(a);
    const pb = priority.indexOf(b);
    if (pa !== -1 || pb !== -1) {
      return (pa === -1 ? 99 : pa) - (pb === -1 ? 99 : pb);
    }
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

async function fetchCollection(name: string): Promise<Row[]> {
  const db = await getDb();
  const docs = await db
    .collection(name)
    .find({}, { projection: { _id: 0 } })
    .sort({ created_at: -1 })
    .toArray();
  return docs as Row[];
}

export async function GET() {
  try {
    const collections: { sheet: string; collection: string }[] = [
      { sheet: "Event Registrations", collection: "event_registrations" },
      { sheet: "Contact Submissions", collection: "contact_forms" },
      { sheet: "Donations", collection: "donations" },
      { sheet: "Events", collection: "events" },
    ];

    const workbook = new ExcelJS.Workbook();
    workbook.creator = "First Lutheran Church of Miami";
    workbook.created = new Date();

    for (const { sheet, collection } of collections) {
      const rows = await fetchCollection(collection);
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

      // Style header
      const headerRow = ws.getRow(1);
      headerRow.font = { bold: true };
      headerRow.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFF4B400" },
      };
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
    for (const { sheet, collection } of collections) {
      const rows = await fetchCollection(collection);
      summary.addRow({ name: sheet, count: rows.length });
    }
    summary.getRow(1).font = { bold: true };
    summary.getRow(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFF4B400" },
    };
    summary.addRow({});
    summary.addRow({ name: "Exported at", count: new Date().toISOString() });

    // Move summary to first position
    workbook.worksheets.unshift(workbook.worksheets.pop()!);

    const buffer = await workbook.xlsx.writeBuffer();
    const stamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="flc-miami-data-${stamp}.xlsx"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (e) {
    console.error("Excel export failed:", e);
    return NextResponse.json(
      { detail: "Failed to generate Excel export" },
      { status: 500 }
    );
  }
}
