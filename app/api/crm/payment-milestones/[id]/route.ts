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
  const patch: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (body?.label !== undefined)
    patch.label = body.label ? String(body.label) : null;
  if (body?.amount != null) patch.amount = Number(body.amount);
  if (body?.due_date !== undefined)
    patch.due_date = body.due_date ? String(body.due_date) : null;
  if (body?.notes !== undefined)
    patch.notes = body.notes ? String(body.notes) : null;
  if (body?.paid_at !== undefined) {
    patch.paid_at = body.paid_at ? String(body.paid_at) : null;
  }
  if (body?.phase != null && ["advance", "mid", "final", "other"].includes(body.phase)) {
    patch.phase = body.phase;
  }

  const { error } = await admin
    .from("project_payment_milestones")
    .update(patch)
    .eq("id", id);

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
  const { error } = await admin
    .from("project_payment_milestones")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
