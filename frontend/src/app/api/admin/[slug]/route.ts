/**
 * @module api/admin/[slug]
 *
 * Generic CMS list + create endpoint.
 * 
 *   GET  /api/admin/{slug}  → returns all rows for the resource
 *   POST /api/admin/{slug}  → creates a new row (CSRF required)
 * 
 * Resource definitions come from `cms.config.ts`. Role gate: editor+.
 */

import { NextRequest, NextResponse } from "next/server";
import {
  cmsListRecords,
  cmsCreateRecord,
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

export async function GET(_: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    await requireSession("viewer");
    const { slug } = await params;
    return NextResponse.json(await cmsListRecords(cms, slug));
  } catch (e) {
    return err(e);
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    await requireSession("editor");
    await assertCsrf(req);
    const { slug } = await params;
    const created = await cmsCreateRecord(cms, slug, await req.json());
    return NextResponse.json(created);
  } catch (e) {
    return err(e);
  }
}
