import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { getDb } from "@/lib/mongo";
import { sendEmailNotification, CHURCH_EMAIL } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const now = new Date().toISOString();
    const reg = {
      id: randomUUID(),
      event_title: body.event_title,
      name: body.name,
      email: body.email,
      phone: body.phone || "",
      notes: body.notes || "",
      status: "confirmed",
      created_at: now,
    };

    const db = await getDb();
    await db.collection("event_registrations").insertOne({ ...reg });

    const subject = `🎉 New Event Registration: ${reg.event_title}`;
    const emailBody = `
New Event Registration Received!

Event: ${reg.event_title}
Name: ${reg.name}
Email: ${reg.email}
Phone: ${reg.phone || "Not provided"}
Notes: ${reg.notes || "None"}

Registration ID: ${reg.id}
Date: ${reg.created_at}

Please contact the registrant to confirm their attendance.

Best regards,
First Lutheran Church of Miami Website
    `.trim();
    await sendEmailNotification(subject, emailBody, CHURCH_EMAIL);

    return NextResponse.json({
      id: reg.id,
      message: `Successfully registered for ${reg.event_title}`,
      event: reg.event_title,
      status: "confirmed",
      notification_sent: true,
    });
  } catch (e) {
    console.error("Error creating event registration:", e);
    return NextResponse.json({ detail: "Failed to process registration" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const skip = parseInt(searchParams.get("skip") || "0", 10);
    const limit = parseInt(searchParams.get("limit") || "50", 10);
    const db = await getDb();
    const registrations = await db
      .collection("event_registrations")
      .find({}, { projection: { _id: 0 } })
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();
    return NextResponse.json({ registrations });
  } catch (e) {
    console.error("Error fetching event registrations:", e);
    return NextResponse.json({ detail: "Failed to fetch registrations" }, { status: 500 });
  }
}
