import { notFound } from "next/navigation";
import { CrmProjectDetailClient } from "./crm-project-detail";
import { fetchCrmProjectDetail } from "@/lib/crm/queries";
import { getSupabaseAdmin } from "@/lib/supabase-client";

export default async function CrmProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let admin: ReturnType<typeof getSupabaseAdmin>;
  try {
    admin = getSupabaseAdmin();
  } catch {
    notFound();
  }

  const detail = await fetchCrmProjectDetail(admin, id);
  if (!detail) notFound();

  return <CrmProjectDetailClient initial={detail} />;
}
