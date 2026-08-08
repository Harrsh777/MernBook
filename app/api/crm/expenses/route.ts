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
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  let q = admin
    .from("crm_expenses")
    .select("*")
    .order("expense_date", { ascending: false });

  if (from) q = q.gte("expense_date", from);
  if (to) q = q.lte("expense_date", to);

  const { data, error } = await q;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ expenses: data ?? [] });
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
  const category = String(body?.category || "");
  const amount = body?.amount != null ? Number(body.amount) : NaN;
  const expense_date = body?.expense_date ? String(body.expense_date) : "";

  if (!["tools", "apis", "salary", "other"].includes(category) || Number.isNaN(amount) || !expense_date) {
    return NextResponse.json(
      { error: "category, amount, expense_date required" },
      { status: 400 }
    );
  }

  const { data, error } = await admin
    .from("crm_expenses")
    .insert({
      category,
      vendor: body?.vendor ? String(body.vendor) : null,
      description: body?.description ? String(body.description) : null,
      amount,
      expense_date,
      is_recurring: Boolean(body?.is_recurring),
      notes: body?.notes ? String(body.notes) : null,
      created_by: gate.user.id,
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true, id: data?.id });
}
