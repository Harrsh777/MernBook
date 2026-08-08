import { CrmFinanceClient } from "./crm-finance-client";
import { fetchCrmProjectList } from "@/lib/crm/queries";
import { getSupabaseAdmin } from "@/lib/supabase-client";

export default async function CrmFinancePage() {
  let projects: { id: string; title: string }[] = [];
  try {
    const admin = getSupabaseAdmin();
    const list = await fetchCrmProjectList(admin);
    projects = list.map((p) => ({ id: p.id, title: p.title }));
  } catch {
    projects = [];
  }

  return <CrmFinanceClient initialProjects={projects} />;
}
