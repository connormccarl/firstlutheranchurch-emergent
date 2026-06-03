/**
 * @module api/admin-users
 *
 * Admin-only user management. Role gate: admin.
 * 
 *   GET  /api/admin-users  → list every user (no passwords)
 *   POST /api/admin-users  → create a new user (CSRF required)
 */

import { NextRequest, NextResponse } from "next/server";
import {
  listUsers,
  registerUser,
  requireSession,
  assertCsrf,
  AuthError,
} from "@connormccarl/nextos/server";

function err(e: unknown) {
  if (e instanceof AuthError) return NextResponse.json({ detail: e.message }, { status: e.status });
  return NextResponse.json({ detail: e instanceof Error ? e.message : "Failed" }, { status: 400 });
}

export async function GET() {
  try {
    await requireSession("admin");
    return NextResponse.json(await listUsers());
  } catch (e) {
    return err(e);
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireSession("admin");
    await assertCsrf(req);
    const body = await req.json();
    const user = await registerUser({
      email: body.email,
      password: body.password,
      name: body.name,
      role: body.role || "viewer",
    });
    return NextResponse.json(user);
  } catch (e) {
    return err(e);
  }
}
