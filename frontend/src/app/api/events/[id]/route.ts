/**
 * @module api/events/[id]
 *
 * Public single-event lookup.
 *   GET /api/events/{id} → one event by id.
 */

import { NextRequest, NextResponse } from "next/server";
import { query } from "@connormccarl/nextos/server";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const rows = await query("SELECT * FROM events WHERE id=$1", [id]);
    if (!rows.length) return NextResponse.json({ detail: "Event not found" }, { status: 404 });
    return NextResponse.json(rows[0]);
  } catch (e) {
    console.error("Error fetching event:", e);
    return NextResponse.json({ detail: "Failed to fetch event" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const now = new Date().toISOString();
    const rows = await query(
      `UPDATE events SET
         title=COALESCE($2,title),
         description=COALESCE($3,description),
         date=COALESCE($4,date),
         time=COALESCE($5,time),
         location=COALESCE($6,location),
         type=COALESCE($7,type),
         pastor=COALESCE($8,pastor),
         image=COALESCE($9,image),
         updated_at=$10
       WHERE id=$1
       RETURNING *`,
      [
        id,
        body.title ?? null,
        body.description ?? null,
        body.date ?? null,
        body.time ?? null,
        body.location ?? null,
        body.type ?? null,
        body.pastor ?? null,
        body.image ?? null,
        now,
      ],
    );
    if (!rows.length) return NextResponse.json({ detail: "Event not found" }, { status: 404 });
    return NextResponse.json(rows[0]);
  } catch (e) {
    console.error("Error updating event:", e);
    return NextResponse.json({ detail: "Failed to update event" }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const rows = await query("DELETE FROM events WHERE id=$1 RETURNING id", [id]);
    if (!rows.length) return NextResponse.json({ detail: "Event not found" }, { status: 404 });
    return NextResponse.json({ message: "Event deleted successfully" });
  } catch (e) {
    console.error("Error deleting event:", e);
    return NextResponse.json({ detail: "Failed to delete event" }, { status: 500 });
  }
}
