import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-client";
import { requireAdminApi } from "@/lib/crm/require-admin";
import { logProjectActivity } from "@/lib/crm/activity";

export async function GET(
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

  const { data: project, error } = await admin
    .from("projects")
    .select(
      "id, client_id, title, description, status, progress, deadline, start_date, price, amount_paid, updated_at"
    )
    .eq("id", id)
    .single();

  if (error || !project) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { data: client } = await admin
    .from("profiles")
    .select("id, name, email, access_disabled, created_at")
    .eq("id", project.client_id as string)
    .single();

  const { data: milestones } = await admin
    .from("milestones")
    .select("id, name, completed, due_date, created_at")
    .eq("project_id", id)
    .order("created_at", { ascending: true });

  const { data: activities } = await admin
    .from("project_activity")
    .select("id, event_type, message, created_at, metadata")
    .eq("project_id", id)
    .order("created_at", { ascending: false })
    .limit(50);

  return NextResponse.json({
    project,
    client,
    milestones: milestones ?? [],
    activities: activities ?? [],
  });
}

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

  if (body?.status != null) {
    const s = String(body.status);
    if (
      !["not_started", "in_progress", "review", "completed"].includes(s)
    ) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }
    patch.status = s;
  }

  if (body?.title != null) patch.title = String(body.title).trim();
  if (body?.description != null)
    patch.description = String(body.description).trim();
  if (body?.deadline !== undefined)
    patch.deadline = body.deadline ? String(body.deadline) : null;
  if (body?.start_date !== undefined)
    patch.start_date = body.start_date ? String(body.start_date) : null;
  if (body?.price != null) patch.price = Number(body.price);
  if (body?.amount_paid != null) {
    const next = Number(body.amount_paid);
    if (Number.isNaN(next) || next < 0) {
      return NextResponse.json({ error: "Invalid amount_paid" }, { status: 400 });
    }
    patch.amount_paid = next;
  }

  if (!Object.keys(patch).length) {
    return NextResponse.json({ error: "No updates" }, { status: 400 });
  }

  const { data: before } = await admin
    .from("projects")
    .select("amount_paid, status")
    .eq("id", id)
    .single();

  const { data: updated, error } = await admin
    .from("projects")
    .update(patch)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  if (patch.status != null && patch.status !== before?.status) {
    await logProjectActivity(
      admin,
      id,
      "status_changed",
      `Status set to ${patch.status}`,
      { from: before?.status, to: patch.status }
    );
  }

  if (patch.amount_paid != null && patch.amount_paid !== before?.amount_paid) {
    const delta =
      Number(patch.amount_paid) - Number(before?.amount_paid ?? 0);
    if (delta > 0) {
      await admin.from("project_payments").insert({
        project_id: id,
        amount: delta,
        status: "paid",
        paid_at: new Date().toISOString(),
        note: "Recorded from CRM",
      });
    }
    await logProjectActivity(
      admin,
      id,
      "payment_received",
      `Payment recorded (total paid: ${patch.amount_paid})`,
      { amount_paid: patch.amount_paid }
    );
  }

  return NextResponse.json({ ok: true, project: updated });
}
