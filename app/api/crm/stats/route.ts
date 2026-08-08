import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-client";
import { requireAdminApi } from "@/lib/crm/require-admin";
import { fetchCrmStats } from "@/lib/crm/queries";

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
    const stats = await fetchCrmStats(admin);
    return NextResponse.json(stats);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Failed to load stats";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
