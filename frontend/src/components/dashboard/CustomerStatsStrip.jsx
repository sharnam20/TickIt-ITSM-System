import { useRef } from 'react';
import { motion } from 'framer-motion';
import { Ticket, CheckCircle, Clock } from 'lucide-react';

const StatCard = ({ label, value, subtext, icon: Icon, color }) => (
    <div className="bg-[#0B1120] border border-slate-800 rounded-xl p-5 flex items-start justify-between shadow-sm relative overflow-hidden group hover:border-slate-700 transition-all">
        <div>
            <p className="text-sm font-medium text-slate-400 uppercase tracking-wide">{label}</p>
            <h3 className="text-3xl font-extrabold text-white mt-1 group-hover:scale-105 transition-transform origin-left">{value}</h3>
            {subtext && <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">{subtext}</p>}
        </div>
        <div className={`p-3 rounded-lg bg-${color}-500/10 text-${color}-500`}>
            <Icon className="w-5 h-5" />
        </div>
    </div>
);

export default function CustomerStatsStrip({ tickets = [] }) {
    // Derived local stats
    const total = tickets.length;
    const active = tickets.filter(t => t.status !== 'RESOLVED' && t.status !== 'CLOSED').length;
    const resolved = tickets.filter(t => t.status === 'RESOLVED' || t.status === 'CLOSED').length;

    // Recent activity timestamp
    const lastUpdate = tickets.length > 0 ? new Date(tickets[0].updated_at).toLocaleDateString() : 'No activity';

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatCard
                label="Active Requests"
                value={active}
                subtext="Currently being processed"
                icon={Ticket}
                color="blue"
            />
            <StatCard
                label="Resolved Issues"
                value={resolved}
                subtext={`Last resolution: ${lastUpdate}`}
                icon={CheckCircle}
                color="emerald"
            />
            <StatCard
                label="Avg Response"
                value="< 2h"
                subtext="Based on SLA target"
                icon={Clock}
                color="indigo"
            />
        </div>
    );
}
