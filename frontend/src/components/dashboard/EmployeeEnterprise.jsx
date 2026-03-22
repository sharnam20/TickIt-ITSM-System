
import React, { useMemo } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts';
import {
    Trophy, Zap, AlertTriangle, Target, Briefcase, Activity, Clock
} from 'lucide-react';
import { motion } from 'framer-motion';

const COLORS = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6'];

// 1️⃣ Personal Performance Tracker
export const PersonalPerformance = ({ tickets }) => {
    // Calculate week's performance
    const resolvedCount = tickets.filter(t => t.status === 'RESOLVED').length;
    const activeCount = tickets.filter(t => t.status !== 'RESOLVED' && t.status !== 'CLOSED').length;

    // Mock Trend Data
    const trendData = [
        { day: 'Mon', solved: 4 }, { day: 'Tue', solved: 7 }, { day: 'Wed', solved: 5 },
        { day: 'Thu', solved: 8 }, { day: 'Fri', solved: 6 }, { day: 'Sat', solved: 2 }, { day: 'Sun', solved: 0 }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-[#0B1120] border border-slate-800 rounded-xl p-6 relative overflow-hidden">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <Trophy className="w-5 h-5 text-amber-400" />
                            Weekly Achievements
                        </h3>
                        <p className="text-xs text-slate-500">Your impact this week</p>
                    </div>
                    <span className="bg-emerald-500/10 text-emerald-400 text-xs font-bold px-2 py-1 rounded border border-emerald-500/20">Top 5%</span>
                </div>
                <div className="flex items-end gap-2 mb-2">
                    <span className="text-4xl font-black text-white">{resolvedCount}</span>
                    <span className="text-sm text-slate-500 mb-1">resolved</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full mb-4 overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: '75%' }}
                        className="h-full bg-gradient-to-r from-amber-400 to-orange-500"
                    />
                </div>
                <div className="h-24 mt-4 opacity-50">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={trendData}>
                            <Area type="monotone" dataKey="solved" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.1} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* 6️⃣ Productivity Heat Indicator */}
            <div className="bg-[#0B1120] border border-slate-800 rounded-xl p-6 flex flex-col justify-between">
                <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-1">
                        <Activity className="w-5 h-5 text-rose-500" />
                        Workload Intensity
                    </h3>
                    <p className="text-xs text-slate-500">Current active tickets vs capacity</p>
                </div>

                <div className="flex items-center justify-center my-4">
                    <div className="relative w-40 h-20 overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-full bg-slate-800 rounded-t-full"></div>
                        <motion.div
                            initial={{ rotate: -90 }}
                            animate={{ rotate: -30 }} // Simulated load
                            className="absolute top-full left-1/2 w-full h-full bg-rose-500 origin-top-left -translate-y-full -translate-x-1/2 rounded-t-full opacity-80"
                            style={{ transformOrigin: '50% 100%' }}
                        ></motion.div>
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-24 h-24 bg-[#0B1120] rounded-full flex items-center justify-center border-4 border-slate-800">
                            <span className="text-xl font-black text-white mt-[-20px]">{activeCount}</span>
                        </div>
                    </div>
                </div>
                <p className="text-center text-xs font-bold text-rose-400 uppercase tracking-widest">High Load</p>
            </div>
        </div>
    );
};

// 2️⃣ Priority Distribution & 5️⃣ Skill Utilization
export const WorkloadAnalytics = ({ tickets }) => {
    const priorityData = useMemo(() => {
        const counts = { HIGH: 0, MEDIUM: 0, LOW: 0 };
        tickets.forEach(t => counts[t.priority] = (counts[t.priority] || 0) + 1);
        return Object.keys(counts).map(k => ({ name: k, value: counts[k] }));
    }, [tickets]);

    const skillData = [
        { name: 'Network', value: 65 },
        { name: 'Software', value: 40 },
        { name: 'Hardware', value: 25 },
        { name: 'Security', value: 10 },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Priority Pie */}
            <div className="bg-[#0B1120] border border-slate-800 rounded-xl p-5">
                <h4 className="text-sm font-bold text-slate-300 mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-slate-500" /> Priority Mix
                </h4>
                <div className="h-40">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={priorityData}
                                cx="50%"
                                cy="50%"
                                innerRadius={40}
                                outerRadius={60}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {priorityData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderRadius: '8px', border: 'none' }} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="flex justify-center gap-4 text-[10px] uppercase font-bold text-slate-500">
                    <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-rose-500" /> High</div>
                    <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-amber-500" /> Med</div>
                    <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500" /> Low</div>
                </div>
            </div>

            {/* Skill Bars */}
            <div className="md:col-span-2 bg-[#0B1120] border border-slate-800 rounded-xl p-5">
                <h4 className="text-sm font-bold text-slate-300 mb-4 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-slate-500" /> Skill Demand
                </h4>
                <div className="h-40">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={skillData} layout="vertical" margin={{ left: 20 }}>
                            <XAxis type="number" hide />
                            <YAxis dataKey="name" type="category" width={80} tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                            <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ backgroundColor: '#1e293b', borderRadius: '8px', border: 'none' }} />
                            <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={15} background={{ fill: '#1e293b' }} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

// 3️⃣ Time-to-Breach Radar
export const BreachRadar = ({ tickets }) => {
    // Filter tickets nearing breach (mock check if SLA logic complex on FE)
    const atRisk = tickets.filter(t => t.status !== 'RESOLVED').slice(0, 4);

    return (
        <div className="bg-[#0B1120] border border-slate-800 rounded-xl p-6 mb-8">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
                <Target className="w-5 h-5 text-rose-500" />
                SLA Breach Radar
            </h3>
            <div className="space-y-3">
                {atRisk.map((t, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-slate-900/40 rounded-lg border border-slate-800 hover:border-slate-700 transition-all group">
                        <div className="flex items-center gap-3">
                            <div className={`w-1.5 h-1.5 rounded-full ${i === 0 ? 'bg-rose-500 animate-ping' : 'bg-slate-600'}`}></div>
                            <div>
                                <p className="text-slate-300 font-medium text-xs">#{t.id ? String(t.id).slice(-6) : '---'}</p>
                                <p className="text-slate-500 text-[10px]">Due in: <span className="text-rose-400 font-bold">{2 + i}h 30m</span></p>
                            </div>
                        </div>
                        <div className="w-32 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                            <div className="h-full bg-rose-500" style={{ width: `${90 - (i * 20)}%` }}></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
