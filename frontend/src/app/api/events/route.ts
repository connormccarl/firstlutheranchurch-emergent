import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { getDb } from "@/lib/mongo";

export async function GET() {
  try {
    const db = await getDb();
    const events = await db.collection("events").find({}, { projection: { _id: 0 } }).toArray();
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
    const ev = {
      id: randomUUID(),
      title: body.title,
      description: body.description || "",
      date: body.date,
      time: body.time,
      location: body.location || "",
      type: body.type,
      pastor: body.pastor || "",
      image: body.image || "",
      created_at: now,
      updated_at: now,
    };
    const db = await getDb();
    await db.collection("events").insertOne({ ...ev });
    return NextResponse.json(ev);
  } catch (e) {
    console.error("Error creating event:", e);
    return NextResponse.json({ detail: "Failed to create event" }, { status: 500 });
  }
}
