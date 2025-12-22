"use client"

import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { FaDownload } from 'react-icons/fa';
import { Space_Grotesk } from 'next/font/google';

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'] });

export default function QuotationPage() {
    const quotationRef = useRef<HTMLDivElement>(null);
    const [clientSignature, setClientSignature] = useState('');
    const [clientName, setClientName] = useState('');
    const [developerSignature, setDeveloperSignature] = useState('');
    const [developerName, setDeveloperName] = useState('');

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
            
            // Set margins to exactly 1cm (10mm) from all sides
            const margin = 10; // 1cm = 10mm
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
            const contentWidth = pageWidth - (2 * margin);
            const contentHeight = pageHeight - (2 * margin);
            
            // Calculate scaling to fit content within margins
            const imgWidth = canvas.width;
            const imgHeight = canvas.height;
            const widthRatio = contentWidth / imgWidth;
            const heightRatio = contentHeight / imgHeight;
            const ratio = Math.min(widthRatio, heightRatio);
            
            const imgScaledWidth = imgWidth * ratio;
            const imgScaledHeight = imgHeight * ratio;
            
            // Center the image within the margins
            const xOffset = margin + (contentWidth - imgScaledWidth) / 2;
            const yOffset = margin + (contentHeight - imgScaledHeight) / 2;

            pdf.addImage(imgData, 'PNG', xOffset, yOffset, imgScaledWidth, imgScaledHeight);
            pdf.save('Smart_School_Management_Project_Proposal.pdf');
        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Error generating PDF. Please try again.');
        }
    };

    const costItems = [
        {
            title: "Website Platform (Next.js + React.js)",
            cost: "₹45,000",
            features: [
                "TypeScript-based scalable codebase",
                "Server-side rendering (SSR) for performance",
                "SEO optimized pages",
                "Responsive dashboard interfaces",
                "Tailwind CSS styling with shadcn/ui components",
                "Student, parent, teacher, and admin portals"
            ]
        },
        {
            title: "Mobile Application (React Native + Expo)",
            cost: "₹40,000",
            features: [
                "Cross-platform iOS & Android app",
                "TypeScript for type safety",
                "NativeWind styling (Tailwind for mobile)",
                "Push notifications (FCM integration)",
                "Offline capability",
                "Student, parent, and teacher mobile access"
            ]
        },
        {
            title: "Backend & Database (Node.js + Supabase)",
            cost: "₹25,000",
            features: [
                "Fastify/Express.js API server",
                "Supabase PostgreSQL database",
                "Real-time data synchronization",
                "Supabase Authentication (multi-role)",
                "Supabase Storage for file management",
                "TanStack Query for optimized data fetching",
                "Zod validation for forms and APIs"
            ]
        },
        {
            title: "Admin & Management Panel",
            cost: "₹10,000",
            features: [
                "Complete system administration",
                "User management (students, parents, teachers)",
                "Academic management (classes, subjects, schedules)",
                "Fee management & payment tracking",
                "Attendance & grade management",
                "Analytics & reporting dashboard"
            ]
        }
    ];

    const additionalCosts = [
        {
            item: "Hosting & Domain (1 years)",
            cost: "₹7,000 - ₹10,000",
            note: "Depending on hosting choice"
        },
        {
            item: "Supabase Database (1 years)",
            cost: "$125 (≈ ₹11,250)",
            note: "Managed PostgreSQL with real-time support"
        },
        {
            item: "Email Service (50,000 emails/month)",
            cost: "$20/month (≈ ₹1,800/month)",
            note: "For notifications and communications"
        },
        {
            item: "SMS Service (50,000 SMS/month)",
            cost: "$50/month (≈ ₹4,500/month)",
            note: "For alerts and reminders"
        },
        {
            item: "Professional Company Email",
            cost: "₹4,000/year",
            note: "Custom domain email accounts"
        },
        {
            item: "App Store Deployment (iOS)",
            cost: "$80 one-time (≈ ₹7,200)",
            note: "Apple App Store registration"
        },
        {
            item: "Play Store Deployment (Android)",
            cost: "$75 one-time (≈ ₹6,750)",
            note: "Google Play Store registration"
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-7xl mx-auto">
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
                            Smart School Management System
                        </h1>
                        <p className="text-lg text-gray-600 italic">
                            Complete Digital School Platform Solution
                        </p>
                    </div>

                    {/* Tech Stack Section */}
                    <div className="mb-10">
                        <h2 className={`text-xl font-bold text-gray-800 mb-4 ${spaceGrotesk.className}`}>
                            Technology Stack
                        </h2>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="font-semibold text-gray-900 mb-2">🌐 Website</h3>
                                <ul className="space-y-1 text-gray-700">
                                    <li>• TypeScript</li>
                                    <li>• React.js</li>
                                    <li>• Next.js (SSR & SEO)</li>
                                    <li>• Tailwind CSS</li>
                                    <li>• shadcn/ui Components</li>
                                    <li>• Supabase (PostgreSQL)</li>
                                    <li>• Supabase Auth & Storage</li>
                                    <li>• Node.js / Fastify / Express.js</li>
                                    <li>• TanStack Query</li>
                                    <li>• Zod Validation</li>
                                </ul>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="font-semibold text-gray-900 mb-2">📱 Mobile App</h3>
                                <ul className="space-y-1 text-gray-700">
                                    <li>• React Native</li>
                                    <li>• Expo Framework</li>
                                    <li>• TypeScript</li>
                                    <li>• NativeWind (Tailwind)</li>
                                    <li>• Supabase Auth</li>
                                    <li>• TanStack Query</li>
                                    <li>• Firebase Cloud Messaging</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Project Title */}
                    <div className="mb-10">
                        <h2 className={`text-2xl font-bold text-gray-800 mb-2 ${spaceGrotesk.className}`}>
                            Project Cost Breakdown
                        </h2>
                        <div className="flex justify-between items-center">
                            <p className="text-gray-600">Total Investment: <span className="font-semibold text-gray-900">₹1,20,000</span></p>
                            <p className="text-gray-600">Project Timeline: <span className="font-semibold text-gray-900">60-75 Days</span></p>
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

                    {/* Exclusions Section */}
                    <div className="mb-8 p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded-r-lg">
                        <h3 className={`text-lg font-semibold text-gray-900 mb-2 ${spaceGrotesk.className}`}>
                            ⚠️ Additional Features (Excluded)
                        </h3>
                        <p className="text-gray-700">
                            <strong>Chat System or Google Classroom like features:</strong> Additional ₹20,000 (if required)i
                        </p>
                    </div>

                    {/* Additional Costs Section */}
                    <div className="mb-8">
                        <h3 className={`text-xl font-bold text-gray-800 mb-4 ${spaceGrotesk.className}`}>
                            Additional Costs (Not Included in Base Price)
                        </h3>
                        <div className="space-y-3">
                            {additionalCosts.map((item, index) => (
                                <div key={index} className="flex justify-between items-start border-b border-gray-200 pb-2">
                                    <div className="flex-1">
                                        <p className="text-gray-900 font-medium">{item.item}</p>
                                        <p className="text-sm text-gray-600">{item.note}</p>
                                    </div>
                                    <span className="text-gray-900 font-semibold ml-4">{item.cost}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Total Section */}
                    <div className="bg-gray-900 text-white p-8 rounded-lg text-center mb-8">
                        <p className="text-lg mb-2 text-gray-300">Total Project Investment</p>
                        <p className={`text-5xl font-bold mb-4 ${spaceGrotesk.className}`}>₹1,20,000</p>
                        <p className="text-lg text-gray-300">Estimated Delivery Time: <span className="font-semibold text-white">60-75 Days</span></p>
                        <p className="text-sm text-gray-400 mt-2">* Additional costs listed above are separate and recurring</p>
                    </div>

                    {/* Signature Section */}
                    <div className="border-t-2 border-gray-300 pt-8 mb-8">
                        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                            <p className="text-xs text-gray-600 text-center">
                                By signing this document, both parties agree to the terms, conditions, and pricing outlined in this quotation. 
                                This document serves as a legally binding agreement upon signature by both parties.
                            </p>
                        </div>
                        <div className="flex justify-between items-start mt-8">
                            {/* Client Signature - Bottom Left */}
                            <div className="w-[45%]">
                                <div className="mb-4">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Client Name:
                                    </label>
                                    <input
                                        type="text"
                                        value={clientName}
                                        onChange={(e) => setClientName(e.target.value)}
                                        className="w-full border-b-2 border-gray-300 focus:border-gray-900 outline-none pb-2"
                                       
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Client Signature:
                                    </label>
                                    <input
                                        type="text"
                                        value={clientSignature}
                                        onChange={(e) => setClientSignature(e.target.value)}
                                        className="w-full border-b-2 border-gray-300 focus:border-gray-900 outline-none pb-2"
                                
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Date:
                                    </label>
                               
                                </div>
                            </div>
                            {/* Developer Signature - Bottom Right */}
                            <div className="w-[45%] text-right">
                                <div className="mb-4">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2 ml-4">
                                        Developer/Company Name:
                                    </label>
                                    <input
                                        type="text"
                                        value={developerName}
                                        onChange={(e) => setDeveloperName(e.target.value)}
                                        className="w-full border-b-2 border-gray-300 focus:border-gray-900 outline-none pb-2"
                                    
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Developer Signature:
                                    </label>
                                    <input
                                        type="text"
                                        value={developerSignature}
                                        onChange={(e) => setDeveloperSignature(e.target.value)}
                                        className="w-full border-b-2 border-gray-300 focus:border-gray-900 outline-none pb-2"
                               
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Date:
                                    </label>
                                   
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="border-t border-gray-200 pt-6 text-center text-sm text-gray-600">
                        <p className="font-semibold mb-2">Terms & Conditions:</p>
                        <p>• This proposal is valid for 30 days from the date of issue.</p>
                        <p>• All features and costs are subject to final project requirements discussion.</p>
                        <p>• Payment terms: 20% advance, 40% on milestone completion, 40% on final delivery.</p>
                        <p>• Additional features beyond scope will be charged separately.</p>
                        <p className="mt-4 text-xs">This is a legally binding document when signed by both parties.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
