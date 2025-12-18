"use client"

import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { FaDownload, FaFilePdf } from 'react-icons/fa';
import { Space_Grotesk } from 'next/font/google';

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'] });

export default function QuotationPage() {
    const quotationRef = useRef<HTMLDivElement>(null);

    const handleDownloadPDF = async () => {
        if (!quotationRef.current) return;

        try {
            const canvas = await html2canvas(quotationRef.current, {
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff'
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const imgWidth = canvas.width;
            const imgHeight = canvas.height;
            const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
            const imgScaledWidth = imgWidth * ratio;
            const imgScaledHeight = imgHeight * ratio;
            const xOffset = (pdfWidth - imgScaledWidth) / 2;
            const yOffset = (pdfHeight - imgScaledHeight) / 2;

            pdf.addImage(imgData, 'PNG', xOffset, yOffset, imgScaledWidth, imgScaledHeight);
            pdf.save('FreshMeatWala_Project_Proposal.pdf');
        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Error generating PDF. Please try again.');
        }
    };

    const costItems = [
        {
            title: "Customer App + Website",
            cost: "₹35,000",
            features: [
                "User registration & login",
                "Product listing & search",
                "Cart & checkout",
                "Payment integration",
                "Order tracking",
                "Rating & reviews"
            ]
        },
        {
            title: "Vendor App / Panel",
            cost: "₹25,000",
            features: [
                "Vendor onboarding",
                "Product & inventory management",
                "Order handling",
                "Earnings dashboard"
            ]
        },
        {
            title: "Delivery Partner App",
            cost: "₹18,000",
            features: [
                "Delivery partner onboarding",
                "Order assignment",
                "Live order status",
                "Earnings & payout tracking"
            ]
        },
        {
            title: "Admin Panel",
            cost: "₹15,000",
            features: [
                "Full system control",
                "Commission management",
                "Order & user monitoring",
                "Analytics dashboard"
            ]
        },
        {
            title: "Backend + API + Database",
            cost: "₹7,000",
            features: [
                "Secure backend",
                "API development",
                "Database setup",
                "Performance optimization"
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Download Button - Fixed Position */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 flex justify-end"
                >
                    <button
                        onClick={handleDownloadPDF}
                        className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors font-semibold shadow-lg"
                    >
                        <FaDownload />
                        <span>Download PDF</span>
                    </button>
                </motion.div>

                {/* Quotation Content */}
                <div
                    ref={quotationRef}
                    className="bg-white shadow-lg rounded-lg overflow-hidden"
                    style={{ padding: '60px' }}
                >
                    {/* Header */}
                    <div className="text-center mb-12 pb-8 border-b-2 border-gray-200">
                        <h1 className={`text-4xl font-bold text-gray-900 mb-3 ${spaceGrotesk.className}`}>
                            FreshMeatWala
                        </h1>
                        <p className="text-lg text-gray-600 italic">
                            Complete E-Commerce Platform Solution
                        </p>
                    </div>

                    {/* Project Title */}
                    <div className="mb-10">
                        <h2 className={`text-2xl font-bold text-gray-800 mb-2 ${spaceGrotesk.className}`}>
                            Project Cost Breakdown
                        </h2>
                        <div className="flex justify-between items-center">
                            <p className="text-gray-600">Total Investment: <span className="font-semibold text-gray-900">₹1,00,000</span></p>
                            <p className="text-gray-600">Project Timeline: <span className="font-semibold text-gray-900">50-60 Days</span></p>
                        </div>
                    </div>

                    {/* Cost Items */}
                    <div className="space-y-6 mb-10">
                        {costItems.map((item, index) => (
                            <div
                                key={index}
                                className="border-l-4 border-gray-800 pl-6 py-4 bg-gray-50 rounded-r-lg"
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <h3 className={`text-xl font-semibold text-gray-900 ${spaceGrotesk.className}`}>
                                        {index + 1}. {item.title}
                                    </h3>
                                    <span className={`text-xl font-bold text-gray-900 ${spaceGrotesk.className}`}>
                                        {item.cost}
                                    </span>
                                </div>
                                <ul className="space-y-2 mt-3">
                                    {item.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-start text-gray-700">
                                            <span className="text-gray-800 mr-2">•</span>
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    {/* Total Section */}
                    <div className="bg-gray-900 text-white p-8 rounded-lg text-center mb-8">
                        <p className="text-lg mb-2 text-gray-300">Total Project Investment</p>
                        <p className={`text-5xl font-bold mb-4 ${spaceGrotesk.className}`}>₹1,00,000</p>
                        <p className="text-lg text-gray-300">Estimated Delivery Time: <span className="font-semibold text-white">50-60 Days</span></p>
                    </div>

                    {/* Footer */}
                    <div className="border-t border-gray-200 pt-6 text-center text-sm text-gray-600">
                        <p>This proposal is valid for 30 days from the date of issue.</p>
                        <p className="mt-1">All features and costs are subject to final project requirements discussion.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
