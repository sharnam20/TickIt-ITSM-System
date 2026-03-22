import { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, User, CheckCircle2, History, MessageSquare, AlertTriangle, ArrowRight } from 'lucide-react';
import axios from 'axios';
import { getCurrentToken } from '../context/AuthContext';
import SlaProgressRing from './ui/SlaProgressRing';

const API_URL = 'http://localhost:5001/api';

export default function TicketContextPanel({ ticketId, onClose }) {
    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const panelRef = useRef(null);

    useEffect(() => {
        if (ticketId) {
            fetchTicketDetails();
        }
    }, [ticketId]);

    // Close on click outside (optional)
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (panelRef.current && !panelRef.current.contains(event.target)) {
                onClose();
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [onClose]);

    const fetchTicketDetails = async () => {
        setLoading(true);
        try {
            const token = getCurrentToken();
            const res = await axios.get(`${API_URL}/tickets/${ticketId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTicket(res.data.ticket);
        } catch (err) {
            console.error("Failed to fetch ticket history", err);
            setError("Could not load ticket details.");
        }
        setLoading(false);
    };

    if (!ticketId) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="fixed top-0 right-0 h-full w-full sm:w-[500px] bg-white dark:bg-slate-900 shadow-2xl z-50 border-l border-slate-200 dark:border-slate-800 flex flex-col"
                ref={panelRef}
            >
                {/* Header */}
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">
                            <History className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Ticket Audit Log</h2>
                            <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">#{ticketId.substring(0, 8)}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5 text-slate-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar relative">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-full gap-4">
                            <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-slate-500 text-sm">Retrieving history...</p>
                        </div>
                    ) : error ? (
                        <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4" /> {error}
                        </div>
                    ) : (
                        <>
                            {/* SLA Quick View */}
                            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">SLA Status</p>
                                    <div className={`text-lg font-bold ${ticket.sla_status === 'BREACHED' ? 'text-red-500' :
                                            ticket.sla_status === 'AT_RISK' ? 'text-amber-500' : 'text-green-500'
                                        }`}>
                                        {ticket.sla_status.replace('_', ' ')}
                                    </div>
                                    <p className="text-xs text-slate-400 mt-1">Due: {new Date(ticket.sla_due_at).toLocaleString()}</p>
                                </div>
                                <SlaProgressRing dueAt={ticket.sla_due_at} status={ticket.sla_status} size={64} stroke={6} />
                            </div>

                            {/* Timeline */}
                            <div>
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-indigo-500" /> Activity Timeline
                                </h3>

                                <div className="space-y-0 relative pl-4 border-l-2 border-slate-100 dark:border-slate-800 ml-2">
                                    {ticket.history && ticket.history.length > 0 ? (
                                        ticket.history.map((entry, idx) => (
                                            <div key={idx} className="relative pb-8 pl-6 last:pb-0 group">
                                                {/* Timeline Dot */}
                                                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 border-white dark:border-slate-900 bg-slate-300 dark:bg-slate-600 group-hover:bg-indigo-500 transition-colors shadow-sm"></div>

                                                <div className="flex flex-col gap-1">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                                                            {new Date(entry.timestamp).toLocaleString(undefined, {
                                                                month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                                            })}
                                                        </span>
                                                        <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider ${entry.action === 'CREATED' ? 'bg-blue-100 text-blue-700' :
                                                                entry.action === 'UPDATED' ? 'bg-amber-100 text-amber-700' :
                                                                    entry.action === 'RESOLVED' ? 'bg-green-100 text-green-700' :
                                                                        'bg-slate-100 text-slate-600'
                                                            }`}>
                                                            {entry.action}
                                                        </span>
                                                    </div>

                                                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200 mt-1">
                                                        {entry.details || "No details provided"}
                                                    </p>

                                                    <div className="flex items-center gap-2 mt-2">
                                                        <div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-[10px] font-bold">
                                                            {entry.performed_by?.name?.[0] || 'S'}
                                                        </div>
                                                        <span className="text-xs text-slate-500 font-medium">
                                                            {entry.performed_by?.name || 'System'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-sm text-slate-400 italic pl-6">No history available.</p>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex justify-end gap-3">
                    <button className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors">
                        Export Log
                    </button>
                    <button onClick={onClose} className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-indigo-600/20 transition-all">
                        Done
                    </button>
                </div>
            </motion.div>

            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            />
        </AnimatePresence>
    );
}
