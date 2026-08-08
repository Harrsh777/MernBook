import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-client";
import { requireAdminApi } from "@/lib/crm/require-admin";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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

  const { id } = await params;

  const { data: inv, error } = await admin
    .from("crm_invoices")
    .select("pdf_storage_path, invoice_number")
    .eq("id", id)
    .single();

  if (error || !inv?.pdf_storage_path) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { data: signed, error: signErr } = await admin.storage
    .from("crm-invoices")
    .createSignedUrl(inv.pdf_storage_path as string, 120);

  if (signErr || !signed?.signedUrl) {
    return NextResponse.json({ error: signErr?.message || "Sign failed" }, { status: 400 });
  }

  return NextResponse.json({
    url: signed.signedUrl,
    invoice_number: inv.invoice_number,
  });
}
