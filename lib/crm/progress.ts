import type { SupabaseClient } from "@supabase/supabase-js";

export async function recalcProjectProgress(
  admin: SupabaseClient,
  projectId: string
) {
  const { data: rows, error } = await admin
    .from("milestones")
    .select("completed")
    .eq("project_id", projectId);

  if (error || !rows?.length) {
    await admin.from("projects").update({ progress: 0 }).eq("id", projectId);
    return 0;
  }

  const done = rows.filter((r) => r.completed).length;
  const progress = Math.round((done / rows.length) * 100);
  await admin.from("projects").update({ progress }).eq("id", projectId);
  return progress;
}
