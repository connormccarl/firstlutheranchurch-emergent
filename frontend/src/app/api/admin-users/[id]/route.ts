/**
 * @module api/admin-users/[id]
 *
 * Admin-only single-user management. Role gate: admin.
 * 
 *   PUT    /api/admin-users/{id}  → update profile / role / active flag
 *   DELETE /api/admin-users/{id}  → remove a user (cascades sessions)
 */

import { NextRequest, NextResponse } from "next/server";
import {
  setUserRole,
  setUserActive,
  deleteUser,
  updateUserProfile,
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

    // Profile fields (always update if any are present)
    const profileKeys = ["email", "first_name", "last_name", "phone", "title", "name"];
    const profileUpdate: Record<string, unknown> = {};
    for (const k of profileKeys) {
      if (k in body) profileUpdate[k] = body[k];
    }
    let user = null;
    if (Object.keys(profileUpdate).length > 0) {
      user = await updateUserProfile(id, profileUpdate);
    }
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
