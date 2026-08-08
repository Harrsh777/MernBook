import { jsPDF } from "jspdf";

export function buildInvoicePdf(params: {
  invoiceNumber: string;
  clientName: string;
  clientEmail: string;
  amount: number;
  currency: string;
  lineItems: { description: string; amount: number }[];
  issuedAt: string;
}) {
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text("Invoice", 14, 22);
  doc.setFontSize(10);
  doc.text(`# ${params.invoiceNumber}`, 14, 30);
  doc.text(`Date: ${params.issuedAt}`, 14, 36);
  doc.text(`Bill to: ${params.clientName}`, 14, 46);
  doc.text(params.clientEmail, 14, 52);

  let y = 64;
  doc.setFontSize(11);
  doc.text("Description", 14, y);
  doc.text("Amount", 150, y);
  y += 8;
  doc.setFontSize(10);
  for (const line of params.lineItems) {
    doc.text(line.description.slice(0, 60), 14, y);
    doc.text(String(line.amount), 150, y);
    y += 7;
    if (y > 270) {
      doc.addPage();
      y = 20;
    }
  }
  y += 6;
  doc.setFontSize(12);
  doc.text(
    `Total: ${params.currency} ${params.amount.toLocaleString("en-IN")}`,
    14,
    y
  );

  return Buffer.from(doc.output("arraybuffer"));
}
