import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-client";
import { requireAdminApi } from "@/lib/crm/require-admin";
import { fetchCrmChart } from "@/lib/crm/queries";

/** Last 30 days of paid revenue (by paid_at day). */
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
    const points = await fetchCrmChart(admin);
    return NextResponse.json({ points });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Failed to load chart";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
