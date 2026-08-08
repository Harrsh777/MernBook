import { NextResponse } from "next/server";

const unauthorized = () =>
  NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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

  const { searchParams } = new URL(req.url);
  const projectId = searchParams.get("project_id");
  const status = searchParams.get("status");

  let q = admin
    .from("crm_tasks")
    .select("*")
    .order("status", { ascending: true })
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (projectId) q = q.eq("project_id", projectId);
  if (status) q = q.eq("status", status);

  const { data, error } = await q;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ tasks: data ?? [] });
}

export async function POST(req: Request) {
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

  const body = await req.json();
  const title = String(body?.title || "").trim();
  if (!title) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  const statusVal = ["todo", "in_progress", "done"].includes(String(body?.status))
    ? body.status
    : "todo";

  const { data: last } = await admin
    .from("crm_tasks")
    .select("sort_order")
    .eq("status", statusVal)
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  const sort_order = (last?.sort_order != null ? Number(last.sort_order) : -1) + 1;

  const { data, error } = await admin
    .from("crm_tasks")
    .insert({
      title,
      description: body?.description ? String(body.description) : null,
      priority: ["low", "medium", "high"].includes(String(body?.priority))
        ? body.priority
        : "medium",
      deadline: body?.deadline ? String(body.deadline) : null,
      assigned_to: body?.assigned_to ? String(body.assigned_to) : null,
      project_id: body?.project_id ? String(body.project_id) : null,
      status: statusVal,
      sort_order,
      created_by: gate.user.id,
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true, id: data?.id });
}
