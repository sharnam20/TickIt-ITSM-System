import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    LineChart, Line, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import {
    Ticket, Clock, AlertTriangle, CheckCircle2, TrendingUp,
    Layers, Users, Activity, Filter, RefreshCw
} from 'lucide-react';
import { statsService } from '../services/statsService';
import { useAuth } from '../context/AuthContext';

const COLORS = ['#3b82f6', '#f59e0b', '#ef4444', '#10b981', '#8b5cf6'];

export default function Dashboard() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const { user } = useAuth();

    // If user is a manager, show the specialized Manager Dashboard with Tabs
    // BUT avoid infinite loop if ManagerDashboard calls Dashboard (which it does for Overview tab).
    // So we check if we are being rendered AS a sub-component or as a page.

    // Actually, simpler approach: Update the Route in App.jsx or create a new internal router here.
    // For now, let's keep Dashboard.jsx as the Overview Component used by everyone, 
    // and let ManagerDashboard be the page container for Managers.

    // Reverting logic: Dashboard.jsx will remain PURE STATISTICS.
    // I will update App.jsx to route managers to ManagerDashboard.

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        setLoading(true);
        const result = await statsService.getSummary();
        if (result.success) {
            setData(result.data);
        } else {
            setError(result.error);
        }
        setLoading(false);
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
            <RefreshCw className="w-10 h-10 text-blue-500 animate-spin" />
            <p className="text-slate-500 font-medium animate-pulse">Analyzing system data...</p>
        </div>
    );

    if (error) return (
        <div className="p-8 text-center bg-red-50 dark:bg-red-900/10 rounded-3xl border border-red-100 dark:border-red-900/20">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-red-600 dark:text-red-400 mb-2">Analytics Error</h2>
            <p className="text-slate-500">{error}</p>
        </div>
    );

    const summaryItems = data && data.summary ? [
        { title: 'Total Tickets', value: data.summary.total || 0, icon: Ticket, color: 'blue', trend: '+12%' },
        { title: 'Open Now', value: data.summary.open || 0, icon: Activity, color: 'amber', trend: 'Active' },
        { title: 'Resolved', value: data.summary.resolved || 0, icon: CheckCircle2, color: 'green', trend: '84% rate' },
        { title: 'SLA Breached', value: data.summary.sla_breached || 0, icon: AlertTriangle, color: 'red', trend: 'Needs Action' },
    ] : [];

    if (!data) return null; // Should be handled by loading state, but double check.

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                        Analytics Dashboard
                    </h1>
                    <p className="text-slate-500 mt-1 text-lg">Real-time health insights for your IT operations.</p>
                </div>
                <button
                    onClick={fetchStats}
                    className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm"
                >
                    <RefreshCw className="w-4 h-4" /> Refresh Data
                </button>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {summaryItems.map((item, idx) => (
                    <motion.div
                        key={item.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition-shadow relative overflow-hidden group"
                    >
                        <div className={`absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform`}>
                            <item.icon className="w-24 h-24" />
                        </div>
                        <div className="flex items-center gap-4 mb-4">
                            <div className={`p-3 rounded-2xl bg-${item.color}-50 dark:bg-${item.color}-900/20`}>
                                <item.icon className={`w-6 h-6 text-${item.color}-500`} />
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{item.trend}</span>
                        </div>
                        <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium">{item.title}</h3>
                        <p className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">{item.value}</p>
                    </motion.div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Trend Chart */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Ticket Volume Trends</h3>
                            <p className="text-slate-400 text-xs">Daily ticket creation for the past 7 days</p>
                        </div>
                        <TrendingUp className="w-5 h-5 text-blue-500" />
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data.trends}>
                                <defs>
                                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                <XAxis
                                    dataKey="date"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12, fill: '#94A3B8' }}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12, fill: '#94A3B8' }}
                                />
                                <Tooltip
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', background: '#fff' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="count"
                                    stroke="#3b82f6"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorCount)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Priority Pie Chart */}
                <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
                    <div className="mb-8">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Priority Mix</h3>
                        <p className="text-slate-400 text-xs">Distribution of active issues</p>
                    </div>
                    <div className="h-[250px] w-full relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={Object.entries(data.priority).map(([name, value]) => ({ name, value }))}
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {Object.entries(data.priority).map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <Layers className="w-8 h-8 text-slate-200" />
                        </div>
                    </div>
                    <div className="mt-6 space-y-2">
                        {Object.entries(data.priority).map(([label, val], idx) => (
                            <div key={label} className="flex items-center justify-between text-xs">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                                    <span className="font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">{label}</span>
                                </div>
                                <span className="font-bold text-slate-900 dark:text-white">{val}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
