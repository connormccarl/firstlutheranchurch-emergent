import { NextResponse } from "next/server";
import { clearAdminCookie } from "@flc/cms/server";

export async function POST() {
  const cookie = clearAdminCookie();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(cookie.name, cookie.value, {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    path: "/",
    maxAge: 0,
  });
  return res;
}
