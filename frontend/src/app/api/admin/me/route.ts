import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAdminCookie } from "@flc/cms/server";

export async function GET() {
  const c = (await cookies()).get("flc_cms_admin")?.value;
  return NextResponse.json({ authenticated: verifyAdminCookie(c) });
}
