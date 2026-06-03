/**
 * @module api/contact
 *
 * Public contact-form submission.
 * 
 *   POST /api/contact
 *     body: { name, email, phone?, message }
 * 
 * Persists to `contact_forms` and emails the pastor via Zoho Mail.
 */

import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { query, sendEmail } from "@connormccarl/nextos/server";

const CHURCH_EMAIL = process.env.CHURCH_EMAIL || "pastorjamesdunham@gmail.com";

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

    await query(
      `INSERT INTO contact_forms (id,name,email,phone,subject,message,status,created_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
      [contact.id, contact.name, contact.email, contact.phone, contact.subject, contact.message, contact.status, contact.created_at],
    );

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
    const sent = await sendEmail({ subject, body: emailBody, to: CHURCH_EMAIL, html: false });

    return NextResponse.json({
      id: contact.id,
      message: "Your message has been received. Pastor James will respond personally within 24-48 hours.",
      status: "received",
      notification_sent: sent.ok,
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
    const contacts = await query(
      "SELECT * FROM contact_forms ORDER BY created_at DESC NULLS LAST LIMIT $1 OFFSET $2",
      [limit, skip],
    );
    return NextResponse.json({ contacts });
  } catch (e) {
    console.error("Error fetching contact forms:", e);
    return NextResponse.json({ detail: "Failed to fetch contacts" }, { status: 500 });
  }
}
