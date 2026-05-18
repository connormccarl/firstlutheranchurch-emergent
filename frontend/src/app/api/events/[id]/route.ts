import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongo";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const db = await getDb();
    const event = await db.collection("events").findOne({ id }, { projection: { _id: 0 } });
    if (!event) return NextResponse.json({ detail: "Event not found" }, { status: 404 });
    return NextResponse.json(event);
  } catch (e) {
    console.error("Error fetching event:", e);
    return NextResponse.json({ detail: "Failed to fetch event" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const update = { ...body, updated_at: new Date().toISOString() };
    const db = await getDb();
    const result = await db.collection("events").updateOne({ id }, { $set: update });
    if (result.matchedCount === 0) return NextResponse.json({ detail: "Event not found" }, { status: 404 });
    const updated = await db.collection("events").findOne({ id }, { projection: { _id: 0 } });
    return NextResponse.json(updated);
  } catch (e) {
    console.error("Error updating event:", e);
    return NextResponse.json({ detail: "Failed to update event" }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const db = await getDb();
    const result = await db.collection("events").deleteOne({ id });
    if (result.deletedCount === 0) return NextResponse.json({ detail: "Event not found" }, { status: 404 });
    return NextResponse.json({ message: "Event deleted successfully" });
  } catch (e) {
    console.error("Error deleting event:", e);
    return NextResponse.json({ detail: "Failed to delete event" }, { status: 500 });
  }
}
