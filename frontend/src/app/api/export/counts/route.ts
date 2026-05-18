import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongo";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const db = await getDb();
    const [event_registrations, contact_forms, donations, events] =
      await Promise.all([
        db.collection("event_registrations").countDocuments(),
        db.collection("contact_forms").countDocuments(),
        db.collection("donations").countDocuments(),
        db.collection("events").countDocuments(),
      ]);
    return NextResponse.json({
      event_registrations,
      contact_forms,
      donations,
      events,
    });
  } catch (e) {
    console.error("Counts failed:", e);
    return NextResponse.json({ detail: "Failed to fetch counts" }, { status: 500 });
  }
}
