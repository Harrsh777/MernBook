import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-client";
import { requireAdminApi } from "@/lib/crm/require-admin";
import { logProjectActivity } from "@/lib/crm/activity";
import { recalcProjectProgress } from "@/lib/crm/progress";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string; milestoneId: string }> }
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

  const { id: projectId, milestoneId } = await params;
  const body = await req.json();

  const patch: Record<string, unknown> = {};
  if (typeof body?.completed === "boolean") patch.completed = body.completed;
  if (body?.name != null) patch.name = String(body.name).trim();
  if (body?.due_date !== undefined)
    patch.due_date = body.due_date ? String(body.due_date) : null;

  if (!Object.keys(patch).length) {
    return NextResponse.json({ error: "No updates" }, { status: 400 });
  }

  const { error } = await admin
    .from("milestones")
    .update(patch)
    .eq("id", milestoneId)
    .eq("project_id", projectId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  await recalcProjectProgress(admin, projectId);

  if (typeof body?.completed === "boolean") {
    await logProjectActivity(
      admin,
      projectId,
      body.completed ? "milestone_completed" : "milestone_reopened",
      body.completed ? "A milestone was completed" : "A milestone was reopened",
      { milestone_id: milestoneId }
    );
  }

  return NextResponse.json({ ok: true });
}
