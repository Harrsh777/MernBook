import type { SupabaseClient } from "@supabase/supabase-js";

export async function logProjectActivity(
  admin: SupabaseClient,
  projectId: string,
  eventType: string,
  message: string,
  metadata?: Record<string, unknown>
) {
  const { error } = await admin.from("project_activity").insert({
    project_id: projectId,
    event_type: eventType,
    message,
    metadata: metadata ?? {},
  });
  if (error) console.error("logProjectActivity", error.message);
}
