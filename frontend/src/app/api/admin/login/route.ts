import { NextRequest, NextResponse } from "next/server";
import { checkAdminPassword, signAdminCookie } from "@flc/cms/server";

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json().catch(() => ({ password: "" }));
    if (!password || !checkAdminPassword(String(password))) {
      return NextResponse.json({ detail: "Incorrect password" }, { status: 401 });
    }
    const cookie = signAdminCookie();
    const res = NextResponse.json({ ok: true });
    res.cookies.set(cookie.name, cookie.value, {
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      path: "/",
      maxAge: cookie.maxAge,
    });
    return res;
  } catch {
    return NextResponse.json({ detail: "Login failed" }, { status: 500 });
  }
}
