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
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  let q = admin
    .from("crm_meetings")
    .select("*")
    .order("starts_at", { ascending: true });

  if (projectId) q = q.eq("project_id", projectId);
  if (from) q = q.gte("starts_at", from);
  if (to) q = q.lte("starts_at", to);

  const { data, error } = await q;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ meetings: data ?? [] });
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
  const starts_at = body?.starts_at ? String(body.starts_at) : null;

  if (!title || !starts_at) {
    return NextResponse.json(
      { error: "title and starts_at are required" },
      { status: 400 }
    );
  }

  const { data, error } = await admin
    .from("crm_meetings")
    .insert({
      title,
      description: body?.description ? String(body.description) : null,
      starts_at,
      ends_at: body?.ends_at ? String(body.ends_at) : null,
      meet_url: body?.meet_url ? String(body.meet_url) : null,
      project_id: body?.project_id ? String(body.project_id) : null,
      created_by: gate.user.id,
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true, id: data?.id });
}
