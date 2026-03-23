"use client";

import React, { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { FaDownload } from "react-icons/fa";

const breakdown = [
  {
    title: "1. Customer App + Website",
    items: [
      "User registration & login",
      "Product listing & search",
      "Cart & checkout",
    
    ],
    amount: 52000,
  },
  {
    title: "2. Vendor App / Panel",
    items: [
      "Vendor onboarding",
      "Product & inventory management",
    
    ],
    amount: 38000,
  },
  {
    title: "3. Delivery Partner App",
    items: [
      "Delivery partner onboarding",
      "Order assignment",
      "Live order status",
      "Earnings & payout tracking",
    ],
    amount: 26000,
  },
  {
    title: "4. Admin Panel",
    items: [
      "Full system control",
      "Commission management",
      
    ],
    amount: 22000,
  },
  {
    title: "5. Backend + API + Database",
    items: [
      "Secure backend",
      "API development",
      "Database setup",
      
    ],
    amount: 10000,
  },
  {
    title: "6. iOS & App Store Deployment",
    items: [
      "Apple Developer account setup",
      "App Store submission & listing",
      "iOS build configuration",
      "Store compliance & review support",
    ],
    amount: 12000,
  },
];

const TOTAL = breakdown.reduce((s, b) => s + b.amount, 0);
const TIMELINE = "50-60 Days";

const ISSUE_DATE = new Date().toLocaleDateString("en-IN", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

const QUOTE_ID = `FMW-${Math.floor(1000 + Math.random() * 9000)}`;

export default function BudgetPage() {
  const invoiceRef = useRef<HTMLDivElement>(null);

  const handleDownloadPDF = async () => {
    if (!invoiceRef.current) return;

    const canvas = await html2canvas(invoiceRef.current, {
      scale: 3,
      useCORS: true,
      backgroundColor: "#ffffff",
    });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const imgProps = pdf.getImageProperties(imgData);

    const imgWidth = pdfWidth - 10;
    const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

    const y = (pdfHeight - imgHeight) / 2;

    pdf.addImage(imgData, "PNG", 5, y > 0 ? y : 5, imgWidth, imgHeight);

    pdf.save("FreshMeatWala_Project_Quotation.pdf");
  };

  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4 flex flex-col items-center">
      
      {/* Download */}
      <div className="mb-6 w-full max-w-[210mm] flex justify-end">
        <button
          onClick={handleDownloadPDF}
          className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-lg hover:bg-black transition font-semibold shadow"
        >
          <FaDownload />
          Download PDF
        </button>
      </div>

      {/* Invoice */}
      <div
        ref={invoiceRef}
        className="bg-white shadow-xl rounded-lg overflow-hidden w-full max-w-[210mm]"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#6b0f1a] to-[#3b0a0f] text-white px-8 py-8 text-center">
          <h1 className="text-3xl font-bold">Fresh Meat Wala</h1>

          <p className="text-sm mt-2 opacity-90">
            Complete E-Commerce Platform Solution
          </p>

          <p className="text-xs mt-2 opacity-80">
            Project Cost Breakdown
          </p>

          <div className="text-xs mt-3 space-y-1 opacity-80">
            <p>Date of Issue: {ISSUE_DATE}</p>
            <p>Quote ID: {QUOTE_ID}</p>
          </div>
        </div>

        {/* Summary */}
        <div className="px-8 py-4 bg-slate-50 border-b flex justify-between">
          <div>
            <span className="text-slate-500 text-xs uppercase">
              Total Investment
            </span>
            <p className="text-2xl font-bold text-black mt-1">
              ₹{TOTAL.toLocaleString("en-IN")}
            </p>
          </div>

          <div className="text-right">
            <span className="text-slate-500 text-xs uppercase">
              Estimated Delivery
            </span>
            <p className="text-lg font-semibold text-black mt-1">
              {TIMELINE}
            </p>
          </div>
        </div>

        {/* Breakdown */}
        <div className="px-8 py-5 space-y-4">
          {breakdown.map((section, i) => (
            <div
              key={i}
              className="flex justify-between border-b border-slate-100 pb-3"
            >
              <div>
                <h3 className="text-sm font-semibold text-slate-800 mb-2">
                  {section.title}
                </h3>

                <ul className="text-xs text-slate-600 space-y-1">
                  {section.items.map((item, j) => (
                    <li key={j}>• {item}</li>
                  ))}
                </ul>
              </div>

              <div className="text-right">
                <span className="text-base font-bold text-black">
                  ₹{section.amount.toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="px-8 py-5 bg-slate-900 text-white">
          <div className="flex justify-between">
            <span className="text-sm uppercase opacity-80">
              Total Project Investment
            </span>

            <span className="text-2xl font-bold">
              ₹{TOTAL.toLocaleString("en-IN")}
            </span>
          </div>

          <p className="text-xs opacity-70 mt-2">
            Estimated delivery timeline: {TIMELINE}
          </p>
        </div>

        {/* Footer */}
        <div className="px-8 py-3 border-t text-center">
          <p className="text-slate-400 text-[10px]">
            This document represents an official quotation for the Fresh Meat Wala platform development.
          </p>
        </div>
      </div>
    </div>
  );
}