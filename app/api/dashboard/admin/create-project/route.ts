import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-client";
import { supabaseServer } from "@/lib/supabase-auth";

export async function POST(req: Request) {
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
  const title = String(body?.title || "").trim();
  const description = String(body?.description || "").trim();
  const clientId = String(body?.clientId || "").trim();
  const deadline = body?.deadline ? String(body.deadline) : null;
  const price = body?.price != null ? Number(body.price) : null;

  if (!title || !clientId) {
    return NextResponse.json(
      { error: "Title and client are required." },
      { status: 400 }
    );
  }

  const { data: inserted, error } = await supabaseAdmin
    .from("projects")
    .insert({
      title,
      description: description || null,
      client_id: clientId,
      deadline,
      price,
      status: "in_progress",
      progress: 0,
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true, projectId: inserted?.id });
}

