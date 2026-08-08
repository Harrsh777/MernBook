/**
 * Optional Resend integration. Set RESEND_API_KEY and RESEND_FROM (e.g. onboarding@yourdomain.com).
 */
export async function sendClientDashboardReadyEmail(params: {
  to: string;
  clientName: string;
  loginEmail: string;
  temporaryPassword?: string;
  appUrl: string;
}) {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM;
  if (!key || !from) {
    return { sent: false as const, reason: "missing_resend_config" };
  }

  const loginUrl = `${params.appUrl.replace(/\/$/, "")}/auth/login`;
  const bodyText = [
    `Hi ${params.clientName},`,
    "",
    "Your client dashboard is ready.",
    "",
    `Sign in: ${loginUrl}`,
    `Email: ${params.loginEmail}`,
    params.temporaryPassword
      ? `Temporary password: ${params.temporaryPassword}`
      : "Use the magic link from your invite (or reset password on the login page).",
    "",
    "— Your team",
  ].join("\n");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [params.to],
      subject: "Your dashboard is ready",
      text: bodyText,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("Resend error", err);
    return { sent: false as const, reason: err };
  }

  return { sent: true as const };
}
