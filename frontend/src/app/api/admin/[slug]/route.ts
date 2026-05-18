import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  verifyAdminCookie,
  listRecords,
  createRecord,
} from "@flc/cms/server";
import { cms } from "@/cms.config";
import { getDb } from "@/lib/mongo";

const deps = { config: cms, getDb };

async function requireAuth() {
  const c = (await cookies()).get("flc_cms_admin")?.value;
  return verifyAdminCookie(c);
}

export async function GET(_: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  if (!(await requireAuth()))
    return NextResponse.json({ detail: "Unauthorized" }, { status: 401 });
  try {
    const { slug } = await params;
    const records = await listRecords(deps, slug);
    return NextResponse.json(records);
  } catch (e) {
    return NextResponse.json(
      { detail: e instanceof Error ? e.message : "Failed" },
      { status: 400 },
    );
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  if (!(await requireAuth()))
    return NextResponse.json({ detail: "Unauthorized" }, { status: 401 });
  try {
    const { slug } = await params;
    const data = await req.json();
    const created = await createRecord(deps, slug, data);
    return NextResponse.json(created);
  } catch (e) {
    return NextResponse.json(
      { detail: e instanceof Error ? e.message : "Failed" },
      { status: 400 },
    );
  }
}
