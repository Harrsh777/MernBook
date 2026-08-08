import { CrmActivityFeed } from "@/components/crm-activity-feed";
import { CrmProjectsTable } from "@/components/crm-projects-table";
import { CrmRevenueChart } from "@/components/crm-revenue-chart";
import { CrmSectionCards } from "@/components/crm-section-cards";
import { CrmSiteHeader } from "@/components/crm-site-header";
import {
  fetchCrmActivity,
  fetchCrmChart,
  fetchCrmProjectList,
  fetchCrmStats,
} from "@/lib/crm/queries";
import { getSupabaseAdmin } from "@/lib/supabase-client";

export default async function CrmDashboardPage() {
  let admin: ReturnType<typeof getSupabaseAdmin>;
  try {
    admin = getSupabaseAdmin();
  } catch {
    return (
      <>
        <CrmSiteHeader title="Admin CRM" />
        <div className="p-6 text-sm text-destructive">
          Set{" "}
          <code className="rounded bg-muted px-1">SUPABASE_SERVICE_ROLE_KEY</code>{" "}
          and run the SQL migration in{" "}
          <code className="rounded bg-muted px-1">supabase/migrations</code>.
        </div>
      </>
    );
  }

  let stats: Awaited<ReturnType<typeof fetchCrmStats>>;
  let points: Awaited<ReturnType<typeof fetchCrmChart>>;
  let activity: Awaited<ReturnType<typeof fetchCrmActivity>>;
  let projects: Awaited<ReturnType<typeof fetchCrmProjectList>>;

  try {
    [stats, points, activity, projects] = await Promise.all([
      fetchCrmStats(admin),
      fetchCrmChart(admin),
      fetchCrmActivity(admin, 25),
      fetchCrmProjectList(admin),
    ]);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Failed to load CRM data";
    return (
      <>
        <CrmSiteHeader title="Admin CRM" />
        <div className="space-y-2 p-6 text-sm">
          <p className="text-destructive">{msg}</p>
          <p className="text-muted-foreground">
            Apply{" "}
            <code className="rounded bg-muted px-1">
              supabase/migrations/001_crm_core.sql
            </code>{" "}
            in the Supabase SQL editor if tables are missing.
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <CrmSiteHeader title="Admin dashboard" />
      <div className="flex flex-1 flex-col gap-4 py-4 md:gap-6 md:py-6">
        <CrmSectionCards stats={stats} />
        <div className="grid gap-4 px-4 lg:grid-cols-3 lg:px-6">
          <div className="lg:col-span-2">
            <CrmRevenueChart points={points} />
          </div>
          <CrmActivityFeed items={activity} />
        </div>
        <div className="px-4 lg:px-6">
          <CrmProjectsTable projects={projects} />
        </div>
      </div>
    </>
  );
}
