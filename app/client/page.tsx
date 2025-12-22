'use client';

import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { CheckCircle2, Circle, TrendingUp, Users, DollarSign } from 'lucide-react';

// Static data
const projectStages = [
    { name: 'Auth System', completed: true },
    { name: 'School Dashboard', completed: false },
    { name: 'Parent Dashboard', completed: false },
    { name: 'Admin Panel', completed: false },
    { name: 'Notifications System', completed: false },
    { name: 'Finance Module', completed: false },
];

const websiteData = [
    { name: 'Received', value: 4000, color: '#10b981' },
    { name: 'Pending', value: 51000, color: '#e5e7eb' },
];

const appData = [
    { name: 'Received', value: 0, color: '#10b981' },
    { name: 'Pending', value: 55000, color: '#e5e7eb' },
];

const teamPayouts = [
    { name: 'Harsh', total: 60000, received: 1500, color: '#3b82f6' },
    { name: 'Arushi', total: 25000, received: 1250, color: '#8b5cf6' },
    { name: 'Shreyansh', total: 25000, received: 1250, color: '#ec4899' },
];

// Custom label for pie charts
interface LabelProps {
    cx: number;
    cy: number;
    midAngle: number;
    innerRadius: number;
    outerRadius: number;
    percent: number;
}

const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: LabelProps) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text
            x={x}
            y={y}
            fill="white"
            textAnchor={x > cx ? 'start' : 'end'}
            dominantBaseline="central"
            className="text-xs font-semibold"
        >
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
};


