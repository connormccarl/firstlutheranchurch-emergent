/**
 * @module api/events
 *
 * Public events index.
 *   GET /api/events → all upcoming events (used by the public /events page).
 */

import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { query } from "@connormccarl/nextos/server";

export async function GET() {
  try {
    const events = await query(
      "SELECT * FROM events ORDER BY date NULLS LAST, time NULLS LAST"
    );
    return NextResponse.json(events);
  } catch (e) {
    console.error("Error fetching events:", e);
    return NextResponse.json({ detail: "Failed to fetch events" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const now = new Date().toISOString();
    const id = randomUUID();
    const rows = await query(
      `INSERT INTO events (id, title, description, date, time, location, type, pastor, image, created_at, updated_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$10)
       RETURNING *`,
      [
        id,
        body.title,
        body.description || "",
        body.date,
        body.time,
        body.location || "",
        body.type,
        body.pastor || "",
        body.image || "",
        now,
      ],
    );
    return NextResponse.json(rows[0]);
  } catch (e) {
    console.error("Error creating event:", e);
    return NextResponse.json({ detail: "Failed to create event" }, { status: 500 });
  }
}
