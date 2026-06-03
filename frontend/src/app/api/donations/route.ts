/**
 * @module api/donations
 *
 * Public donation logger.
 * 
 *   POST /api/donations
 *     body: { amount, donor_name, donor_email, message, payment_method }
 * 
 * Records the donation in `donations` for the admin dashboard.
 * The actual payment was already collected by PayPal / Zeffy on the client.
 */

import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { query } from "@connormccarl/nextos/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.amount || body.amount <= 0) {
      return NextResponse.json({ detail: "Donation amount must be greater than 0" }, { status: 400 });
    }
    const now = new Date().toISOString();
    const id = randomUUID();
    await query(
      `INSERT INTO donations (id, amount, donor_name, donor_email, message, payment_method, status, created_at)
       VALUES ($1,$2,$3,$4,$5,$6,'pending',$7)`,
      [
        id,
        body.amount,
        body.donor_name,
        body.donor_email,
        body.message || "",
        body.payment_method || "paypal",
        now,
      ],
    );
    return NextResponse.json({
      id,
      message: "Donation record created successfully",
      amount: body.amount,
      status: "pending",
    });
  } catch (e) {
    console.error("Error creating donation:", e);
    return NextResponse.json({ detail: "Failed to create donation" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const skip = parseInt(searchParams.get("skip") || "0", 10);
    const limit = parseInt(searchParams.get("limit") || "50", 10);
    const donations = await query(
      "SELECT * FROM donations ORDER BY created_at DESC NULLS LAST LIMIT $1 OFFSET $2",
      [limit, skip],
    );
    return NextResponse.json({ donations });
  } catch (e) {
    console.error("Error fetching donations:", e);
    return NextResponse.json({ detail: "Failed to fetch donations" }, { status: 500 });
  }
}