export default function ERPClientDashboard() {
    const completedCount = projectStages.filter((stage) => stage.completed).length;
    const totalStages = projectStages.length;
    const progressPercentage = (completedCount / totalStages) * 100;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-4 tracking-tight">
                        ERP System
                    </h1>
                    <p className="text-xl md:text-2xl text-slate-600 mb-8">
                        Currently in Stage 1
                    </p>

                    {/* Progress Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 md:p-8 max-w-4xl mx-auto hover:shadow-xl transition-shadow"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-semibold text-slate-900">Project Progress</h2>
                            <span className="text-sm font-medium text-slate-600">
                                {completedCount} of {totalStages} completed
                            </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full bg-slate-200 rounded-full h-3 mb-6 overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${progressPercentage}%` }}
                                transition={{ duration: 1, ease: 'easeOut' }}
                                className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
                            />
                        </div>

                        {/* Stages Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {projectStages.map((stage, index) => (
                                <motion.div
                                    key={stage.name}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 + index * 0.1 }}
                                    className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                                        stage.completed
                                            ? 'bg-green-50 border border-green-200'
                                            : 'bg-slate-50 border border-slate-200'
                                    }`}
                                >
                                    {stage.completed ? (
                                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                                    ) : (
                                        <Circle className="w-5 h-5 text-slate-400 flex-shrink-0" />
                                    )}
                                    <span
                                        className={`text-sm font-medium ${
                                            stage.completed ? 'text-green-900' : 'text-slate-600'
                                        }`}
                                    >
                                        {stage.name}
                                    </span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </motion.div>

                {/* Finances Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mb-12"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <DollarSign className="w-6 h-6 text-slate-700" />
                        <h2 className="text-3xl font-bold text-slate-900">Finances</h2>
                    </div>

                    {/* Summary Card */}
                    <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl shadow-lg border border-blue-200 p-6 md:p-8 mb-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-600 mb-2">Total Project Amount</p>
                                <p className="text-4xl md:text-5xl font-bold text-slate-900">
                                    ₹1,10,000
                                </p>
                            </div>
                            <div className="hidden md:block">
                                <TrendingUp className="w-16 h-16 text-blue-600 opacity-50" />
                            </div>
                        </div>
                    </div>

                    {/* Payment Breakdown - Row 1 */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        {/* Website Pie Chart */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.4 }}
                            className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-shadow"
                        >
                            <h3 className="text-xl font-semibold text-slate-900 mb-6 text-center">
                                Website
                            </h3>
                            <div className="relative">
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={websiteData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={renderCustomLabel}
                                            outerRadius={100}
                                            fill="#8884d8"
                                            dataKey="value"
                                            animationBegin={0}
                                            animationDuration={1000}
                                        >
                                            {websiteData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            formatter={(value: number) => `₹${value.toLocaleString('en-IN')}`}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                    <p className="text-2xl font-bold text-slate-900">Website</p>
                                </div>
                            </div>
                            <div className="mt-6 space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-600">Total Amount:</span>
                                    <span className="font-semibold text-slate-900">₹55,000</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-600">Amount Received:</span>
                                    <span className="font-semibold text-green-600">₹4,000</span>
                                </div>
                                <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                                    <span className="text-slate-600">Remaining:</span>
                                    <span className="font-semibold text-slate-700">₹51,000</span>
                                </div>
                            </div>
                        </motion.div>

                        {/* App Pie Chart */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.5 }}
                            className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-shadow"
                        >
                            <h3 className="text-xl font-semibold text-slate-900 mb-6 text-center">
                                App
                            </h3>
                            <div className="relative">
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={appData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={renderCustomLabel}
                                            outerRadius={100}
                                            fill="#8884d8"
                                            dataKey="value"
                                            animationBegin={0}
                                            animationDuration={1000}
                                        >
                                            {appData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            formatter={(value: number) => `₹${value.toLocaleString('en-IN')}`}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                    <p className="text-2xl font-bold text-slate-900">App</p>
                                </div>
                            </div>
                            <div className="mt-6 space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-600">Total Amount:</span>
                                    <span className="font-semibold text-slate-900">₹55,000</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-600">Amount Received:</span>
                                    <span className="font-semibold text-green-600">₹0</span>
                                </div>
                                <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                                    <span className="text-slate-600">Remaining:</span>
                                    <span className="font-semibold text-slate-700">₹55,000</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Team Payout Distribution - Row 2 */}
                    <div className="mb-6">
                        <div className="flex items-center gap-3 mb-6">
                            <Users className="w-5 h-5 text-slate-700" />
                            <h3 className="text-2xl font-bold text-slate-900">Team Payout Distribution</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {teamPayouts.map((member, index) => {
                                const remaining = member.total - member.received;
                                const memberData = [
                                    { name: 'Received', value: member.received, color: member.color },
                                    {
                                        name: 'Remaining',
                                        value: Math.max(0, remaining),
                                        color: '#e5e7eb',
                                    },
                                ];

                                return (
                                    <motion.div
                                        key={member.name}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.6 + index * 0.1 }}
                                        className="bg-white rounded-xl shadow-md border border-slate-200 p-6 hover:shadow-lg hover:scale-105 transition-all"
                                    >
                                        <h4 className="text-lg font-semibold text-slate-900 mb-4 text-center">
                                            {member.name}
                                        </h4>
                                        <div className="relative mb-4">
                                            <ResponsiveContainer width="100%" height={200}>
                                                <PieChart>
                                                    <Pie
                                                        data={memberData}
                                                        cx="50%"
                                                        cy="50%"
                                                        labelLine={false}
                                                        label={renderCustomLabel}
                                                        outerRadius={70}
                                                        fill="#8884d8"
                                                        dataKey="value"
                                                        animationBegin={0}
                                                        animationDuration={1000}
                                                    >
                                                        {memberData.map((entry, idx) => (
                                                            <Cell key={`cell-${idx}`} fill={entry.color} />
                                                        ))}
                                                    </Pie>
                                                    <Tooltip
                                                        formatter={(value: number) =>
                                                            `₹${value.toLocaleString('en-IN')}`
                                                        }
                                                    />
                                                </PieChart>
                                            </ResponsiveContainer>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center">
                                                <span className="text-slate-600 text-sm">Total Amount:</span>
                                                <span className="font-semibold text-slate-900">
                                                    ₹{member.total.toLocaleString('en-IN')}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-slate-600 text-sm">Amount Received:</span>
                                                <span className="font-semibold text-green-600">
                                                    ₹{member.received.toLocaleString('en-IN')}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                                                <span className="text-slate-600 text-sm">Remaining:</span>
                                                <span className="font-semibold text-slate-700">
                                                    ₹{remaining.toLocaleString('en-IN')}
                                                </span>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

