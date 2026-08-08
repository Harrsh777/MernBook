import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-client";
import { requireAdminApi } from "@/lib/crm/require-admin";

export async function GET(req: Request) {
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

  const projectId = new URL(req.url).searchParams.get("project_id");
  if (!projectId) {
    return NextResponse.json({ error: "project_id required" }, { status: 400 });
  }

  const { data, error } = await admin
    .from("project_payment_milestones")
    .select("*")
    .eq("project_id", projectId)
    .order("sort_order", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  const today = new Date().toISOString().slice(0, 10);
  const enriched = (data ?? []).map((row: Record<string, unknown>) => {
    const paid = Boolean(row.paid_at);
    const due = row.due_date ? String(row.due_date) : null;
    let derived: "paid" | "pending" | "overdue" = "pending";
    if (paid) derived = "paid";
    else if (due && due < today) derived = "overdue";
    return { ...row, derived_status: derived };
  });

  return NextResponse.json({ milestones: enriched });
}

export async function POST(req: Request) {
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

  const body = await req.json();
  const project_id = String(body?.project_id || "").trim();
  const phase = String(body?.phase || "other");
  const amount = body?.amount != null ? Number(body.amount) : NaN;

  if (!project_id || !["advance", "mid", "final", "other"].includes(phase) || Number.isNaN(amount)) {
    return NextResponse.json(
      { error: "project_id, phase, amount required" },
      { status: 400 }
    );
  }

  const { data: maxRow } = await admin
    .from("project_payment_milestones")
    .select("sort_order")
    .eq("project_id", project_id)
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  const sort_order = (maxRow?.sort_order != null ? Number(maxRow.sort_order) : -1) + 1;

  const { data, error } = await admin
    .from("project_payment_milestones")
    .insert({
      project_id,
      phase,
      label: body?.label ? String(body.label) : null,
      amount,
      due_date: body?.due_date ? String(body.due_date) : null,
      paid_at: body?.paid_at ? String(body.paid_at) : null,
      notes: body?.notes ? String(body.notes) : null,
      sort_order,
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true, id: data?.id });
}
