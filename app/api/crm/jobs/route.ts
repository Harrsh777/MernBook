import { NextResponse } from "next/server";

const unauthorized = () =>
  NextResponse.json({ error: "Unauthorized" }, { status: 401 });
import { getSupabaseAdmin } from "@/lib/supabase-client";
import { requireAdminApi } from "@/lib/crm/require-admin";

export async function GET() {
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

  const { data, error } = await admin
    .from("crm_job_applications")
    .select("*")
    .eq("owner_id", gate.user.id)
    .order("updated_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ jobs: data ?? [] });
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
  const company_name = String(body?.company_name || "").trim();
  const role_title = String(body?.role_title || "").trim();
  const date_applied = body?.date_applied ? String(body.date_applied) : "";

  if (!company_name || !role_title || !date_applied) {
    return NextResponse.json(
      { error: "company_name, role_title, date_applied required" },
      { status: 400 }
    );
  }

  const status = ["applied", "interview", "offer", "rejected"].includes(
    String(body?.status)
  )
    ? body.status
    : "applied";

  const { data, error } = await admin
    .from("crm_job_applications")
    .insert({
      company_name,
      role_title,
      date_applied,
      status,
      notes: body?.notes ? String(body.notes) : null,
      follow_up_at: body?.follow_up_at ? String(body.follow_up_at) : null,
      owner_id: gate.user.id,
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  const jobId = data?.id as string;
  await admin.from("crm_job_timeline_events").insert({
    job_application_id: jobId,
    title: "Application submitted",
    body: notesPreview(body?.notes),
    created_by: gate.user.id,
  });

  return NextResponse.json({ ok: true, id: jobId });
}

function notesPreview(notes: unknown) {
  if (!notes) return null;
  const s = String(notes).trim();
  return s.length > 500 ? `${s.slice(0, 500)}…` : s;
}
