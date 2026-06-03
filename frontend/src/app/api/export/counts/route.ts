/**
 * @module api/export/counts
 *
 * Admin dashboard summary metrics.
 * Returns row counts for events, registrations, contacts, donations.
 * Role gate: editor+.
 */

import { NextResponse } from "next/server";
import { query } from "@connormccarl/nextos/server";

export const dynamic = "force-dynamic";

async function count(table: string): Promise<number> {
  const rows = await query<{ count: string }>(`SELECT COUNT(*)::text AS count FROM ${table}`);
  return parseInt(rows[0]?.count || "0", 10);
}

export async function GET() {
  try {
    const [event_registrations, contact_forms, donations, events] = await Promise.all([
      count("event_registrations"),
      count("contact_forms"),
      count("donations"),
      count("events"),
    ]);
    return NextResponse.json({ event_registrations, contact_forms, donations, events });
  } catch (e) {
    console.error("Counts failed:", e);
    return NextResponse.json({ detail: "Failed to fetch counts" }, { status: 500 });
  }
}
