import { NextResponse } from "next/server";

const unauthorized = () =>
  NextResponse.json({ error: "Unauthorized" }, { status: 401 });
import { getSupabaseAdmin } from "@/lib/supabase-client";
import { requireAdminApi } from "@/lib/crm/require-admin";
import { buildInvoicePdf } from "@/lib/crm/invoice-pdf";
import { sendInvoiceEmail } from "@/lib/crm/invoice-email";

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

  const { data, error } = await admin
    .from("crm_invoices")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ invoices: data ?? [] });
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
  const client_email = String(body?.client_email || "").trim();
  const client_name = String(body?.client_name || "").trim();
  const amount = body?.amount != null ? Number(body.amount) : NaN;
  const currency = String(body?.currency || "INR");
  const project_id = body?.project_id ? String(body.project_id) : null;
  const sendEmail = Boolean(body?.send_email);

  if (!client_email || Number.isNaN(amount) || amount <= 0) {
    return NextResponse.json(
      { error: "client_email and positive amount required" },
      { status: 400 }
    );
  }

  const lineItemsRaw = Array.isArray(body?.line_items) ? body.line_items : [];
  const line_items =
    lineItemsRaw.length > 0
      ? lineItemsRaw.map((x: { description?: string; amount?: number }) => ({
          description: String(x?.description || "Item"),
          amount: Number(x?.amount ?? 0),
        }))
      : [{ description: "Services", amount }];

  const invoiceNumber = `INV-${Date.now()}`;
  const issuedAt = new Date().toISOString().slice(0, 10);

  const { data: row, error: insErr } = await admin
    .from("crm_invoices")
    .insert({
      project_id,
      invoice_number: invoiceNumber,
      client_email,
      client_name: client_name || null,
      amount,
      currency,
      line_items,
      status: "draft",
      created_by: gate.user.id,
    })
    .select("id")
    .single();

  if (insErr || !row) {
    return NextResponse.json(
      { error: insErr?.message || "Insert failed" },
      { status: 400 }
    );
  }

  const invoiceId = row.id as string;
  const pdfBuf = buildInvoicePdf({
    invoiceNumber,
    clientName: client_name || client_email,
    clientEmail: client_email,
    amount,
    currency,
    lineItems: line_items,
    issuedAt,
  });

  const storagePath = `${gate.user.id}/${invoiceId}.pdf`;
  const { error: upErr } = await admin.storage
    .from("crm-invoices")
    .upload(storagePath, pdfBuf, {
      contentType: "application/pdf",
      upsert: true,
    });

  if (upErr) {
    await admin.from("crm_invoices").delete().eq("id", invoiceId);
    return NextResponse.json(
      {
        error: upErr.message,
        hint: "Create a private Storage bucket named crm-invoices in Supabase.",
      },
      { status: 400 }
    );
  }

  await admin
    .from("crm_invoices")
    .update({ pdf_storage_path: storagePath })
    .eq("id", invoiceId);

  let emailResult = { sent: false as boolean, reason: undefined as string | undefined };
  if (sendEmail) {
    const r = await sendInvoiceEmail({
      to: client_email,
      subject: `Invoice ${invoiceNumber}`,
      text: `Please find your invoice ${invoiceNumber} attached.`,
      pdfBase64: pdfBuf.toString("base64"),
      filename: `${invoiceNumber}.pdf`,
    });
    emailResult = { sent: r.sent, reason: "reason" in r ? r.reason : undefined };
    if (r.sent) {
      await admin
        .from("crm_invoices")
        .update({
          status: "sent",
          sent_at: new Date().toISOString(),
        })
        .eq("id", invoiceId);
    }
  }

  return NextResponse.json({
    ok: true,
    id: invoiceId,
    invoice_number: invoiceNumber,
    pdf_storage_path: storagePath,
    email: emailResult,
  });
}
