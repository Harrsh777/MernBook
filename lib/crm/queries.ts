import { getSupabaseAdmin } from "@/lib/supabase-client";

type Admin = ReturnType<typeof getSupabaseAdmin>;

export async function fetchCrmStats(admin: Admin) {
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);
  const isoMonth = startOfMonth.toISOString();
  const today = new Date().toISOString().slice(0, 10);

  const [
    clientsRes,
    projectsRes,
    revenueRes,
    milestonesRes,
    pendingPayRes,
  ] = await Promise.all([
    admin.from("profiles").select("id", { count: "exact", head: true }).eq("role", "client"),
    admin
      .from("projects")
      .select("id", { count: "exact", head: true })
      .neq("status", "completed"),
    admin
      .from("project_payments")
      .select("amount")
      .eq("status", "paid")
      .gte("paid_at", isoMonth),
    admin
      .from("milestones")
      .select("id", { count: "exact", head: true })
      .eq("due_date", today)
      .eq("completed", false),
    admin.from("project_payments").select("amount").eq("status", "pending"),
  ]);

  const revenueRows = revenueRes.data ?? [];
  const revenueThisMonth = revenueRows.reduce(
    (s, r) => s + Number(r.amount ?? 0),
    0
  );

  const pendingRows = pendingPayRes.data ?? [];
  const pendingFromPayments = pendingRows.reduce(
    (s, r) => s + Number(r.amount ?? 0),
    0
  );

  const { data: projectsBudget } = await admin
    .from("projects")
    .select("price, amount_paid");

  let pendingFromBudget = 0;
  for (const p of projectsBudget ?? []) {
    const price = Number(p.price ?? 0);
    const paid = Number(p.amount_paid ?? 0);
    if (price > paid) pendingFromBudget += price - paid;
  }

  return {
    totalClients: clientsRes.count ?? 0,
    activeProjects: projectsRes.count ?? 0,
    revenueThisMonth,
    pendingPayments: pendingFromBudget + pendingFromPayments,
    tasksDueToday: milestonesRes.count ?? 0,
  };
}

export async function fetchCrmChart(admin: Admin) {
  const since = new Date();
  since.setDate(since.getDate() - 30);
  since.setHours(0, 0, 0, 0);

  const { data, error } = await admin
    .from("project_payments")
    .select("amount, paid_at")
    .eq("status", "paid")
    .gte("paid_at", since.toISOString());

  if (error) throw new Error(error.message);

  const byDay = new Map<string, number>();
  for (const row of data ?? []) {
    if (!row.paid_at) continue;
    const d = row.paid_at.slice(0, 10);
    byDay.set(d, (byDay.get(d) ?? 0) + Number(row.amount ?? 0));
  }

  const points: { date: string; revenue: number }[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    points.push({ date: key, revenue: byDay.get(key) ?? 0 });
  }

  return points;
}

export async function fetchCrmActivity(
  admin: Admin,
  limit: number
): Promise<
  {
    id: string;
    project_id: string;
    project_title: string | null;
    event_type: string;
    message: string | null;
    created_at: string;
  }[]
> {
  const { data, error } = await admin
    .from("project_activity")
    .select("id, project_id, event_type, message, created_at")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw new Error(error.message);

  const rows = data ?? [];
  const pids = [...new Set(rows.map((r) => r.project_id).filter(Boolean))] as string[];
  const titleMap = new Map<string, string>();
  if (pids.length) {
    const { data: projects } = await admin
      .from("projects")
      .select("id, title")
      .in("id", pids);
    for (const p of projects ?? []) {
      titleMap.set(p.id as string, (p.title as string) ?? "");
    }
  }

  return rows.map((row) => ({
    id: row.id as string,
    project_id: row.project_id as string,
    project_title: titleMap.get(row.project_id as string) ?? null,
    event_type: row.event_type as string,
    message: (row.message as string) ?? null,
    created_at: row.created_at as string,
  }));
}

export type CrmProjectRow = {
  id: string;
  title: string;
  status: string;
  progress: number | null;
  deadline: string | null;
  start_date: string | null;
  price: number | null;
  amount_paid: number | null;
  updated_at: string | null;
  client_name: string | null;
  client_email: string | null;
};

export type CrmProjectDetail = {
  project: {
    id: string;
    client_id: string;
    title: string;
    description: string | null;
    status: string;
    progress: number | null;
    deadline: string | null;
    start_date: string | null;
    price: number | null;
    amount_paid: number | null;
    updated_at: string | null;
  };
  client: {
    id: string;
    name: string | null;
    email: string | null;
    access_disabled: boolean | null;
    created_at: string | null;
  } | null;
  milestones: {
    id: string;
    name: string;
    completed: boolean;
    due_date: string | null;
    created_at: string;
  }[];
  activities: {
    id: string;
    event_type: string;
    message: string | null;
    created_at: string;
    metadata: Record<string, unknown> | null;
  }[];
};

export async function fetchCrmProjectDetail(
  admin: Admin,
  id: string
): Promise<CrmProjectDetail | null> {
  const { data: project, error } = await admin
    .from("projects")
    .select(
      "id, client_id, title, description, status, progress, deadline, start_date, price, amount_paid, updated_at"
    )
    .eq("id", id)
    .single();

  if (error || !project) return null;

  const { data: client } = await admin
    .from("profiles")
    .select("id, name, email, access_disabled, created_at")
    .eq("id", project.client_id as string)
    .single();

  const { data: milestones } = await admin
    .from("milestones")
    .select("id, name, completed, due_date, created_at")
    .eq("project_id", id)
    .order("created_at", { ascending: true });

  const { data: activities } = await admin
    .from("project_activity")
    .select("id, event_type, message, created_at, metadata")
    .eq("project_id", id)
    .order("created_at", { ascending: false })
    .limit(50);

  return {
    project: project as CrmProjectDetail["project"],
    client: client as CrmProjectDetail["client"],
    milestones: (milestones ?? []) as CrmProjectDetail["milestones"],
    activities: (activities ?? []) as CrmProjectDetail["activities"],
  };
}

export async function fetchCrmProjectList(admin: Admin): Promise<CrmProjectRow[]> {
  const { data: projectRows, error } = await admin
    .from("projects")
    .select(
      "id, title, status, progress, deadline, start_date, price, amount_paid, updated_at, client_id"
    )
    .order("updated_at", { ascending: false });

  if (error) throw new Error(error.message);

  const ids = [
    ...new Set(
      (projectRows ?? [])
        .map((p) => p.client_id as string | null)
        .filter(Boolean)
    ),
  ] as string[];

  const profMap = new Map<
    string,
    { name: string | null; email: string | null }
  >();
  if (ids.length) {
    const { data: profs } = await admin
      .from("profiles")
      .select("id, name, email")
      .in("id", ids);
    for (const p of profs ?? []) {
      profMap.set(p.id as string, {
        name: (p.name as string) ?? null,
        email: (p.email as string) ?? null,
      });
    }
  }

  return (projectRows ?? []).map((p) => {
    const prof = p.client_id ? profMap.get(p.client_id as string) : undefined;
    return {
      id: p.id as string,
      title: p.title as string,
      status: p.status as string,
      progress: p.progress as number | null,
      deadline: p.deadline as string | null,
      start_date: p.start_date as string | null,
      price: p.price as number | null,
      amount_paid: p.amount_paid as number | null,
      updated_at: p.updated_at as string | null,
      client_name: prof?.name ?? null,
      client_email: prof?.email ?? null,
    };
  });
}
