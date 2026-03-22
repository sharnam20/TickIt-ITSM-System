// ManagerDashboard.jsx Updated
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    LayoutDashboard, Users, Ticket, Settings as SettingsIcon,
    BarChart3, Activity, ShieldCheck, RefreshCw
} from 'lucide-react';
import { statsService } from '../../services/statsService';
import ManagerMetricsGrid from '../../components/dashboard/ManagerMetricsGrid';
import RiskControlPanel from '../../components/dashboard/RiskControlPanel';
import GovernanceAnalytics from '../../components/dashboard/GovernanceAnalytics';
import AuditLogsList from '../../components/dashboard/AuditLogsList';
import TeamTable from '../../components/TeamTable';
import TicketList from '../../components/TicketList';
import { ticketService } from '../../services/ticketService';
import {
    PerformanceIntelligence, AnalyticsSection,
    EmployeePerformanceTable, OperationalPanel
} from '../../components/dashboard/ManagerEnterprise';

export default function ManagerDashboard() {
    const [activeTab, setActiveTab] = useState('overview');
    const [tickets, setTickets] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [isExporting, setIsExporting] = useState(false);

    useEffect(() => {
        loadDashboardData();
    }, [refreshTrigger]);

    const loadDashboardData = async () => {
        setLoading(true);
        try {
            const [statsRes, ticketsRes] = await Promise.all([
                statsService.getSummary(),
                ticketService.getTickets({ limit: 500 })
            ]);

            if (statsRes.success) setStats(statsRes.data);
            if (ticketsRes.success) setTickets(ticketsRes.data.tickets || []);
        } catch (error) {
            console.error("Failed to load dashboard data", error);
        }
        setLoading(false);
    };

    const handleExportCsv = async () => {
        setIsExporting(true);
        const result = await statsService.downloadCsv();
        if (!result.success) {
            alert(result.error || "Failed to export CSV database");
        }
        setIsExporting(false);
    };

    const tabs = [
        { id: 'overview', label: 'Command Center', icon: Activity },
        { id: 'governance', label: 'Compliance', icon: ShieldCheck },
        { id: 'team', label: 'Workforce', icon: Users },
        { id: 'tickets', label: 'Operations Queue', icon: Ticket },
        { id: 'settings', label: 'Configuration', icon: SettingsIcon },
    ];

    return (
        <div className="space-y-8 p-2">

            {/* Enterprise Header */}
            <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-6 mb-8 border-b border-slate-800 pb-6">
                <div>
                    <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
                        <ShieldCheck className="text-indigo-500 w-8 h-8" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
                            IT Operations Console
                        </span>
                    </h1>
                    <p className="text-slate-400 font-mono text-xs mt-2 uppercase tracking-widest">
                        System Status: <span className="text-emerald-400 font-bold">ONLINE</span> •
                        Security Level: <span className="text-indigo-400 font-bold">HIGH</span> •
                        Last Sync: {new Date().toLocaleTimeString()}
                    </p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={handleExportCsv}
                        disabled={isExporting}
                        className="px-4 py-2 bg-emerald-900 border border-emerald-700 hover:bg-emerald-800 text-emerald-300 rounded-lg text-xs font-bold flex items-center gap-2 transition-all disabled:opacity-50"
                    >
                        {isExporting ? 'Exporting...' : 'Export Database (CSV)'}
                    </button>
                    <button
                        onClick={() => setRefreshTrigger(prev => prev + 1)}
                        className="px-4 py-2 bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-300 rounded-lg text-xs font-bold flex items-center gap-2 transition-all"
                    >
                        <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
                        Refresh Data
                    </button>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex border-b border-slate-800 mb-8 overflow-x-auto">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-6 py-3 text-sm font-bold border-b-2 transition-all whitespace-nowrap ${activeTab === tab.id
                            ? 'border-indigo-500 text-indigo-400 bg-indigo-500/5'
                            : 'border-transparent text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'
                            }`}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Main Content Area */}
            <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="min-h-[600px]"
            >
                {activeTab === 'overview' && (
                    <div className="space-y-12">
                        {/* Zone A: Strategic KPIs */}
                        <section>
                            <PerformanceIntelligence tickets={tickets} />

                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <Activity className="w-4 h-4 text-blue-500" />
                                    Strategic Overview
                                </h3>
                                <span className="h-px bg-slate-800 flex-1 ml-4"></span>
                            </div>
                            <ManagerMetricsGrid stats={stats} />
                        </section>

                        {/* Zone B: Risk & Monitoring */}
                        <section>
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <Activity className="w-4 h-4 text-amber-500" />
                                    Risk Control Center
                                </h3>
                                <span className="h-px bg-slate-800 flex-1 ml-4"></span>
                            </div>
                            <RiskControlPanel stats={stats} />
                        </section>

                        <section>
                            <AnalyticsSection tickets={tickets} />
                        </section>

                        <section>
                            <EmployeePerformanceTable />
                        </section>

                        <section>
                            <OperationalPanel tickets={tickets} />
                        </section>
                    </div>
                )}

                {activeTab === 'governance' && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                                Compliance & Security
                            </h3>
                            <span className="h-px bg-slate-800 flex-1 ml-4"></span>
                        </div>
                        <GovernanceAnalytics stats={stats} />

                        {/* Audit Log Component */}
                        <div className="mt-8">
                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-4">
                                <ShieldCheck className="w-4 h-4 text-purple-500" />
                                Security Audit Logs
                            </h3>
                            <AuditLogsList refreshTrigger={refreshTrigger} />
                        </div>
                    </div>
                )}

                {activeTab === 'team' && (
                    <div className="border border-slate-800 rounded-2xl bg-slate-900/50 overflow-hidden">
                        <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <Users className="w-5 h-5 text-indigo-500" />
                                Workforce Directory
                            </h3>
                        </div>
                        <div className="p-6">
                            <TeamTable refreshTrigger={refreshTrigger} />
                        </div>
                    </div>
                )}

                {activeTab === 'tickets' && (
                    <div className="border border-slate-800 rounded-2xl bg-slate-900/50 overflow-hidden">
                        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-indigo-900/10">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <Ticket className="w-5 h-5 text-indigo-500" />
                                Global Operations Queue
                            </h3>
                            <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 text-xs font-bold rounded border border-indigo-500/30">
                                Administrator Access
                            </span>
                        </div>
                        <div className="p-6">
                            <TicketList />
                        </div>
                    </div>
                )}

                {activeTab === 'settings' && (
                    <div className="glass p-16 rounded-3xl text-center border border-dashed border-slate-300 dark:border-slate-700">
                        <SettingsIcon className="w-16 h-16 text-slate-300 mx-auto mb-6" />
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">System Configuration</h3>
                        <p className="text-slate-500 mt-2 text-lg">Global settings for SLA policies and email notifications.</p>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
