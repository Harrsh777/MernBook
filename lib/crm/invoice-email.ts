export async function sendInvoiceEmail(params: {
  to: string;
  subject: string;
  text: string;
  pdfBase64: string;
  filename: string;
}) {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM;
  if (!key || !from) {
    return { sent: false as const, reason: "missing_resend_config" };
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [params.to],
      subject: params.subject,
      text: params.text,
      attachments: [
        { filename: params.filename, content: params.pdfBase64 },
      ],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("Resend invoice error", err);
    return { sent: false as const, reason: err };
  }

  return { sent: true as const };
}
