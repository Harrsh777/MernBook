import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-client";
import { requireAdminApi } from "@/lib/crm/require-admin";

function monthBounds(ym: string) {
  const [y, m] = ym.split("-").map(Number);
  const start = new Date(y, m - 1, 1);
  const end = new Date(y, m, 0, 23, 59, 59, 999);
  return { start: start.toISOString(), end: end.toISOString(), y, m };
}

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
  const now = new Date();
  const ym =
    searchParams.get("month") ||
    `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const { start, end } = monthBounds(ym);

  const [
    paidRes,
    expenseRes,
    milestoneRes,
    burnRes,
  ] = await Promise.all([
    admin
      .from("project_payments")
      .select("amount")
      .eq("status", "paid")
      .gte("paid_at", start)
      .lte("paid_at", end),
    admin
      .from("crm_expenses")
      .select("amount")
      .gte("expense_date", start.slice(0, 10))
      .lte("expense_date", end.slice(0, 10)),
    admin
      .from("project_payment_milestones")
      .select("id, project_id, phase, label, amount, due_date, paid_at")
      .is("paid_at", null)
      .not("due_date", "is", null)
      .order("due_date", { ascending: true })
      .limit(50),
    admin
      .from("crm_expenses")
      .select("amount, expense_date")
      .gte(
        "expense_date",
        new Date(now.getFullYear(), now.getMonth() - 3, 1).toISOString().slice(0, 10)
      ),
  ]);

  const incomeMonth = (paidRes.data ?? []).reduce(
    (s, r) => s + Number(r.amount ?? 0),
    0
  );
  const expensesMonth = (expenseRes.data ?? []).reduce(
    (s, r) => s + Number(r.amount ?? 0),
    0
  );

  const byMonth = new Map<string, number>();
  for (const r of burnRes.data ?? []) {
    const d = String(r.expense_date).slice(0, 7);
    byMonth.set(d, (byMonth.get(d) ?? 0) + Number(r.amount ?? 0));
  }
  const burnValues = [...byMonth.values()];
  const burnRate =
    burnValues.length > 0
      ? burnValues.reduce((a, b) => a + b, 0) / burnValues.length
      : 0;

  const today = now.toISOString().slice(0, 10);
  const rawMilestones = milestoneRes.data ?? [];
  const pids = [
    ...new Set(
      rawMilestones
        .map((r: { project_id?: string }) => r.project_id)
        .filter(Boolean)
    ),
  ] as string[];
  const titleMap = new Map<string, string>();
  if (pids.length) {
    const { data: projs } = await admin
      .from("projects")
      .select("id, title")
      .in("id", pids);
    for (const p of projs ?? []) {
      titleMap.set(p.id as string, (p.title as string) ?? "");
    }
  }

  const upcoming = rawMilestones
    .map((row: Record<string, unknown>) => {
      const due = row.due_date ? String(row.due_date) : "";
      const overdue = Boolean(due && due < today);
      const pid = row.project_id as string;
      return {
        id: row.id,
        project_id: pid,
        project_title: titleMap.get(pid) ?? null,
        phase: row.phase,
        label: row.label,
        amount: row.amount,
        due_date: row.due_date,
        overdue,
      };
    })
    .filter((u) => u.due_date);

  return NextResponse.json({
    month: ym,
    incomeMonth,
    expensesMonth,
    profitMonth: incomeMonth - expensesMonth,
    burnRate,
    upcomingPayments: upcoming,
  });
}
