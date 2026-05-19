import { NextRequest, NextResponse } from "next/server";
import {
  setUserRole,
  setUserActive,
  deleteUser,
  requireSession,
  assertCsrf,
  AuthError,
} from "@connormccarl/nextos/server";

function err(e: unknown) {
  if (e instanceof AuthError) return NextResponse.json({ detail: e.message }, { status: e.status });
  return NextResponse.json({ detail: e instanceof Error ? e.message : "Failed" }, { status: 400 });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireSession("admin");
    await assertCsrf(req);
    const { id } = await params;
    const body = await req.json();
    let user = null;
    if (typeof body.role === "string") user = await setUserRole(id, body.role);
    if (typeof body.is_active === "boolean") user = await setUserActive(id, body.is_active);
    return NextResponse.json(user ?? { ok: true });
  } catch (e) {
    return err(e);
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireSession("admin");
    await assertCsrf(req);
    const { id } = await params;
    const ok = await deleteUser(id);
    return NextResponse.json({ ok });
  } catch (e) {
    return err(e);
  }
}
