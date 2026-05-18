import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { getDb } from "@/lib/mongo";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.amount || body.amount <= 0) {
      return NextResponse.json({ detail: "Donation amount must be greater than 0" }, { status: 400 });
    }
    const now = new Date().toISOString();
    const donation = {
      id: randomUUID(),
      amount: body.amount,
      donor_name: body.donor_name,
      donor_email: body.donor_email,
      message: body.message || "",
      payment_method: body.payment_method || "paypal",
      status: "pending" as const,
      paypal_order_id: null as string | null,
      transaction_id: null as string | null,
      created_at: now,
      completed_at: null as string | null,
    };
    const db = await getDb();
    await db.collection("donations").insertOne({ ...donation });
    return NextResponse.json({
      id: donation.id,
      message: "Donation record created successfully",
      amount: donation.amount,
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
    const db = await getDb();
    const donations = await db
      .collection("donations")
      .find({}, { projection: { _id: 0 } })
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();
    return NextResponse.json({ donations });
  } catch (e) {
    console.error("Error fetching donations:", e);
    return NextResponse.json({ detail: "Failed to fetch donations" }, { status: 500 });
  }
}
