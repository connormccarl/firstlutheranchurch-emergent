import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ message: "First Lutheran Church of Miami API" });
}
