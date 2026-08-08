import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-auth";

export async function requireAdminApi() {
  const supabase = supabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      user: null as null,
      supabase,
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, access_disabled")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return {
      user: null as null,
      supabase,
      error: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    };
  }

  if (profile?.access_disabled) {
    return {
      user: null as null,
      supabase,
      error: NextResponse.json({ error: "Account disabled" }, { status: 403 }),
    };
  }

  return { user, supabase, error: null as null };
}
