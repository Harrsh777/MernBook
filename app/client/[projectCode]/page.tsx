'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import PaymentProgressChart from '@/app/components/PaymentProgressChart';
import MediaGallery from '@/app/components/MediaGallery';

interface ClientData {
    id: string;
    projectCode: string;
    clientName: string;
    projectName: string;
    totalProjectAmount: number;
    amountPaid: number;
    projectStatus: string;
    createdAt: string;
}

interface Update {
    id: string;
    title: string;
    description: string;
    links: string[];
    created_at: string;
}

interface MediaItem {
    id: string;
    image_url: string;
    image_name?: string;
    uploaded_at: string;
}

export default function ClientDashboardPage() {
    const params = useParams();
    const router = useRouter();
    const projectCode = params.projectCode as string;

    const [clientData, setClientData] = useState<ClientData | null>(null);
    const [updates, setUpdates] = useState<Update[]>([]);
    const [media, setMedia] = useState<MediaItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchClientData = React.useCallback(async () => {
        try {
            const response = await fetch(`/api/client/${projectCode}`);
            const data = await response.json();

            if (!response.ok) {
                setError(data.error || 'Failed to fetch data');
                setLoading(false);
                return;
            }

            setClientData(data.client);
            setUpdates(data.updates || []);
            setMedia(data.media || []);
            setLoading(false);
        } catch {
            setError('An error occurred while fetching data');
            setLoading(false);
        }
    }, [projectCode]);

    useEffect(() => {
        // Check if user is authenticated
        const storedProjectCode = sessionStorage.getItem('projectCode');
        if (!storedProjectCode || storedProjectCode !== projectCode) {
            router.push('/client/login');
            return;
        }

        fetchClientData();
        // Refresh data every 30 seconds
        const interval = setInterval(fetchClientData, 30000);
        return () => clearInterval(interval);
    }, [projectCode, router, fetchClientData]);

    const handleLogout = () => {
        sessionStorage.removeItem('projectCode');
        sessionStorage.removeItem('clientName');
        router.push('/client/login');
    };

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            Planning: 'bg-blue-100 text-blue-800',
            Development: 'bg-purple-100 text-purple-800',
            Testing: 'bg-amber-100 text-amber-800',
            Delivered: 'bg-green-100 text-green-800',
        };
        return colors[status] || 'bg-slate-100 text-slate-800';
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 mx-auto mb-4"></div>
                    <p className="text-slate-600">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    if (error || !clientData) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200 text-center max-w-md">
                    <div className="text-red-500 mb-4">
                        <svg
                            className="w-16 h-16 mx-auto"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 mb-2">
                        Error Loading Dashboard
                    </h2>
                    <p className="text-slate-600 mb-6">{error || 'Client not found'}</p>
                    <button
                        onClick={() => router.push('/client/login')}
                        className="bg-slate-900 text-white px-6 py-2 rounded-lg hover:bg-slate-800 transition-colors"
                    >
                        Return to Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div>
                            <h1 className="text-xl font-bold text-slate-900">
                                {clientData.clientName}
                            </h1>
                            <p className="text-sm text-slate-600">{clientData.projectName}</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="text-slate-600 hover:text-slate-900 text-sm font-medium transition-colors"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Project Overview & Payment */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Project Overview */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-xl p-6 shadow-sm border border-slate-200"
                        >
                            <h2 className="text-lg font-semibold text-slate-900 mb-6">
                                Project Overview
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <p className="text-sm text-slate-600 mb-1">Client Name</p>
                                    <p className="text-base font-medium text-slate-900">
                                        {clientData.clientName}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-600 mb-1">Project Name</p>
                                    <p className="text-base font-medium text-slate-900">
                                        {clientData.projectName}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-600 mb-1">Project Code</p>
                                    <p className="text-base font-medium text-slate-900 font-mono">
                                        {clientData.projectCode}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-600 mb-1">Status</p>
                                    <span
                                        className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                            clientData.projectStatus
                                        )}`}
                                    >
                                        {clientData.projectStatus}
                                    </span>
                                </div>
                            </div>
                        </motion.div>

                        {/* Payment Chart */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <PaymentProgressChart
                                totalAmount={clientData.totalProjectAmount}
                                amountPaid={clientData.amountPaid}
                            />
                        </motion.div>

                        {/* Updates & Notes */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white rounded-xl p-6 shadow-sm border border-slate-200"
                        >
                            <h2 className="text-lg font-semibold text-slate-900 mb-6">
                                Updates & Notes
                            </h2>
                            {updates.length === 0 ? (
                                <div className="text-center py-8">
                                    <p className="text-slate-500">No updates yet</p>
                                    <p className="text-slate-400 text-sm mt-1">
                                        Your project manager will post updates here
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {updates.map((update, index) => (
                                        <motion.div
                                            key={update.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.3 + index * 0.1 }}
                                            className="border-l-4 border-slate-900 pl-4 py-2"
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="font-semibold text-slate-900">
                                                    {update.title}
                                                </h3>
                                                <span className="text-xs text-slate-500">
                                                    {new Date(update.created_at).toLocaleDateString(
                                                        'en-US',
                                                        {
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: 'numeric',
                                                        }
                                                    )}
                                                </span>
                                            </div>
                                            <p className="text-slate-600 text-sm mb-3 whitespace-pre-line">
                                                {update.description}
                                            </p>
                                            {update.links && update.links.length > 0 && (
                                                <div className="flex flex-wrap gap-2 mt-3">
                                                    {update.links.map((link, linkIndex) => (
                                                        <a
                                                            key={linkIndex}
                                                            href={link}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1 rounded-md transition-colors inline-flex items-center gap-1"
                                                        >
                                                            <svg
                                                                className="w-3 h-3"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth={2}
                                                                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                                                />
                                                            </svg>
                                                            View Link
                                                        </a>
                                                    ))}
                                                </div>
                                            )}
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    </div>

                    {/* Right Column - Media Gallery */}
                    <div className="lg:col-span-1">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <MediaGallery media={media} />
                        </motion.div>
                    </div>
                </div>
            </main>
        </div>
    );
}

