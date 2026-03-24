import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-client";
import { supabaseServer } from "@/lib/supabase-auth";

export async function POST(req: Request) {
  let supabaseAdmin: ReturnType<typeof getSupabaseAdmin>;
  try {
    supabaseAdmin = getSupabaseAdmin();
  } catch {
    return NextResponse.json(
      { error: "Server is missing Supabase admin configuration." },
      { status: 500 }
    );
  }

  const supabase = supabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const name = String(body?.name || "").trim();
  const email = String(body?.email || "").trim().toLowerCase();
  const password = String(body?.password || "").trim();

  if (!name || !email || password.length < 6) {
    return NextResponse.json(
      { error: "Name, email, and password (min 6) are required." },
      { status: 400 }
    );
  }

  const { data: created, error: createError } =
    await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name, role: "client" },
    });

  if (createError || !created.user) {
    return NextResponse.json(
      { error: createError?.message || "Failed to create user" },
      { status: 400 }
    );
  }

  const { error: profileError } = await supabaseAdmin.from("profiles").upsert({
    id: created.user.id,
    name,
    email,
    role: "client",
  });

  if (profileError) {
    return NextResponse.json(
      { error: profileError.message },
      { status: 400 }
    );
  }

  return NextResponse.json({ ok: true, userId: created.user.id });
}

