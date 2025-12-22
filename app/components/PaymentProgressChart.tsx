'use client';

import { useEffect, useRef } from 'react';

interface PaymentProgressChartProps {
    totalAmount: number;
    amountPaid: number;
}

export default function PaymentProgressChart({
    totalAmount,
    amountPaid,
}: PaymentProgressChartProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const percentage = totalAmount > 0 ? (amountPaid / totalAmount) * 100 : 0;
    const remaining = totalAmount - amountPaid;

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const size = 200;
        const centerX = size / 2;
        const centerY = size / 2;
        const radius = 80;
        const lineWidth = 16;

        canvas.width = size;
        canvas.height = size;

        // Clear canvas
        ctx.clearRect(0, 0, size, size);

        // Background circle
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = lineWidth;
        ctx.stroke();

        // Progress circle
        ctx.beginPath();
        ctx.arc(
            centerX,
            centerY,
            radius,
            -Math.PI / 2,
            -Math.PI / 2 + (2 * Math.PI * percentage) / 100
        );
        ctx.strokeStyle = percentage === 100 ? '#10b981' : '#3b82f6';
        ctx.lineWidth = lineWidth;
        ctx.lineCap = 'round';
        ctx.stroke();

        // Center text
        ctx.fillStyle = '#1e293b';
        ctx.font = 'bold 24px system-ui';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${Math.round(percentage)}%`, centerX, centerY - 5);

        ctx.fillStyle = '#64748b';
        ctx.font = '12px system-ui';
        ctx.fillText('Complete', centerX, centerY + 15);
    }, [percentage]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900 mb-6">
                Payment Overview
            </h3>

            <div className="flex flex-col items-center">
                {/* Circular Chart */}
                <div className="mb-8">
                    <canvas ref={canvasRef} className="drop-shadow-sm" />
                </div>

                {/* Breakdown */}
                <div className="w-full space-y-4">
                    <div className="flex justify-between items-center p-4 bg-slate-50 rounded-lg">
                        <span className="text-slate-600 font-medium">Total Amount</span>
                        <span className="text-slate-900 font-bold text-lg">
                            {formatCurrency(totalAmount)}
                        </span>
                    </div>

                    <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                        <span className="text-blue-700 font-medium">Amount Paid</span>
                        <span className="text-blue-900 font-bold text-lg">
                            {formatCurrency(amountPaid)}
                        </span>
                    </div>

                    <div className="flex justify-between items-center p-4 bg-amber-50 rounded-lg">
                        <span className="text-amber-700 font-medium">Remaining</span>
                        <span className="text-amber-900 font-bold text-lg">
                            {formatCurrency(remaining)}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

