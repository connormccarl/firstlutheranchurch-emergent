/**
 * @module api/event-registrations
 *
 * Public event-registration submission.
 * 
 *   POST /api/event-registrations
 *     body: { name, email, phone?, notes?, event_title }
 * 
 * Persists to `event_registrations` and emails the pastor.
 */

import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { query, sendEmail } from "@connormccarl/nextos/server";

const CHURCH_EMAIL = process.env.CHURCH_EMAIL || "pastorjamesdunham@gmail.com";

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

    await query(
      `INSERT INTO event_registrations (id,event_title,name,email,phone,notes,status,created_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
      [reg.id, reg.event_title, reg.name, reg.email, reg.phone, reg.notes, reg.status, reg.created_at],
    );

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
    const sent = await sendEmail({ subject, body: emailBody, to: CHURCH_EMAIL, html: false });

    return NextResponse.json({
      id: reg.id,
      message: `Successfully registered for ${reg.event_title}`,
      event: reg.event_title,
      status: "confirmed",
      notification_sent: sent.ok,
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
    const registrations = await query(
      "SELECT * FROM event_registrations ORDER BY created_at DESC NULLS LAST LIMIT $1 OFFSET $2",
      [limit, skip],
    );
    return NextResponse.json({ registrations });
  } catch (e) {
    console.error("Error fetching event registrations:", e);
    return NextResponse.json({ detail: "Failed to fetch registrations" }, { status: 500 });
  }
}
