import { NextResponse } from "next/server";

const unauthorized = () =>
  NextResponse.json({ error: "Unauthorized" }, { status: 401 });
import { getSupabaseAdmin } from "@/lib/supabase-client";
import { requireAdminApi } from "@/lib/crm/require-admin";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const gate = await requireAdminApi();
  if (gate.error) return gate.error;
  if (!gate.user) return unauthorized();

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

  const { data: existing } = await admin
    .from("crm_job_applications")
    .select("id, status")
    .eq("id", id)
    .eq("owner_id", gate.user.id)
    .single();

  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await req.json();
  const patch: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (body?.company_name != null)
    patch.company_name = String(body.company_name).trim();
  if (body?.role_title != null) patch.role_title = String(body.role_title).trim();
  if (body?.date_applied != null) patch.date_applied = String(body.date_applied);
  if (body?.notes !== undefined)
    patch.notes = body.notes ? String(body.notes) : null;
  if (body?.follow_up_at !== undefined)
    patch.follow_up_at = body.follow_up_at ? String(body.follow_up_at) : null;
  if (
    body?.status != null &&
    ["applied", "interview", "offer", "rejected"].includes(body.status)
  ) {
    patch.status = body.status;
  }

  const { error } = await admin
    .from("crm_job_applications")
    .update(patch)
    .eq("id", id)
    .eq("owner_id", gate.user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  if (body?.status != null && body.status !== existing.status) {
    await admin.from("crm_job_timeline_events").insert({
      job_application_id: id,
      title: `Status → ${body.status}`,
      body: null,
      created_by: gate.user.id,
    });
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const gate = await requireAdminApi();
  if (gate.error) return gate.error;
  if (!gate.user) return unauthorized();

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
  const { error } = await admin
    .from("crm_job_applications")
    .delete()
    .eq("id", id)
    .eq("owner_id", gate.user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
