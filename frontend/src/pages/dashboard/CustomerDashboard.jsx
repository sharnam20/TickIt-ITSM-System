import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    LayoutDashboard, Ticket, PlusCircle, Settings,
    FileText, Headphones, MessageSquare, Star, Zap
} from 'lucide-react';
import { ticketService } from '../../services/ticketService';
import CustomerStatsStrip from '../../components/dashboard/CustomerStatsStrip';
import TicketList from '../../components/TicketList';
import CreateTicketModal from '../../components/CreateTicketModal';
import { ServiceSummary, HistoryAnalytics, FaqSection } from '../../components/dashboard/CustomerEnterprise';

export default function CustomerDashboard() {
    const [activeTab, setActiveTab] = useState('overview');
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTickets();
    }, []);

    const fetchTickets = async () => {
        const result = await ticketService.getMyTickets();
        if (result.success) {
            setTickets(result.data);
        }
        setLoading(false);
    };

    const tabs = [
        { id: 'overview', label: 'Service Hub', icon: LayoutDashboard },
        { id: 'tickets', label: 'My Requests', icon: Ticket },
    ];

    const handleCreateClick = () => {
        setIsCreateOpen(true);
    };

    return (
        <div className="space-y-6 p-2">
            <CreateTicketModal
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
                onCreated={() => {
                    setIsCreateOpen(false);
                    fetchTickets();
                    setActiveTab('tickets');
                }}
            />

            <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-6 gap-4 border-b border-slate-800 pb-6">
                <div>
                    <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                            Service Console
                        </span>
                    </h1>
                    <p className="text-slate-400 font-mono text-xs mt-2 uppercase tracking-wide">
                        Personal Workspace • <span className="text-emerald-400 font-bold">Active</span>
                    </p>
                </div>
                <button
                    onClick={handleCreateClick}
                    className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg shadow-sm hover:translate-y-[-1px] transition-all"
                >
                    <PlusCircle className="w-4 h-4" /> New Request
                </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-slate-800 mb-8 overflow-x-auto">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-6 py-3 text-sm font-bold border-b-2 transition-all whitespace-nowrap ${activeTab === tab.id
                            ? 'border-blue-500 text-blue-400 bg-blue-500/5'
                            : 'border-transparent text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'
                            }`}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content Switch */}
            <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
            >
                {activeTab === 'overview' && (
                    <div className="space-y-8">
                        <ServiceSummary tickets={tickets} />

                        <section onClick={handleCreateClick} className="cursor-pointer group p-6 rounded-xl border border-slate-800 bg-gradient-to-r from-blue-900/20 to-indigo-900/20 hover:border-blue-500/50 transition-all relative overflow-hidden flex items-center justify-between">
                            <div>
                                <h3 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
                                    <PlusCircle className="w-5 h-5 text-blue-500" /> Raise New Ticket
                                </h3>
                                <p className="text-slate-400 text-sm">Submit an incident report for assistance.</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-all">
                                <PlusCircle className="w-6 h-6" />
                            </div>
                        </section>

                        <HistoryAnalytics tickets={tickets} />

                        <FaqSection />
                    </div>
                )}

                {
                    activeTab === 'tickets' && (
                        <div className="border border-slate-800 rounded-2xl bg-slate-900/50 overflow-hidden">
                            <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-blue-900/10">
                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                    <Ticket className="w-5 h-5 text-blue-500" />
                                    My Request History
                                </h3>
                            </div>
                            <div className="p-6">
                                <TicketList />
                            </div>
                        </div>
                    )
                }
            </motion.div >
        </div >
    );
}
