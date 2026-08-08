import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-client";
import { requireAdminApi } from "@/lib/crm/require-admin";
import { logProjectActivity } from "@/lib/crm/activity";
import { sendClientDashboardReadyEmail } from "@/lib/crm/welcome-email";
import { fetchCrmProjectList } from "@/lib/crm/queries";
import { randomBytes } from "crypto";

const DEFAULT_MILESTONES = ["Discovery & kickoff", "Design", "Build", "Review & launch"];

function generateTempPassword() {
  return randomBytes(12).toString("base64url").slice(0, 14);
}

export async function GET() {
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

  try {
    const rows = await fetchCrmProjectList(admin);
    return NextResponse.json({ projects: rows });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Failed to list projects";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
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
  const title = String(body?.title || "").trim();
  const description = String(body?.description || "").trim();
  const clientName = String(body?.clientName || "").trim();
  const clientEmail = String(body?.clientEmail || "").trim().toLowerCase();
  const startDate = body?.startDate ? String(body.startDate) : null;
  const deadline = body?.deadline ? String(body.deadline) : null;
  const budget = body?.budget != null ? Number(body.budget) : null;
  const useMagicLink = Boolean(body?.useMagicLink);
  const milestones: string[] = Array.isArray(body?.milestones)
    ? body.milestones.map((m: unknown) => String(m).trim()).filter(Boolean)
    : DEFAULT_MILESTONES;

  if (!title || !clientName || !clientEmail) {
    return NextResponse.json(
      { error: "Project name, client name, and client email are required." },
      { status: 400 }
    );
  }

  const appUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "") ||
    "http://localhost:3000";

  let clientId: string | null = null;
  let tempPassword: string | undefined;
  let isNewClient = false;

  const { data: existingProfile } = await admin
    .from("profiles")
    .select("id, role")
    .eq("email", clientEmail)
    .maybeSingle();

  if (existingProfile?.id && existingProfile.role === "client") {
    clientId = existingProfile.id;
  } else if (existingProfile?.id) {
    return NextResponse.json(
      { error: "That email belongs to a non-client account." },
      { status: 400 }
    );
  } else {
    isNewClient = true;
    tempPassword = useMagicLink ? undefined : generateTempPassword();

    if (useMagicLink) {
      const { data: invited, error: invErr } =
        await admin.auth.admin.inviteUserByEmail(clientEmail, {
          data: { name: clientName, role: "client" },
          redirectTo: `${appUrl}/auth/callback`,
        });

      if (invErr || !invited?.user?.id) {
        return NextResponse.json(
          { error: invErr?.message || "Failed to send invite email" },
          { status: 400 }
        );
      }

      clientId = invited.user.id;

      await admin.from("profiles").upsert({
        id: clientId,
        name: clientName,
        email: clientEmail,
        role: "client",
        access_disabled: false,
      });
    } else {
      if (!tempPassword || tempPassword.length < 8) {
        return NextResponse.json(
          { error: "Could not generate password." },
          { status: 500 }
        );
      }

      const { data: created, error: createError } =
        await admin.auth.admin.createUser({
          email: clientEmail,
          password: tempPassword,
          email_confirm: true,
          user_metadata: { name: clientName, role: "client" },
        });

      if (createError || !created.user) {
        return NextResponse.json(
          { error: createError?.message || "Failed to create client login" },
          { status: 400 }
        );
      }

      clientId = created.user.id;

      const { error: profileError } = await admin.from("profiles").upsert({
        id: clientId,
        name: clientName,
        email: clientEmail,
        role: "client",
        access_disabled: false,
      });

      if (profileError) {
        return NextResponse.json(
          { error: profileError.message },
          { status: 400 }
        );
      }
    }
  }

  if (!clientId) {
    return NextResponse.json(
      { error: "Client could not be resolved." },
      { status: 400 }
    );
  }

  const { data: project, error: projErr } = await admin
    .from("projects")
    .insert({
      title,
      description: description || null,
      client_id: clientId,
      start_date: startDate,
      deadline,
      price: budget,
      amount_paid: 0,
      status: "not_started",
      progress: 0,
    })
    .select("id")
    .single();

  if (projErr || !project) {
    return NextResponse.json(
      { error: projErr?.message || "Failed to create project" },
      { status: 400 }
    );
  }

  const projectId = project.id as string;

  if (milestones.length) {
    const { error: msErr } = await admin.from("milestones").insert(
      milestones.map((name) => ({
        project_id: projectId,
        name,
        completed: false,
      }))
    );
    if (msErr) {
      return NextResponse.json({ error: msErr.message }, { status: 400 });
    }
  }

  await logProjectActivity(
    admin,
    projectId,
    "project_created",
    `Project "${title}" created`,
    { client_email: clientEmail, is_new_client: isNewClient }
  );

  const emailResult = await sendClientDashboardReadyEmail({
    to: clientEmail,
    clientName,
    loginEmail: clientEmail,
    temporaryPassword: tempPassword,
    appUrl,
  });

  return NextResponse.json({
    ok: true,
    projectId,
    clientId,
    isNewClient,
    temporaryPassword: isNewClient && !useMagicLink ? tempPassword : undefined,
    emailSent: emailResult.sent,
    emailNote: emailResult.sent
      ? undefined
      : "Configure RESEND_API_KEY and RESEND_FROM to send email automatically.",
  });
}
