/**
 * @module api/admin/[slug]/[id]
 *
 * Generic CMS update + delete endpoint.
 * 
 *   PUT    /api/admin/{slug}/{id}  → partial update (CSRF required)
 *   DELETE /api/admin/{slug}/{id}  → hard delete (CSRF required)
 * 
 * Role gate: editor+.
 */

import { NextRequest, NextResponse } from "next/server";
import {
  cmsUpdateRecord,
  cmsDeleteRecord,
  requireSession,
  assertCsrf,
  AuthError,
} from "@connormccarl/nextos/server";
import { cms } from "@/cms.config";

function err(e: unknown) {
  if (e instanceof AuthError) return NextResponse.json({ detail: e.message }, { status: e.status });
  return NextResponse.json(
    { detail: e instanceof Error ? e.message : "Failed" },
    { status: 400 },
  );
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string; id: string }> },
) {
  try {
    await requireSession("editor");
    await assertCsrf(req);
    const { slug, id } = await params;
    const updated = await cmsUpdateRecord(cms, slug, id, await req.json());
    if (!updated) return NextResponse.json({ detail: "Not found" }, { status: 404 });
    return NextResponse.json(updated);
  } catch (e) {
    return err(e);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string; id: string }> },
) {
  try {
    await requireSession("editor");
    await assertCsrf(req);
    const { slug, id } = await params;
    const ok = await cmsDeleteRecord(cms, slug, id);
    if (!ok) return NextResponse.json({ detail: "Not found" }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return err(e);
  }
}
