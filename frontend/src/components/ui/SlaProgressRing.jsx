import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function SlaProgressRing({ dueAt, status, size = 60, stroke = 4 }) {
    const [timeLeft, setTimeLeft] = useState(0);
    const [totalDuration, setTotalDuration] = useState(24 * 60 * 60 * 1000); // Default benchmark

    // Calculate color based on status/time
    const getColor = () => {
        if (status === 'BREACHED') return '#ef4444'; // Red
        if (status === 'AT_RISK') return '#f59e0b'; // Amber
        if (status === 'RESOLVED') return '#10b981'; // Green (Success)
        return '#3b82f6'; // Blue (Normal)
    };

    const color = getColor();
    const radius = size / 2 - stroke * 2;
    const circumference = radius * 2 * Math.PI;

    const now = new Date().getTime();
    const due = dueAt ? new Date(dueAt).getTime() : now + 86400000; // fallback to +24h if no SLA
    const diff = due - now;

    // Visual Percentage
    let percent = 100;
    if (status === 'RESOLVED') percent = 100;
    else if (status === 'BREACHED') percent = 100; // Full circle but RED
    else {
        // Dynamic countdown simulation
        // Assume max timer is 48hrs for visualization scaling
        const maxTime = 48 * 60 * 60 * 1000;
        percent = Math.max(0, Math.min(100, (diff / maxTime) * 100));
    }

    const strokeDashoffset = circumference - (percent / 100) * circumference;

    return (
        <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
            <svg
                width={size}
                height={size}
                viewBox={`0 0 ${size} ${size}`}
                className="rotate-[-90deg]"
            >
                {/* Background Ring */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="transparent"
                    stroke="currentColor"
                    strokeWidth={stroke}
                    className="text-slate-100 dark:text-slate-700"
                />
                {/* Progress Ring */}
                <motion.circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="transparent"
                    stroke={color}
                    strokeWidth={stroke}
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: status === 'BREACHED' ? 0 : strokeDashoffset }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    strokeLinecap="round"
                />
            </svg>
            <div className="absolute flex flex-col items-center">
                {status === 'BREACHED' ? (
                    <span className="text-[10px] font-bold text-red-500">EXPIRED</span>
                ) : status === 'RESOLVED' ? (
                    <span className="text-[10px] font-bold text-green-500">DONE</span>
                ) : (
                    <div className="text-center">
                        <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">
                            {diff > 86400000 ? Math.ceil(diff / 86400000) + 'd' : Math.ceil(diff / 3600000) + 'h'}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}
