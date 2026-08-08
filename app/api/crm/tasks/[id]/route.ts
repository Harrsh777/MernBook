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
  const patch: Record<string, unknown> = {};

  if (body?.title != null) patch.title = String(body.title).trim();
  if (body?.description !== undefined)
    patch.description = body.description ? String(body.description) : null;
  if (body?.priority != null && ["low", "medium", "high"].includes(body.priority))
    patch.priority = body.priority;
  if (body?.deadline !== undefined)
    patch.deadline = body.deadline ? String(body.deadline) : null;
  if (body?.assigned_to !== undefined)
    patch.assigned_to = body.assigned_to ? String(body.assigned_to) : null;
  if (body?.project_id !== undefined)
    patch.project_id = body.project_id ? String(body.project_id) : null;
  if (body?.status != null && ["todo", "in_progress", "done"].includes(body.status))
    patch.status = body.status;
  if (body?.sort_order != null) patch.sort_order = Number(body.sort_order);

  patch.updated_at = new Date().toISOString();

  if (!Object.keys(patch).length) {
    return NextResponse.json({ error: "No updates" }, { status: 400 });
  }

  const { error } = await admin.from("crm_tasks").update(patch).eq("id", id);

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
  const { error } = await admin.from("crm_tasks").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
