import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth, getCurrentToken } from '../context/AuthContext';
import {
    Search, Filter, ExternalLink, AlertTriangle,
    CheckCircle2, Clock, MoreHorizontal, ArrowUpRight, Ticket,
    ChevronDown, ChevronUp, MessageSquare, AlertCircle, Timer
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SlaProgressRing from './ui/SlaProgressRing';
import TicketDetailsModal from './tickets/TicketDetailsModal';

const API_URL = 'http://localhost:5001/api';

export default function TicketList({ refreshTrigger = 0 }) {
    const { logout } = useAuth();
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('ALL');
    const [filterPriority, setFilterPriority] = useState('ALL');
    const [selectedTicketId, setSelectedTicketId] = useState(null);
    const [fetchError, setFetchError] = useState('');

    useEffect(() => {
        fetchTickets();
    }, [refreshTrigger]);

    const fetchTickets = async () => {
        setLoading(true);
        setFetchError('');
        try {
            const token = getCurrentToken();
            if (!token) {
                setFetchError('SESSION_EXPIRED'); // Treat missing token as expired session
                setLoading(false);
                return;
            }
            const res = await axios.get(`${API_URL}/tickets?limit=200`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log('[TicketList] API response:', res.data);
            setTickets(res.data.tickets || []);
        } catch (error) {
            console.error("[TicketList] Failed to fetch tickets", error);
            if (error.response?.status === 401) {
                setFetchError('SESSION_EXPIRED');
            } else {
                setFetchError(error.response?.data?.error || error.message || 'Failed to fetch tickets');
            }
        }
        setLoading(false);
    };

    const filteredTickets = tickets.filter(ticket => {
        const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ticket.id.includes(searchTerm);
        const matchesStatus = filterStatus === 'ALL' || ticket.status === filterStatus;
        const matchesPriority = filterPriority === 'ALL' || ticket.priority === filterPriority;
        return matchesSearch && matchesStatus && matchesPriority;
    });

    const statusCounts = {
        ALL: tickets.length,
        OPEN: tickets.filter(t => t.status === 'OPEN').length,
        IN_PROGRESS: tickets.filter(t => t.status === 'IN_PROGRESS').length,
        RESOLVED: tickets.filter(t => t.status === 'RESOLVED').length,
    };

    return (
        <div className="space-y-5">
            {/* Filters Bar */}
            <div className="flex flex-col lg:flex-row justify-between gap-4">
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                        type="text"
                        placeholder="Search tickets..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    />
                </div>

                <div className="flex gap-3">
                    {/* Status Filter */}
                    <div className="flex bg-slate-900 border border-slate-700 p-0.5 rounded-lg">
                        {['ALL', 'OPEN', 'IN_PROGRESS', 'RESOLVED'].map(status => (
                            <button
                                key={status}
                                onClick={() => setFilterStatus(status)}
                                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${filterStatus === status
                                    ? 'bg-blue-600 text-white'
                                    : 'text-slate-500 hover:text-white'
                                    }`}
                            >
                                {status === 'ALL' ? `All (${statusCounts.ALL})` :
                                    status === 'IN_PROGRESS' ? `Active (${statusCounts.IN_PROGRESS})` :
                                        `${status.charAt(0) + status.slice(1).toLowerCase()} (${statusCounts[status]})`}
                            </button>
                        ))}
                    </div>

                    {/* Priority Filter */}
                    <div className="flex bg-slate-900 border border-slate-700 p-0.5 rounded-lg">
                        {['ALL', 'HIGH', 'MEDIUM', 'LOW'].map(p => (
                            <button
                                key={p}
                                onClick={() => setFilterPriority(p)}
                                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${filterPriority === p
                                    ? p === 'HIGH' ? 'bg-red-600 text-white' :
                                        p === 'MEDIUM' ? 'bg-amber-600 text-white' :
                                            p === 'LOW' ? 'bg-blue-600 text-white' :
                                                'bg-slate-700 text-white'
                                    : 'text-slate-500 hover:text-white'
                                    }`}
                            >
                                {p === 'ALL' ? 'All' : p}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Error Display */}
            {fetchError && (
                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm flex items-center gap-2 animate-in fade-in slide-in-from-top-1 duration-200">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                    {fetchError === 'SESSION_EXPIRED'
                        ? "Your session has expired. Please log in again."
                        : fetchError
                    }
                    {fetchError === 'SESSION_EXPIRED' ? (
                        <button
                            onClick={logout}
                            className="ml-auto px-4 py-1.5 bg-red-600 text-white text-xs font-bold rounded-lg hover:bg-red-500 transition-colors shadow-sm"
                        >
                            Log In
                        </button>
                    ) : (
                        <button
                            onClick={fetchTickets}
                            className="ml-auto px-3 py-1 bg-red-600 text-white text-xs font-bold rounded hover:bg-red-500 transition-colors"
                        >
                            Retry
                        </button>
                    )}
                </div>
            )}

            {/* Ticket Cards */}
            <div className="space-y-3">
                {loading ? (
                    <div className="py-16 text-center text-slate-500 animate-pulse text-sm">Loading tickets...</div>
                ) : filteredTickets.length === 0 ? (
                    <div className="bg-[#0B1120] rounded-xl border border-dashed border-slate-700 p-12 text-center">
                        <Ticket className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-white mb-2">No Tickets Found</h3>
                        <p className="text-slate-500 text-sm max-w-xs mx-auto">
                            {searchTerm || filterStatus !== 'ALL' || filterPriority !== 'ALL'
                                ? "Try adjusting your filters to see more results."
                                : "No tickets available yet."}
                        </p>
                    </div>
                ) : (
                    <AnimatePresence>
                        {filteredTickets.map((ticket) => (
                            <motion.div
                                key={ticket.id}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setSelectedTicketId(ticket.id)}
                                className="bg-[#0B1120] rounded-xl border border-slate-800 hover:border-slate-700 transition-all cursor-pointer group"
                            >
                                <div className="p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-4 flex-1 min-w-0">
                                        {/* SLA Ring */}
                                        <div className="flex-shrink-0">
                                            <SlaProgressRing
                                                dueAt={ticket.sla_due_at}
                                                status={ticket.sla_status === 'BREACHED' ? 'BREACHED' : ticket.status === 'RESOLVED' ? 'RESOLVED' : ticket.sla_status}
                                                size={44}
                                            />
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="font-bold text-white text-sm group-hover:text-blue-400 transition-colors truncate">
                                                    {ticket.title}
                                                </h3>
                                            </div>
                                            <div className="flex items-center gap-3 text-xs text-slate-500">
                                                <span className="font-mono">#{ticket.id.substring(0, 8)}</span>
                                                <span>•</span>
                                                <span>{ticket.category || 'General'}</span>
                                                <span>•</span>
                                                <span>{new Date(ticket.created_at).toLocaleDateString()}</span>
                                                {ticket.assigned_to && (
                                                    <>
                                                        <span>•</span>
                                                        <span className="text-blue-400 font-semibold">{ticket.assigned_to.name}</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Badges */}
                                    <div className="flex items-center gap-2 ml-4">
                                        {ticket.is_escalated && (
                                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide bg-rose-500/20 text-rose-400 border border-rose-500/30">
                                                ESCALATED
                                            </span>
                                        )}
                                        <StatusBadge status={ticket.status} />
                                        <PriorityBadge priority={ticket.priority} />
                                        <ArrowUpRight className="w-4 h-4 text-slate-600 group-hover:text-blue-400 transition-colors" />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                )}
            </div>

            {/* Ticket Detail Side Panel */}
            <TicketDetailsModal
                isOpen={!!selectedTicketId}
                onClose={() => setSelectedTicketId(null)}
                ticketId={selectedTicketId}
                onUpdate={fetchTickets}
            />
        </div>
    );
}

const StatusBadge = ({ status }) => {
    const styles = {
        'OPEN': 'bg-slate-500/15 text-slate-400',
        'IN_PROGRESS': 'bg-blue-500/15 text-blue-400',
        'RESOLVED': 'bg-emerald-500/15 text-emerald-400',
        'CLOSED': 'bg-slate-700/50 text-slate-500'
    };
    return (
        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${styles[status] || styles['CLOSED']}`}>
            {status.replace('_', ' ')}
        </span>
    );
};

const PriorityBadge = ({ priority }) => {
    const styles = {
        'HIGH': 'bg-red-500/15 text-red-400 border-red-500/30',
        'MEDIUM': 'bg-amber-500/15 text-amber-400 border-amber-500/30',
        'LOW': 'bg-blue-500/15 text-blue-400 border-blue-500/30'
    };
    return (
        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border ${styles[priority] || ''}`}>
            {priority}
        </span>
    );
};
