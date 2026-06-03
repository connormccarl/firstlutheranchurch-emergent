/**
 * @module api/health
 *
 * Root `/api` ping. Returns the service name and timestamp so external
 * monitors can verify the Next.js API surface is up.
 */

import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ message: "First Lutheran Church of Miami API" });
}
