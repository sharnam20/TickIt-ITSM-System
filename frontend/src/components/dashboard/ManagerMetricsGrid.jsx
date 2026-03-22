import { motion } from 'framer-motion';
import { AreaChart, Area, ResponsiveContainer, BarChart, Bar, LineChart, Line, XAxis, Tooltip } from 'recharts';
import { TrendingUp, AlertTriangle, ShieldCheck, Clock, Users, Database } from 'lucide-react';

const Card = ({ title, value, subtext, icon: Icon, trend, color, data }) => (
    <div className={`p-6 rounded-xl border border-slate-800 bg-[#0B1120] relative overflow-hidden group hover:border-slate-700 transition-all shadow-sm`}>
        <div className="flex justify-between items-start mb-4">
            <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{title}</p>
                <h3 className="text-3xl font-extrabold text-white mt-1 group-hover:scale-105 transition-transform origin-left">{value}</h3>
            </div>
            <div className={`p-2 rounded-lg bg-${color}-500/10 text-${color}-400`}>
                <Icon className="w-5 h-5" />
            </div>
        </div>

        {/* Micro Chart - Fixed Height for Stability */}
        <div className="h-10 w-full mb-2 opacity-50 group-hover:opacity-100 transition-opacity flex items-end">
            <AreaChart width={200} height={40} data={data || [{ v: 10 }, { v: 15 }, { v: 12 }, { v: 20 }, { v: 18 }, { v: 24 }, { v: 22 }]}>
                <Area
                    type="monotone"
                    dataKey="v"
                    stroke={color === 'red' ? '#EF4444' : color === 'emerald' ? '#10B981' : '#3B82F6'}
                    fill="transparent"
                    strokeWidth={2}
                />
            </AreaChart>
        </div>

        <div className="flex items-center justify-between mt-auto">
            <span className={`text-xs font-bold ${trend > 0 ? 'text-green-400' : 'text-slate-500'}`}>
                {trend > 0 ? '+' : ''}{trend}% vs last week
            </span>
            <span className="text-[10px] text-slate-500">{subtext}</span>
        </div>
    </div>
);

export default function ManagerMetricsGrid({ stats }) {
    // Fallback data if stats missing
    const summary = stats?.summary || { total: 0, open: 0, sla_breached: 0, resolved: 0 };
    const trends = stats?.trends || [];

    const slaCompliance = summary.total > 0
        ? Math.round(((summary.total - summary.sla_breached) / summary.total) * 100)
        : 100;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card
                title="Total Volume"
                value={summary.total.toLocaleString()}
                subtext="All Time"
                icon={Database}
                color="indigo"
                trend={12}
                data={trends.map(t => ({ v: t.count }))}
            />
            <Card
                title="Active Incidents"
                value={summary.open.toLocaleString()}
                subtext="Action Required"
                icon={TrendingUp}
                color="blue"
                trend={-5}
            />
            <Card
                title="SLA Compliance"
                value={`${slaCompliance}%`}
                subtext="Target: 95%"
                icon={ShieldCheck}
                color={slaCompliance < 90 ? 'red' : 'emerald'}
                trend={2}
            />
            <Card
                title="Critical Breaches"
                value={summary.sla_breached.toLocaleString()}
                subtext="Immediate Attention"
                icon={AlertTriangle}
                color="red"
                trend={8}
            />
        </div>
    );
}
