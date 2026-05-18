import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  verifyAdminCookie,
  updateRecord,
  deleteRecord,
} from "@flc/cms/server";
import { cms } from "@/cms.config";
import { getPool } from "@/lib/pg";

const deps = { config: cms, getPool };

async function requireAuth() {
  const c = (await cookies()).get("flc_cms_admin")?.value;
  return verifyAdminCookie(c);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string; id: string }> },
) {
  if (!(await requireAuth()))
    return NextResponse.json({ detail: "Unauthorized" }, { status: 401 });
  try {
    const { slug, id } = await params;
    const data = await req.json();
    const updated = await updateRecord(deps, slug, id, data);
    if (!updated) return NextResponse.json({ detail: "Not found" }, { status: 404 });
    return NextResponse.json(updated);
  } catch (e) {
    return NextResponse.json(
      { detail: e instanceof Error ? e.message : "Failed" },
      { status: 400 },
    );
  }
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ slug: string; id: string }> },
) {
  if (!(await requireAuth()))
    return NextResponse.json({ detail: "Unauthorized" }, { status: 401 });
  try {
    const { slug, id } = await params;
    const ok = await deleteRecord(deps, slug, id);
    if (!ok) return NextResponse.json({ detail: "Not found" }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { detail: e instanceof Error ? e.message : "Failed" },
      { status: 400 },
    );
  }
}
