"use client"

import React, { useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { FaDownload } from 'react-icons/fa';

export default function InvoicePage() {
    const invoiceRef = useRef<HTMLDivElement>(null);

    const handleDownloadPDF = async () => {
        if (!invoiceRef.current) return;

        try {
            const canvas = await html2canvas(invoiceRef.current, {
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff'
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            
            const margin = 5;
            const pageWidth = pdf.internal.pageSize.getWidth();
            const contentWidth = pageWidth - (2 * margin);
            
            const imgWidth = canvas.width;
            const imgHeight = canvas.height;
            const ratio = contentWidth / imgWidth;
            
            const imgScaledWidth = imgWidth * ratio;
            const imgScaledHeight = imgHeight * ratio;
            
            pdf.addImage(imgData, 'PNG', margin, margin, imgScaledWidth, imgScaledHeight);
            pdf.save('Invoice_INV-2025-001.pdf');
        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Error generating PDF. Please try again.');
        }
    };

    const invoiceItems = [
        {
            description: "Database Reconfiguration & Optimization",
            qty: 1,
            rate: 3500,
            amount: 3500
        },
        {
            description: "Domain Name Change & DNS Transfer",
            qty: 1,
            rate: 2000,
            amount: 2000
        },
        {
            description: "Hosting Plan Recharge",
            qty: 1,
            rate: 3500,
            amount: 3500
        },
        {
            description: "Security Hardening & Firewall Setup",
            qty: 1,
            rate: 2000,
            amount: 2000
        },
        {
            description: "Ongoing Maintenance & Monitoring",
            qty: 1,
            rate: 800,
            amount: 800
        }
    ];

    const subtotal = invoiceItems.reduce((sum, item) => sum + item.amount, 0);
    const grandTotal = 11800; // Fixed total as per requirement

    return (
        <div className="min-h-screen bg-gray-100 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Download Button */}
                <div className="mb-6 flex justify-end">
                    <button
                        onClick={handleDownloadPDF}
                        className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors font-semibold shadow-lg"
                    >
                        <FaDownload />
                        <span>Download PDF</span>
                    </button>
                </div>

                {/* Invoice Content */}
                <div
                    ref={invoiceRef}
                    className="bg-white shadow-lg rounded-lg overflow-hidden"
                    style={{ padding: '50px' }}
                >
                    {/* Company Name at Top */}
                    <div className="text-center mb-8 pb-6 border-b-2 border-gray-300">
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">
                            Society Distributor Pvt Ltd
                        </h1>
                        <div className="flex justify-between items-center mt-6 text-sm text-gray-700">
                            <div>
                                <span className="font-semibold">Invoice No:</span>
                                <span className="ml-2">INV-2025-001</span>
                            </div>
                            <div>
                                <span className="font-semibold">Invoice Date:</span>
                                <span className="ml-2">{new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                            </div>
                            <div>
                                <span className="font-semibold">Due Date:</span>
                                <span className="ml-2">
                                    {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Invoice Table */}
                    <div className="mb-8">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-gray-100 border-b-2 border-gray-300">
                                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Description</th>
                                    <th className="text-center py-3 px-4 font-semibold text-gray-900 w-20">Qty</th>
                                    <th className="text-right py-3 px-4 font-semibold text-gray-900 w-32">Rate (₹)</th>
                                    <th className="text-right py-3 px-4 font-semibold text-gray-900 w-32">Amount (₹)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {invoiceItems.map((item, index) => (
                                    <tr key={index} className="border-b border-gray-200">
                                        <td className="py-3 px-4 text-gray-700">{item.description}</td>
                                        <td className="py-3 px-4 text-center text-gray-700">{item.qty}</td>
                                        <td className="py-3 px-4 text-right text-gray-700">{item.rate.toLocaleString('en-IN')}</td>
                                        <td className="py-3 px-4 text-right text-gray-700 font-medium">{item.amount.toLocaleString('en-IN')}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Summary Section */}
                    <div className="flex justify-end mb-8">
                        <div className="w-80">
                            <div className="flex justify-between py-2 border-b border-gray-200">
                                <span className="text-gray-700 font-medium">Subtotal:</span>
                                <span className="text-gray-900 font-semibold">₹{subtotal.toLocaleString('en-IN')}</span>
                            </div>
                            {/* GST Section - Commented as optional */}
                            {/* <div className="flex justify-between py-2 border-b border-gray-200">
                                <span className="text-gray-700 font-medium">GST (18%):</span>
                                <span className="text-gray-900 font-semibold">₹{(subtotal * 0.18).toLocaleString('en-IN')}</span>
                            </div> */}
                            <div className="flex justify-between py-3 mt-2 bg-gray-50 px-4 rounded">
                                <span className="text-gray-900 font-bold text-lg">Grand Total:</span>
                                <span className="text-gray-900 font-bold text-lg">₹{grandTotal.toLocaleString('en-IN')}</span>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="border-t-2 border-gray-300 pt-6">
                        <div className="mb-4">
                            <p className="text-sm font-semibold text-gray-900 mb-2">Payment Method:</p>
                            <p className="text-sm text-gray-700">Bank Transfer / UPI</p>
                        </div>
                        <div className="mt-6 pt-4 border-t border-gray-200">
                            <p className="text-xs text-gray-600 text-center">
                                This is a system-generated invoice. No signature required.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
