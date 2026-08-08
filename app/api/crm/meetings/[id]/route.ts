import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-client";
import { requireAdminApi } from "@/lib/crm/require-admin";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const gate = await requireAdminApi();
  if (gate.error) return gate.error;

  let admin: ReturnType<typeof getSupabaseAdmin>;
  try {
    admin = getSupabaseAdmin();
  } catch {
    return NextResponse.json(
      { error: "Server is missing Supabase admin configuration." },
      { status: 500 }
    );
  }

  const { id } = await params;
  const body = await req.json();
  const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };

  if (body?.title != null) patch.title = String(body.title).trim();
  if (body?.description !== undefined)
    patch.description = body.description ? String(body.description) : null;
  if (body?.starts_at != null) patch.starts_at = String(body.starts_at);
  if (body?.ends_at !== undefined)
    patch.ends_at = body.ends_at ? String(body.ends_at) : null;
  if (body?.meet_url !== undefined)
    patch.meet_url = body.meet_url ? String(body.meet_url) : null;
  if (body?.project_id !== undefined)
    patch.project_id = body.project_id ? String(body.project_id) : null;

  const { error } = await admin.from("crm_meetings").update(patch).eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const gate = await requireAdminApi();
  if (gate.error) return gate.error;

  let admin: ReturnType<typeof getSupabaseAdmin>;
  try {
    admin = getSupabaseAdmin();
  } catch {
    return NextResponse.json(
      { error: "Server is missing Supabase admin configuration." },
      { status: 500 }
    );
  }

  const { id } = await params;
  const { error } = await admin.from("crm_meetings").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
