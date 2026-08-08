import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-client";
import { requireAdminApi } from "@/lib/crm/require-admin";
import { logProjectActivity } from "@/lib/crm/activity";
import { randomBytes } from "crypto";

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

  const { id: projectId } = await params;
  const body = await req.json();

  const { data: project } = await admin
    .from("projects")
    .select("client_id")
    .eq("id", projectId)
    .single();

  if (!project?.client_id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const clientId = project.client_id as string;

  if (typeof body?.access_disabled === "boolean") {
    const { error } = await admin
      .from("profiles")
      .update({ access_disabled: body.access_disabled })
      .eq("id", clientId)
      .eq("role", "client");

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    await logProjectActivity(
      admin,
      projectId,
      body.access_disabled ? "client_disabled" : "client_enabled",
      body.access_disabled
        ? "Client portal access disabled"
        : "Client portal access enabled",
      { client_id: clientId }
    );
  }

  return NextResponse.json({ ok: true });
}

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
  const action = String(body?.action || "");

  if (action !== "reset_password") {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  const { data: project } = await admin
    .from("projects")
    .select("client_id")
    .eq("id", projectId)
    .single();

  if (!project?.client_id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const clientId = project.client_id as string;
  const newPassword = randomBytes(12).toString("base64url").slice(0, 14);

  const { error } = await admin.auth.admin.updateUserById(clientId, {
    password: newPassword,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  await logProjectActivity(
    admin,
    projectId,
    "client_password_reset",
    "Client password was reset by admin",
    {}
  );

  return NextResponse.json({ ok: true, temporaryPassword: newPassword });
}
