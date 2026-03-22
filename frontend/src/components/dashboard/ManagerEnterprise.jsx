import React, { useMemo, useState, useEffect } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    AreaChart, Area, PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import {
    MoreHorizontal, ArrowUpRight, ArrowDownRight, Users, Clock, AlertTriangle,
    CheckCircle2, TrendingUp, AlertOctagon, Timer, BarChart3, Zap, Activity, RefreshCw, AlertOctagon as AlertOctagonLucide
} from 'lucide-react';
import { motion } from 'framer-motion';
import { statsService } from '../../services/statsService';

// --- Utility: Simulate Stats for Demo ---
const generateSparkline = () => Array.from({ length: 7 }, (_, i) => ({
    day: `Day ${i + 1}`,
    value: Math.floor(Math.random() * 50) + 20
}));

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b'];

// 1️⃣ Performance Intelligence Panel
export const PerformanceIntelligence = ({ tickets }) => {
    // Mock metrics for "Advanced" feel using existing ticket count scaling
    const total = tickets.length || 0;
    const resolved = tickets.filter(t => t.status === 'RESOLVED').length;

    // Simulate complex metrics based on real counts
    const avgResolutionCheck = total > 0 ? (Math.random() * 24 + 12).toFixed(1) : "0.0";
    const reopenRate = total > 0 ? (Math.random() * 5 + 1).toFixed(1) : "0.0";

    const metrics = [
        { label: 'Avg Resolution Time', value: `${avgResolutionCheck}h`, trend: '+12%', isPositive: false, icon: Clock, spark: generateSparkline() },
        { label: 'First Response Time', value: '1.2h', trend: '-8%', isPositive: true, icon: Zap => <TrendingUp className="w-4 h-4" />, spark: generateSparkline() },
        { label: 'Reopen Rate', value: `${reopenRate}%`, trend: '-0.5%', isPositive: true, icon: CheckCircle2, spark: generateSparkline() },
        { label: 'Escalation Rate', value: '4.2%', trend: '+1.1%', isPositive: false, icon: AlertTriangle, spark: generateSparkline() },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {metrics.map((m, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 relative overflow-hidden group"
                >
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <m.icon className="w-12 h-12 text-slate-400" />
                    </div>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">{m.label}</p>
                    <div className="flex items-end gap-2 mb-3">
                        <h3 className="text-2xl font-black text-white">{m.value}</h3>
                        <span className={`text-xs font-bold flex items-center ${m.isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {m.isPositive ? <ArrowDownRight className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />}
                            {m.trend}
                        </span>
                    </div>
                    <div className="h-10 opacity-50">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={m.spark}>
                                <Area type="monotone" dataKey="value" stroke={m.isPositive ? '#10b981' : '#f43f5e'} fill={m.isPositive ? '#10b981' : '#f43f5e'} fillOpacity={0.2} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

// 2️⃣ SLA Breakdown Matrix & 4️⃣ Distribution Analytics
export const AnalyticsSection = ({ tickets }) => {
    // Process real data
    const priorityData = useMemo(() => {
        const counts = { HIGH: 0, MEDIUM: 0, LOW: 0 };
        tickets.forEach(t => counts[t.priority] = (counts[t.priority] || 0) + 1);
        return Object.keys(counts).map(k => ({ name: k, value: counts[k] }));
    }, [tickets]);

    const statusData = useMemo(() => {
        const counts = { OPEN: 0, IN_PROGRESS: 0, RESOLVED: 0, CLOSED: 0 };
        tickets.forEach(t => counts[t.status] = (counts[t.status] || 0) + 1);
        return Object.keys(counts).map(k => ({ name: k, value: counts[k] }));
    }, [tickets]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Ticket Distribution (Category/Status) */}
            <div className="lg:col-span-2 bg-[#0f172a] border border-slate-800 rounded-xl p-6">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <BarChart3 className="w-5 h-5 text-indigo-500" />
                            Ticket Volume Distribution
                        </h3>
                        <p className="text-xs text-slate-500">Breakdown by Priority & Status</p>
                    </div>
                    <select className="bg-slate-900 border border-slate-700 text-xs text-slate-300 rounded px-2 py-1">
                        <option>Last 30 Days</option>
                        <option>Last 7 Days</option>
                    </select>
                </div>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={statusData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                            <XAxis type="number" stroke="#475569" fontSize={12} />
                            <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={11} width={80} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px' }}
                                itemStyle={{ color: '#e2e8f0' }}
                            />
                            <Bar dataKey="value" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={20} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* SLA Compliance Gauge (Simulated/Calculated) */}
            <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-6 flex flex-col">
                <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                    <Timer className="w-5 h-5 text-emerald-400" />
                    SLA Compliance
                </h3>
                <p className="text-xs text-slate-500 mb-6">Overall adherence rate</p>

                <div className="flex-1 flex items-center justify-center relative">
                    <div className="w-48 h-48 rounded-full border-8 border-slate-800 flex items-center justify-center relative">
                        <div className="absolute inset-0 rounded-full border-8 border-emerald-500 border-t-transparent border-l-transparent transform -rotate-45" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }}></div>
                        <div className="text-center">
                            <span className="text-4xl font-black text-white block">94%</span>
                            <span className="text-xs font-bold text-slate-500 uppercase">Target: 90%</span>
                        </div>
                    </div>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                    <div className="bg-slate-900 rounded p-2">
                        <p className="text-[10px] text-slate-500 uppercase">High</p>
                        <p className="text-sm font-bold text-emerald-400">98%</p>
                    </div>
                    <div className="bg-slate-900 rounded p-2">
                        <p className="text-[10px] text-slate-500 uppercase">Med</p>
                        <p className="text-sm font-bold text-emerald-400">92%</p>
                    </div>
                    <div className="bg-slate-900 rounded p-2">
                        <p className="text-[10px] text-slate-500 uppercase">Low</p>
                        <p className="text-sm font-bold text-amber-400">88%</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

// 3️⃣ Employee Performance Comparison Table
export const EmployeePerformanceTable = () => {
    const [agents, setAgents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAgents = async () => {
            const res = await statsService.getAgentPerformance();
            if (res.success) {
                setAgents(res.data.agents || []);
            }
            setLoading(false);
        };
        fetchAgents();
    }, []);

    const getStatusText = (sla, total) => {
        if (total === 0) return 'New';
        if (sla >= 95) return 'Top Performer';
        if (sla >= 85) return 'Good';
        if (sla >= 75) return 'Average';
        return 'Needs Review';
    };

    if (loading) return <div className="p-8 text-center text-slate-500 bg-[#0f172a] rounded-xl animate-pulse">Loading agent performance...</div>;

    // Filter top 10 agents for the graph to avoid overcrowding
    const graphData = agents.slice(0, 10).map(a => ({
        name: a.name.split(' ')[0], 
        SLA: a.sla_compliance, 
        Tickets: a.total_tickets
    }));

    return (
        <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-6 mb-8 overflow-hidden">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <Users className="w-5 h-5 text-cyan-400" />
                        Agent Performance Leaderboard
                    </h3>
                    <p className="text-xs text-slate-500">Real-time resolution metrics and SLA compliance</p>
                </div>
            </div>

            {/* Agent Performance Graph */}
            {graphData.length > 0 && (
                <div className="h-64 mb-8 bg-slate-900/50 rounded-xl p-4 border border-slate-800">
                    <h4 className="text-xs font-bold text-slate-400 mb-4 px-2 uppercase tracking-wider text-center">Volume vs SLA Compliance (Top Agents)</h4>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={graphData}
                            margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                            <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis yAxisId="left" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis yAxisId="right" orientation="right" stroke="#34d399" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }}
                                itemStyle={{ color: '#e2e8f0', fontSize: '12px' }}
                                labelStyle={{ color: '#94a3b8', fontSize: '12px', fontWeight: 'bold' }}
                            />
                            <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                            <Bar yAxisId="left" dataKey="Tickets" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={20} />
                            <Bar yAxisId="right" dataKey="SLA" fill="#10b981" radius={[4, 4, 0, 0]} barSize={20} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}

            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="border-b border-slate-700 text-xs text-slate-400 uppercase tracking-wider">
                            <th className="py-3 px-4">Agent Name</th>
                            <th className="py-3 px-4">Total Handled</th>
                            <th className="py-3 px-4">Failed SLAs</th>
                            <th className="py-3 px-4">Active Queue</th>
                            <th className="py-3 px-4">Customer Rating</th>
                            <th className="py-3 px-4">SLA Compliance</th>
                            <th className="py-3 px-4 text-center">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {agents.map((emp, i) => (
                            <tr key={emp.id || i} className="border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors">
                                <td className="py-3 px-4">
                                    <div className="font-bold text-white">{emp.name}</div>
                                    <div className="text-[10px] text-slate-500">{emp.email}</div>
                                </td>
                                <td className="py-3 px-4 text-slate-300 font-mono">{emp.total_tickets}</td>
                                <td className="py-3 px-4">
                                    {emp.breached > 0 ? (
                                        <span className="px-2 py-0.5 rounded text-xs font-bold bg-rose-500/10 text-rose-500 border border-rose-500/20">
                                            {emp.breached} Breached
                                        </span>
                                    ) : (
                                        <span className="text-slate-500 text-xs">0</span>
                                    )}
                                </td>
                                <td className="py-3 px-4">
                                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${emp.active > 5 ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 'text-slate-400'}`}>
                                        {emp.active} tickets
                                    </span>
                                </td>
                                <td className="py-3 px-4 text-emerald-400 font-bold">
                                    {emp.avg_rating > 0 ? `★ ${emp.avg_rating.toFixed(1)}` : 'N/A'}
                                </td>
                                <td className="py-3 px-4 relative">
                                    <div className="flex items-center gap-2">
                                        <div className="w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden flex-shrink-0">
                                            <div
                                                className={`h-full rounded-full ${emp.sla_compliance >= 95 ? 'bg-emerald-500' : emp.sla_compliance >= 85 ? 'bg-blue-500' : 'bg-amber-500'}`}
                                                style={{ width: `${emp.sla_compliance}%` }}
                                            />
                                        </div>
                                        <span className="text-xs text-slate-400 block">{emp.sla_compliance}%</span>
                                    </div>
                                </td>
                                <td className="py-3 px-4 text-center">
                                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${emp.sla_compliance >= 95 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                        emp.sla_compliance >= 85 ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                                            'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                        }`}>
                                        {getStatusText(emp.sla_compliance, emp.total_tickets)}
                                    </span>
                                </td>
                            </tr>
                        ))}
                        {agents.length === 0 && (
                            <tr>
                                <td colSpan="6" className="text-center py-6 text-slate-500 text-sm">No agent data found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// 5️⃣ Escalation Monitoring & 6️⃣ Operational Backlog
export const OperationalPanel = ({ tickets }) => {
    // Filter real escalated tickets if any, or mock
    const escalated = tickets.filter(t => t.is_escalated && t.status !== 'RESOLVED' && t.status !== 'CLOSED').slice(0, 5);
    const backlog = tickets.filter(t => t.status === 'OPEN').slice(0, 5);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 pt-4 border-t border-slate-800/50">
            {/* Escalation Monitor */}
            <div className="bg-[#1e1b4b]/30 border border-rose-900/30 rounded-xl p-5">
                <h4 className="text-sm font-bold text-rose-400 flex items-center gap-2 mb-4 uppercase tracking-wide">
                    <AlertOctagon className="w-4 h-4" /> Escalation Watchlist
                </h4>
                {escalated.length > 0 ? (
                    <div className="space-y-3">
                        {escalated.map((t, i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-slate-900/50 border border-slate-800 rounded-lg hover:border-rose-500/30 transition-all">
                                <div>
                                    <p className="text-white font-bold text-xs">#{t.id ? String(t.id).slice(-6) : '82910'}</p>
                                    <p className="text-slate-400 text-xs truncate max-w-[200px]">{t.title}</p>
                                </div>
                                <div className="text-right flex items-center gap-4">
                                    <div className="text-rose-500 text-[10px] font-bold animate-pulse px-2 py-1 bg-rose-500/20 rounded-md border border-rose-500/30">ESCALATED</div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 text-slate-500 text-xs">No active escalations</div>
                )}
            </div>

            {/* Backlog */}
            <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5">
                <h4 className="text-sm font-bold text-slate-300 flex items-center gap-2 mb-4 uppercase tracking-wide">
                    <MoreHorizontal className="w-4 h-4" /> Operational Backlog (Open / Pending)
                </h4>
                <div className="space-y-3">
                    {backlog.length > 0 ? backlog.map((t, i) => (
                        <div key={t.id || i} className="flex items-center gap-3 p-3 border-l-2 border-amber-500 bg-slate-900/30">
                            <div className="w-2 h-2 rounded-full bg-amber-500" />
                            <div className="flex-1 min-w-0">
                                <p className="text-slate-300 text-xs font-medium truncate">{t.title}</p>
                                <p className="text-slate-500 text-[10px] mt-0.5">
                                    Assigned to: <span className="text-slate-400">{t.assigned_to ? t.assigned_to.name : 'Unassigned'}</span> 
                                    {' '}• Priority: {t.priority}
                                </p>
                            </div>
                            <button className="px-2 py-1 bg-slate-800 border border-slate-700 text-slate-300 text-[10px] font-bold rounded hover:bg-slate-700 transition-colors">
                                Review
                            </button>
                        </div>
                    )) : (
                        <div className="text-center py-8 text-slate-500 text-xs">Queue is clear! No active backlog.</div>
                    )}
                </div>
            </div>
        </div>
    );
};
