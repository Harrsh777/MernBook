import { NextResponse } from "next/server";

const unauthorized = () =>
  NextResponse.json({ error: "Unauthorized" }, { status: 401 });
import { getSupabaseAdmin } from "@/lib/supabase-client";
import { requireAdminApi } from "@/lib/crm/require-admin";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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

  const { id } = await params;

  const { data: job } = await admin
    .from("crm_job_applications")
    .select("id")
    .eq("id", id)
    .eq("owner_id", gate.user.id)
    .single();

  if (!job) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { data, error } = await admin
    .from("crm_job_timeline_events")
    .select("*")
    .eq("job_application_id", id)
    .order("event_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ events: data ?? [] });
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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

  const { id } = await params;

  const { data: job } = await admin
    .from("crm_job_applications")
    .select("id")
    .eq("id", id)
    .eq("owner_id", gate.user.id)
    .single();

  if (!job) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await req.json();
  const title = String(body?.title || "").trim();
  if (!title) {
    return NextResponse.json({ error: "title required" }, { status: 400 });
  }

  const { data, error } = await admin
    .from("crm_job_timeline_events")
    .insert({
      job_application_id: id,
      title,
      body: body?.body ? String(body.body) : null,
      event_at: body?.event_at ? String(body.event_at) : new Date().toISOString(),
      created_by: gate.user.id,
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true, id: data?.id });
}
