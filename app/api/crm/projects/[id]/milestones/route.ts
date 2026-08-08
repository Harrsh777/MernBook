import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-client";
import { requireAdminApi } from "@/lib/crm/require-admin";
import { logProjectActivity } from "@/lib/crm/activity";
import { recalcProjectProgress } from "@/lib/crm/progress";

export async function POST(
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

  const { id: projectId } = await params;
  const body = await req.json();
  const name = String(body?.name || "").trim();
  const due_date = body?.due_date ? String(body.due_date) : null;

  if (!name) {
    return NextResponse.json({ error: "Name required" }, { status: 400 });
  }

  const { data, error } = await admin
    .from("milestones")
    .insert({
      project_id: projectId,
      name,
      completed: false,
      due_date,
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  await recalcProjectProgress(admin, projectId);
  await logProjectActivity(
    admin,
    projectId,
    "milestone_created",
    `Milestone added: ${name}`,
    { milestone_id: data?.id }
  );

  return NextResponse.json({ ok: true, id: data?.id });
}
