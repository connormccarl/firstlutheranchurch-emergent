import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { getDb } from "@/lib/mongo";
import { sendEmailNotification, CHURCH_EMAIL } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const now = new Date().toISOString();
    const contact = {
      id: randomUUID(),
      name: body.name,
      email: body.email,
      phone: body.phone || "",
      subject: body.subject,
      message: body.message,
      status: "received",
      created_at: now,
    };

    const db = await getDb();
    await db.collection("contact_forms").insertOne({ ...contact });

    const subject = `📧 New Contact Form: ${contact.subject}`;
    const emailBody = `
New Contact Form Submission!

Name: ${contact.name}
Email: ${contact.email}
Phone: ${contact.phone || "Not provided"}
Subject: ${contact.subject}

Message:
${contact.message}

Contact ID: ${contact.id}
Date: ${contact.created_at}

Please respond to the person directly at their email address.

Best regards,
First Lutheran Church of Miami Website
    `.trim();
    await sendEmailNotification(subject, emailBody, CHURCH_EMAIL);

    return NextResponse.json({
      id: contact.id,
      message: "Your message has been received. Pastor James will respond personally within 24-48 hours.",
      status: "received",
      notification_sent: true,
    });
  } catch (e) {
    console.error("Error creating contact form:", e);
    return NextResponse.json({ detail: "Failed to process contact form" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const skip = parseInt(searchParams.get("skip") || "0", 10);
    const limit = parseInt(searchParams.get("limit") || "50", 10);
    const db = await getDb();
    const contacts = await db
      .collection("contact_forms")
      .find({}, { projection: { _id: 0 } })
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();
    return NextResponse.json({ contacts });
  } catch (e) {
    console.error("Error fetching contact forms:", e);
    return NextResponse.json({ detail: "Failed to fetch contacts" }, { status: 500 });
  }
}
