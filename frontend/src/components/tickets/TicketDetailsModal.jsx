import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X, Clock, User, AlertTriangle, MessageSquare, History,
    Edit2, Save, RotateCcw, Loader2, Send, Lock, Globe,
    ArrowRight, UserCheck, Shield, ChevronRight, Timer, Zap,
    Paperclip, Smile, MoreHorizontal, ChevronDown,
    RefreshCw, Info, AlertCircle, CheckCircle2, MessageCircle, ShieldAlert
} from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { ticketService } from '../../services/ticketService';
import { userService } from '../../services/userService';
import { useAuth } from '../../context/AuthContext';

const priorityConfig = {
    LOW: { color: 'text-blue-400', bg: 'bg-blue-500/15', border: 'border-blue-500/30', label: 'Low' },
    MEDIUM: { color: 'text-amber-400', bg: 'bg-amber-500/15', border: 'border-amber-500/30', label: 'Medium' },
    HIGH: { color: 'text-red-400', bg: 'bg-red-500/15', border: 'border-red-500/30', label: 'High' }
};

const statusConfig = {
    OPEN: { color: 'text-slate-400', bg: 'bg-slate-500/15', label: 'Open', dot: 'bg-slate-400' },
    IN_PROGRESS: { color: 'text-blue-400', bg: 'bg-blue-500/15', label: 'In Progress', dot: 'bg-blue-400' },
    RESOLVED: { color: 'text-emerald-400', bg: 'bg-emerald-500/15', label: 'Resolved', dot: 'bg-emerald-400' },
    CLOSED: { color: 'text-slate-500', bg: 'bg-slate-700/50', label: 'Closed', dot: 'bg-slate-500' }
};

const statusFlow = {
    OPEN: ['IN_PROGRESS'],
    IN_PROGRESS: ['RESOLVED', 'OPEN'],
    RESOLVED: ['CLOSED', 'IN_PROGRESS'],
    CLOSED: []
};

const roleColors = {
    CUSTOMER: { bg: 'bg-violet-600', light: 'bg-violet-500/15', text: 'text-violet-400', border: 'border-violet-500/25' },
    EMPLOYEE: { bg: 'bg-sky-600', light: 'bg-sky-500/15', text: 'text-sky-400', border: 'border-sky-500/25' },
    MANAGER: { bg: 'bg-indigo-600', light: 'bg-indigo-500/15', text: 'text-indigo-400', border: 'border-indigo-500/25' },
};

const quickReplies = [
    "Thank you for reaching out. I'm looking into this now.",
    "Could you provide more details about the issue?",
    "This has been escalated to the relevant team.",
    "The issue has been resolved. Please verify on your end.",
];

// ─── Role Badge ───
function RoleBadge({ role }) {
    const rc = roleColors[role] || roleColors.CUSTOMER;
    return (
        <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${rc.light} ${rc.text} ${rc.border} border`}>
            {role === 'EMPLOYEE' ? 'Agent' : role === 'MANAGER' ? 'Manager' : 'Customer'}
        </span>
    );
}

// ─── System Event Block ───
function SystemEvent({ text, timestamp }) {
    return (
        <motion.div
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center my-4"
        >
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/60 border border-slate-700/50 rounded-full max-w-[85%]">
                <Info className="w-3 h-3 text-slate-500 flex-shrink-0" />
                <span className="text-[11px] text-slate-400 font-medium">{text}</span>
                {timestamp && (
                    <span className="text-[9px] text-slate-600 font-mono ml-1 flex-shrink-0">
                        {formatDistanceToNow(new Date(timestamp), { addSuffix: true })}
                    </span>
                )}
            </div>
        </motion.div>
    );
}

// ─── Message Bubble ───
function MessageBubble({ author, role, content, timestamp, isInternal, isMe, index }) {
    const rc = roleColors[role] || roleColors.CUSTOMER;
    const [hovered, setHovered] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0 }}
            className={`flex gap-3 group ${isMe ? 'flex-row-reverse' : ''}`}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {/* Avatar */}
            <div className={`w-9 h-9 rounded-xl ${rc.bg} flex-shrink-0 flex items-center justify-center text-white text-xs font-bold mt-1 shadow-lg shadow-${rc.bg}/20 ring-2 ring-white/5`}>
                {author?.charAt(0)?.toUpperCase() || '?'}
            </div>

            {/* Bubble */}
            <div className={`flex-1 max-w-[78%] ${isMe ? 'items-end' : ''}`}>
                {/* Meta Row */}
                <div className={`flex items-center gap-2 mb-1.5 ${isMe ? 'justify-end' : ''}`}>
                    <span className="text-[13px] font-semibold text-white/90">{author || 'Unknown'}</span>
                    <RoleBadge role={role} />
                    {isInternal && (
                        <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-amber-500/15 text-amber-400 border border-amber-500/25">
                            <Lock className="w-2.5 h-2.5" /> Internal
                        </span>
                    )}
                    <span className="text-[10px] text-slate-500 font-medium ml-auto">
                        {timestamp ? formatDistanceToNow(new Date(timestamp), { addSuffix: true }) : ''}
                    </span>
                </div>

                {/* Content */}
                <div
                    className={`relative p-3.5 rounded-2xl text-[13px] leading-relaxed transition-all duration-200 ${isInternal
                        ? 'bg-amber-500/8 border border-amber-500/20 text-amber-100/90 rounded-tl-md'
                        : isMe
                            ? `bg-gradient-to-br from-blue-600/25 to-blue-700/15 border border-blue-500/20 text-blue-50/95 ${isMe ? 'rounded-tr-md' : 'rounded-tl-md'}`
                            : `bg-slate-800/70 border border-slate-700/50 text-slate-200/95 rounded-tl-md`
                        } ${hovered ? 'border-slate-600/60 shadow-lg shadow-black/20' : ''}`}
                >
                    {content}

                    {/* Hover timestamp overlay */}
                    <AnimatePresence>
                        {hovered && timestamp && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className={`absolute ${isMe ? 'left-0 -translate-x-full pr-2' : 'right-0 translate-x-full pl-2'} top-1/2 -translate-y-1/2`}
                            >
                                <span className="text-[9px] text-slate-600 font-mono whitespace-nowrap bg-slate-900/80 px-2 py-1 rounded-lg border border-slate-800">
                                    {format(new Date(timestamp), 'MMM d, h:mm a')}
                                </span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    );
}

// ─── Conversation Context Header ───
function ConversationHeader({ ticket, sla }) {
    const sc = statusConfig[ticket?.status] || statusConfig.OPEN;
    const pc = priorityConfig[ticket?.priority] || priorityConfig.LOW;

    return (
        <div className="px-5 py-3 bg-gradient-to-r from-slate-900/80 to-slate-800/40 border-b border-slate-800/80" style={{ flexShrink: 0 }}>
            <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2.5">
                    <div className="flex items-center gap-1.5">
                        <div className={`w-2 h-2 rounded-full ${sc.dot} animate-pulse`} />
                        <span className={`text-[11px] font-bold uppercase tracking-wide ${sc.color}`}>{sc.label}</span>
                    </div>
                    <div className="w-px h-4 bg-slate-700" />
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${pc.bg} ${pc.color} border ${pc.border}`}>
                        {pc.label || ticket?.priority}
                    </span>
                    {ticket?.category && (
                        <>
                            <div className="w-px h-4 bg-slate-700" />
                            <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wide">{ticket.category}</span>
                        </>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    {sla && (
                        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold ${sla.isBreached ? 'bg-red-500/15 text-red-400 border border-red-500/25' : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25'
                            }`}>
                            <Timer className="w-3 h-3" />
                            {sla.isBreached ? `Breached ${sla.hoursLeft}h ${sla.minsLeft}m ago` : `${sla.hoursLeft}h ${sla.minsLeft}m left`}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════
//  MAIN COMPONENT
// ═══════════════════════════════════════════════════
export default function TicketDetailsModal({ isOpen, onClose, ticketId, onUpdate }) {
    const { user: currentUser } = useAuth();
    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('conversation');

    // Comments
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [isInternal, setIsInternal] = useState(false);
    const [sendingComment, setSendingComment] = useState(false);
    const chatEndRef = useRef(null);
    const textareaRef = useRef(null);

    // Edit state
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({ title: '', description: '' });
    const [updating, setUpdating] = useState(false);

    // Assignment
    const [staffList, setStaffList] = useState([]);
    const [showAssignDropdown, setShowAssignDropdown] = useState(false);
    const [assigning, setAssigning] = useState(false);

    // Quick replies
    const [showQuickReplies, setShowQuickReplies] = useState(false);

    // Escalation
    const [escalating, setEscalating] = useState(false);

    useEffect(() => {
        if (isOpen && ticketId) {
            fetchTicketDetails();
            fetchComments();
            if (currentUser?.role === 'MANAGER') {
                fetchStaff();
            }
        }
        setIsEditing(false);
        setError('');
        setActiveTab('conversation');
        setShowQuickReplies(false);
    }, [isOpen, ticketId]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [comments]);

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
        }
    }, [newComment]);

    const fetchTicketDetails = async () => {
        setLoading(true);
        const result = await ticketService.getTicketById(ticketId);
        if (result.success) {
            setTicket(result.data.ticket);
            setEditData({ title: result.data.ticket.title, description: result.data.ticket.description });
        } else {
            setError(result.error);
        }
        setLoading(false);
    };

    const fetchComments = async () => {
        const result = await ticketService.getComments(ticketId);
        console.log('[TicketDetailsModal] fetchComments result:', result);
        if (result.success) {
            setComments(result.data || []);
        } else {
            console.error('[TicketDetailsModal] Failed to fetch comments:', result.error);
            // Retry once after a short delay
            setTimeout(async () => {
                const retry = await ticketService.getComments(ticketId);
                console.log('[TicketDetailsModal] fetchComments retry:', retry);
                if (retry.success) setComments(retry.data || []);
            }, 1000);
        }
    };

    const fetchStaff = async () => {
        const result = await userService.getStaff();
        if (result.success) setStaffList(result.data.filter(s => s.role === 'EMPLOYEE'));
    };

    const handleSendComment = async () => {
        if (!newComment.trim()) return;
        setSendingComment(true);
        try {
            const result = await ticketService.addComment(ticketId, newComment, isInternal);
            if (result.success) {
                setNewComment('');
                setShowQuickReplies(false);
                await fetchComments();
            } else {
                console.error('[COMMENT] Send failed:', result.error);
            }
        } catch (err) {
            console.error('[COMMENT] Error sending:', err);
        }
        setSendingComment(false);
    };

    const handleStatusChange = async (newStatus) => {
        setUpdating(true);
        const result = await ticketService.updateTicket(ticketId, { status: newStatus });
        if (result.success) {
            await fetchTicketDetails();
            if (onUpdate) onUpdate();
        }
        setUpdating(false);
    };

    const handleAssign = async (employeeId) => {
        setAssigning(true);
        const result = await ticketService.updateTicket(ticketId, { assigned_to: employeeId });
        if (result.success) {
            await fetchTicketDetails();
            setShowAssignDropdown(false);
            if (onUpdate) onUpdate();
        }
        setAssigning(false);
    };

    const handleUpdate = async () => {
        setUpdating(true);
        setError('');
        const result = await ticketService.updateTicket(ticketId, editData);
        if (result.success) {
            await fetchTicketDetails();
            setIsEditing(false);
            if (onUpdate) onUpdate();
        } else {
            setError(result.error || 'Failed to update ticket');
        }
        setUpdating(false);
    };

    const handleEscalate = async () => {
        setEscalating(true);
        const result = await ticketService.escalateTicket(ticketId);
        if (result.success) {
            alert("Ticket escalated to management.");
            await fetchTicketDetails();
            if (onUpdate) onUpdate();
        } else {
            alert(result.error || "Failed to escalate");
        }
        setEscalating(false);
    };

    if (!isOpen) return null;

    const isCreator = ticket?.created_by?.email === currentUser?.email;
    const isManager = currentUser?.role === 'MANAGER';
    const isEmployee = currentUser?.role === 'EMPLOYEE';
    const isCustomer = currentUser?.role === 'CUSTOMER';
    const canEdit = isCreator && ticket?.status === 'OPEN';
    const canChangeStatus = isManager || isEmployee;
    const nextStatuses = ticket ? (statusFlow[ticket.status] || []) : [];

    // SLA Countdown
    const getSlaInfo = () => {
        if (!ticket?.sla_due_at) return null;
        const now = new Date();
        const due = new Date(ticket.sla_due_at);
        const diff = due - now;
        const isBreached = diff < 0;
        const hoursLeft = Math.abs(Math.floor(diff / (1000 * 60 * 60)));
        const minsLeft = Math.abs(Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)));
        return { isBreached, hoursLeft, minsLeft, due };
    };

    const sla = getSlaInfo();

    // Build conversation feed (original message + comments)
    const visibleComments = comments.filter(c => {
        if (isCustomer && c.is_internal) return false;
        return true;
    });

    const totalMessages = 1 + visibleComments.length; // 1 for original description

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-end">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                />

                {/* Slide-in Panel */}
                <motion.div
                    initial={{ x: '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '100%' }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    className="relative w-full max-w-2xl h-full bg-[#0B1120] border-l border-slate-800 shadow-2xl"
                    style={{ display: 'flex', flexDirection: 'column' }}
                >
                    {loading ? (
                        <div className="flex-1 flex items-center justify-center">
                            <div className="flex flex-col items-center gap-3">
                                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                                <p className="text-xs text-slate-500 font-medium">Loading conversation…</p>
                            </div>
                        </div>
                    ) : error ? (
                        <div className="flex-1 flex items-center justify-center p-8">
                            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 flex items-center gap-3">
                                <AlertTriangle className="w-5 h-5" /> {error}
                            </div>
                        </div>
                    ) : ticket && (
                        <div style={{ display: 'flex', flexDirection: 'column', flex: '1 1 0%', minHeight: 0 }}>
                            {/* ─── Header ─── */}
                            <div className="p-5 border-b border-slate-800" style={{ flexShrink: 0 }}>
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[10px] font-mono text-slate-500 mb-1 tracking-wide">
                                            #{ticketId.slice(-8).toUpperCase()}
                                        </p>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={editData.title}
                                                onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                                                className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-bold text-lg focus:ring-2 focus:ring-blue-500/50 focus:outline-none"
                                            />
                                        ) : (
                                            <h2 className="text-lg font-bold text-white leading-tight truncate">{ticket.title}</h2>
                                        )}
                                    </div>
                                    <button onClick={onClose} className="p-2 text-slate-500 hover:text-white hover:bg-slate-800 rounded-lg ml-3 transition-colors">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* Status / Priority / SLA Badges */}
                                <div className="flex items-center gap-2 flex-wrap">
                                    {ticket.status && (
                                        <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide ${statusConfig[ticket.status]?.bg} ${statusConfig[ticket.status]?.color}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${statusConfig[ticket.status]?.dot}`} />
                                            {statusConfig[ticket.status]?.label}
                                        </span>
                                    )}
                                    {ticket.priority && (
                                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide border ${priorityConfig[ticket.priority]?.bg} ${priorityConfig[ticket.priority]?.color} ${priorityConfig[ticket.priority]?.border}`}>
                                            {priorityConfig[ticket.priority]?.label || ticket.priority}
                                        </span>
                                    )}
                                    {ticket.is_escalated && (
                                        <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center gap-1">
                                            <ShieldAlert className="w-3 h-3" /> ESCALATED
                                        </span>
                                    )}
                                    {ticket.category && (
                                        <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide bg-slate-800 text-slate-400 border border-slate-700">
                                            {ticket.category}
                                        </span>
                                    )}
                                    {sla && (
                                        <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold ml-auto ${sla.isBreached
                                            ? 'bg-red-500/15 text-red-400 border border-red-500/25'
                                            : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25'
                                            }`}>
                                            <Timer className="w-3 h-3" />
                                            {sla.isBreached ? `Breached ${sla.hoursLeft}h ${sla.minsLeft}m ago` : `${sla.hoursLeft}h ${sla.minsLeft}m left`}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* ─── Quick Actions Bar ─── */}
                            {(canChangeStatus || isManager || canEdit || (isCustomer && ticket.status !== 'RESOLVED' && !ticket.is_escalated)) && (
                                <div className="px-5 py-3 border-b border-slate-800 flex items-center justify-between bg-slate-900/30" style={{ flexShrink: 0 }}>
                                    <div className="flex items-center gap-2 flex-wrap">
                                        {canChangeStatus && nextStatuses.length > 0 && (
                                            nextStatuses.map(ns => (
                                                <button
                                                    key={ns}
                                                    onClick={() => handleStatusChange(ns)}
                                                    disabled={updating}
                                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${ns === 'RESOLVED' ? 'bg-emerald-600 hover:bg-emerald-500 text-white' :
                                                        ns === 'IN_PROGRESS' ? 'bg-blue-600 hover:bg-blue-500 text-white' :
                                                            ns === 'CLOSED' ? 'bg-slate-700 hover:bg-slate-600 text-slate-300' :
                                                                'bg-slate-800 hover:bg-slate-700 text-slate-300'
                                                        } disabled:opacity-50`}
                                                >
                                                    <ArrowRight className="w-3 h-3" />
                                                    {ns === 'IN_PROGRESS' ? 'Start Work' :
                                                        ns === 'RESOLVED' ? 'Resolve' :
                                                            ns === 'CLOSED' ? 'Close' : ns.replace('_', ' ')}
                                                </button>
                                            ))
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {isManager && (
                                            <div className="relative">
                                                <button
                                                    onClick={() => setShowAssignDropdown(!showAssignDropdown)}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-all"
                                                >
                                                    <UserCheck className="w-3 h-3" />
                                                    {ticket.assigned_to ? 'Reassign' : 'Assign'}
                                                </button>
                                                {showAssignDropdown && (
                                                    <div className="absolute right-0 top-full mt-2 w-64 bg-[#0F172A] border border-slate-700 rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto">
                                                        {staffList.length === 0 ? (
                                                            <p className="p-4 text-slate-500 text-xs text-center">No agents available</p>
                                                        ) : (
                                                            staffList.map(emp => (
                                                                <button
                                                                    key={emp.id}
                                                                    onClick={() => handleAssign(emp.id)}
                                                                    disabled={assigning}
                                                                    className="w-full flex items-center gap-3 p-3 hover:bg-slate-800 text-left transition-colors disabled:opacity-50"
                                                                >
                                                                    <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                                                                        {emp.name.charAt(0)}
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-white text-sm font-semibold">{emp.name}</p>
                                                                        <p className="text-slate-500 text-xs">{emp.current_load || 0} active tickets</p>
                                                                    </div>
                                                                </button>
                                                            ))
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* Escalate Button for Customer */}
                                        {isCustomer && ticket.status !== 'RESOLVED' && !ticket.is_escalated && (
                                            <button
                                                onClick={handleEscalate}
                                                disabled={escalating}
                                                className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg text-xs font-bold transition-all border border-rose-500/20 disabled:opacity-50"
                                            >
                                                {escalating ? <Loader2 className="w-3 h-3 animate-spin" /> : <ShieldAlert className="w-3 h-3" />}
                                                Escalate to Management
                                            </button>
                                        )}

                                        {canEdit && !isEditing && (
                                            <button
                                                onClick={() => setIsEditing(true)}
                                                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-bold transition-all"
                                            >
                                                <Edit2 className="w-3 h-3" /> Edit
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* ─── Tabs ─── */}
                            <div className="px-5 border-b border-slate-800 flex gap-1" style={{ flexShrink: 0 }}>
                                {[
                                    { id: 'conversation', label: 'Conversation', icon: MessageSquare, count: totalMessages },
                                    { id: 'details', label: 'Details', icon: Zap },
                                    { id: 'history', label: 'History', icon: History }
                                ].map(tab => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center gap-1.5 px-4 py-3 text-xs font-bold border-b-2 transition-all ${activeTab === tab.id
                                            ? 'border-blue-500 text-blue-400'
                                            : 'border-transparent text-slate-500 hover:text-slate-300'
                                            }`}
                                    >
                                        <tab.icon className="w-3.5 h-3.5" /> {tab.label}
                                        {tab.count > 0 && (
                                            <span className={`ml-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold ${activeTab === tab.id ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-800 text-slate-500'
                                                }`}>{tab.count}</span>
                                        )}
                                    </button>
                                ))}
                            </div>

                            {/* ─── Tab Content ─── */}
                            <div style={{ position: 'relative', flex: '1 1 0%', minHeight: 0 }}>

                                {/* ═══ CONVERSATION TAB ═══ */}
                                {activeTab === 'conversation' && (
                                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column' }}>

                                        {/* ─── Message Feed ─── */}
                                        <div
                                            className="custom-scrollbar"
                                            style={{ flex: '1 1 0%', overflowY: 'auto', padding: '20px', minHeight: 0 }}
                                        >
                                            {/* Empty State */}
                                            {visibleComments.length === 0 && !ticket?.description ? (
                                                <div className="flex flex-col items-center justify-center py-16">
                                                    <div className="w-16 h-16 rounded-2xl bg-slate-800/80 flex items-center justify-center mb-5">
                                                        <MessageCircle className="w-8 h-8 text-slate-600" />
                                                    </div>
                                                    <h4 className="text-sm font-bold text-slate-400 mb-1">No replies yet</h4>
                                                    <p className="text-xs text-slate-500 text-center max-w-[240px]">
                                                        Start the conversation by sending a message below.
                                                    </p>
                                                </div>
                                            ) : (
                                                <div className="space-y-5">
                                                    {/* ── Original Description ── */}
                                                    <MessageBubble
                                                        author={ticket.created_by?.name}
                                                        role={ticket.created_by?.role || 'CUSTOMER'}
                                                        content={ticket.description}
                                                        timestamp={ticket.created_at}
                                                        isMe={ticket.created_by?.email === currentUser?.email}
                                                        isInternal={false}
                                                        index={0}
                                                    />

                                                    {/* ── System: Ticket Created ── */}
                                                    <SystemEvent
                                                        text={`Ticket created • ${ticket.category || 'General'} • ${priorityConfig[ticket.priority]?.label || ticket.priority} priority`}
                                                        timestamp={ticket.created_at}
                                                    />

                                                    {/* ── Comments ── */}
                                                    {visibleComments.map((comment, idx) => (
                                                        <MessageBubble
                                                            key={comment.id}
                                                            author={comment.author?.name}
                                                            role={comment.author?.role || 'CUSTOMER'}
                                                            content={comment.content}
                                                            timestamp={comment.created_at}
                                                            isInternal={comment.is_internal}
                                                            isMe={comment.author?.email === currentUser?.email || comment.author?.name === currentUser?.name}
                                                            index={idx + 1}
                                                        />
                                                    ))}
                                                </div>
                                            )}
                                            <div ref={chatEndRef} />
                                        </div>

                                        {/* ─── Compose Area ─── */}
                                        <div className="border-t border-slate-800 bg-[#0B1120]" style={{ flexShrink: 0 }}>
                                            {/* Internal/Public Toggle (staff only) */}
                                            {(isManager || isEmployee) && (
                                                <div className="px-4 pt-3 pb-1 flex items-center gap-2">
                                                    <button
                                                        onClick={() => setIsInternal(false)}
                                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wide transition-all ${!isInternal
                                                            ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-sm shadow-blue-500/10'
                                                            : 'bg-slate-800/50 text-slate-500 border border-transparent hover:text-slate-300 hover:bg-slate-800'
                                                            }`}
                                                    >
                                                        <Globe className="w-3 h-3" /> Public Reply
                                                    </button>
                                                    <button
                                                        onClick={() => setIsInternal(true)}
                                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wide transition-all ${isInternal
                                                            ? 'bg-amber-600/20 text-amber-400 border border-amber-500/30 shadow-sm shadow-amber-500/10'
                                                            : 'bg-slate-800/50 text-slate-500 border border-transparent hover:text-slate-300 hover:bg-slate-800'
                                                            }`}
                                                    >
                                                        <Lock className="w-3 h-3" /> Internal Note
                                                    </button>

                                                    {/* Quick Reply Toggle */}
                                                    <button
                                                        onClick={() => setShowQuickReplies(!showQuickReplies)}
                                                        className={`ml-auto flex items-center gap-1 px-2 py-1.5 rounded-lg text-[10px] font-bold transition-all ${showQuickReplies ? 'bg-slate-700 text-white' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'
                                                            }`}
                                                    >
                                                        <ChevronDown className={`w-3 h-3 transition-transform ${showQuickReplies ? 'rotate-180' : ''}`} />
                                                        Templates
                                                    </button>
                                                </div>
                                            )}

                                            {/* Quick Replies Dropdown */}
                                            <AnimatePresence>
                                                {showQuickReplies && (isManager || isEmployee) && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: 'auto', opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        className="overflow-hidden"
                                                    >
                                                        <div className="px-4 py-2 flex flex-wrap gap-1.5">
                                                            {quickReplies.map((qr, i) => (
                                                                <button
                                                                    key={i}
                                                                    onClick={() => { setNewComment(qr); setShowQuickReplies(false); }}
                                                                    className="px-3 py-1.5 bg-slate-800/80 text-slate-400 text-[11px] font-medium rounded-lg border border-slate-700/50 hover:bg-slate-700 hover:text-white transition-all truncate max-w-[200px]"
                                                                >
                                                                    {qr}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>

                                            {/* Input Row */}
                                            <div className="p-4 pt-2">
                                                <div className={`flex items-end gap-2 p-2 rounded-2xl border transition-all ${isInternal
                                                    ? 'bg-amber-500/5 border-amber-500/20'
                                                    : 'bg-slate-900/80 border-slate-700/50'
                                                    } focus-within:border-blue-500/40 focus-within:shadow-lg focus-within:shadow-blue-500/5`}>
                                                    {/* Attach Icon (UI only) */}
                                                    <button className="p-2 text-slate-500 hover:text-slate-300 rounded-lg hover:bg-slate-800 transition-colors shrink-0">
                                                        <Paperclip className="w-4 h-4" />
                                                    </button>

                                                    {/* Auto-expanding Textarea */}
                                                    <textarea
                                                        ref={textareaRef}
                                                        value={newComment}
                                                        onChange={(e) => setNewComment(e.target.value)}
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                                e.preventDefault();
                                                                handleSendComment();
                                                            }
                                                        }}
                                                        placeholder={
                                                            isInternal
                                                                ? "Write an internal note (not visible to customer)…"
                                                                : isCustomer
                                                                    ? "Type your reply…"
                                                                    : "Type your reply to the customer…"
                                                        }
                                                        rows={1}
                                                        className="flex-1 bg-transparent text-[13px] text-white placeholder-slate-500 focus:outline-none resize-none py-2 leading-relaxed"
                                                        style={{ maxHeight: '120px' }}
                                                    />

                                                    {/* Emoji (UI only) */}
                                                    <button className="p-2 text-slate-500 hover:text-slate-300 rounded-lg hover:bg-slate-800 transition-colors shrink-0">
                                                        <Smile className="w-4 h-4" />
                                                    </button>

                                                    {/* Send Button */}
                                                    <motion.button
                                                        onClick={handleSendComment}
                                                        disabled={sendingComment || !newComment.trim()}
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        className={`p-2.5 rounded-xl font-bold text-white disabled:opacity-20 transition-all shrink-0 ${isInternal
                                                            ? 'bg-amber-600 hover:bg-amber-500 shadow-lg shadow-amber-600/20'
                                                            : 'bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/20'
                                                            }`}
                                                    >
                                                        {sendingComment
                                                            ? <Loader2 className="w-4 h-4 animate-spin" />
                                                            : <Send className="w-4 h-4" />
                                                        }
                                                    </motion.button>
                                                </div>

                                                {/* Shift+Enter hint */}
                                                <p className="text-[9px] text-slate-600 mt-1.5 px-1">
                                                    Press <kbd className="px-1 py-0.5 bg-slate-800 text-slate-500 rounded text-[8px] font-mono">Enter</kbd> to send
                                                    · <kbd className="px-1 py-0.5 bg-slate-800 text-slate-500 rounded text-[8px] font-mono">Shift+Enter</kbd> for new line
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* ═══ DETAILS TAB ═══ */}
                                {activeTab === 'details' && (
                                    <div className="p-5 space-y-5" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflowY: 'auto' }}>
                                        {/* Description */}
                                        <div>
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2 block">Description</label>
                                            {isEditing ? (
                                                <div className="space-y-3">
                                                    <textarea
                                                        value={editData.description}
                                                        onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                                                        rows="5"
                                                        className="w-full p-3 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm focus:ring-2 focus:ring-blue-500/50 focus:outline-none resize-none"
                                                    />
                                                    <div className="flex gap-2">
                                                        <button onClick={handleUpdate} disabled={updating}
                                                            className="px-4 py-2 bg-blue-600 text-white font-bold rounded-lg text-sm hover:bg-blue-500 disabled:opacity-50 flex items-center gap-2">
                                                            {updating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save Changes
                                                        </button>
                                                        <button onClick={() => { setIsEditing(false); setEditData({ title: ticket.title, description: ticket.description }); }}
                                                            className="px-4 py-2 bg-slate-800 text-slate-300 font-bold rounded-lg text-sm hover:bg-slate-700 flex items-center gap-2">
                                                            <RotateCcw className="w-4 h-4" /> Cancel
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-lg text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                                                    {ticket.description}
                                                </div>
                                            )}
                                        </div>

                                        {/* Meta Grid */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-lg">
                                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Created By</p>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-7 h-7 rounded-full bg-purple-600 flex items-center justify-center text-white text-xs font-bold">
                                                        {ticket.created_by?.name?.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-white">{ticket.created_by?.name}</p>
                                                        <p className="text-[10px] text-slate-500">{ticket.created_by?.email}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-lg">
                                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Assigned To</p>
                                                {ticket.assigned_to ? (
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                                                            {ticket.assigned_to?.name?.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold text-white">{ticket.assigned_to?.name}</p>
                                                            <p className="text-[10px] text-slate-500">{ticket.assigned_to?.email}</p>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <p className="text-sm text-slate-500 italic">Unassigned</p>
                                                )}
                                            </div>
                                            <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-lg">
                                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Created</p>
                                                <p className="text-sm font-semibold text-white">
                                                    {format(new Date(ticket.created_at), 'MMM d, yyyy')}
                                                </p>
                                                <p className="text-[10px] text-slate-500">{formatDistanceToNow(new Date(ticket.created_at), { addSuffix: true })}</p>
                                            </div>
                                            <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-lg">
                                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">SLA Deadline</p>
                                                {sla ? (
                                                    <>
                                                        <p className="text-sm font-semibold text-white">{format(sla.due, 'MMM d, h:mm a')}</p>
                                                        <p className={`text-[10px] font-bold ${sla.isBreached ? 'text-red-400' : 'text-emerald-400'}`}>
                                                            {sla.isBreached ? `Breached ${sla.hoursLeft}h ${sla.minsLeft}m ago` : `${sla.hoursLeft}h ${sla.minsLeft}m remaining`}
                                                        </p>
                                                    </>
                                                ) : (
                                                    <p className="text-sm text-slate-500 italic">No SLA set</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* ═══ HISTORY TAB ═══ */}
                                {activeTab === 'history' && (
                                    <div className="p-5 space-y-4" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflowY: 'auto' }}>
                                        {ticket.history?.length === 0 ? (
                                            <p className="text-center py-12 text-slate-500 text-sm">No history yet</p>
                                        ) : (
                                            ticket.history?.map((entry, idx) => (
                                                <div key={idx} className="relative pl-7 pb-4 last:pb-0">
                                                    {idx !== ticket.history.length - 1 && (
                                                        <div className="absolute left-[9px] top-6 bottom-0 w-px bg-slate-800" />
                                                    )}
                                                    <div className="absolute left-0 top-1.5 w-[18px] h-[18px] rounded-full bg-slate-900 border-2 border-slate-700 flex items-center justify-center">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                                                    </div>
                                                    <div className="flex items-start justify-between">
                                                        <div>
                                                            <p className="text-sm font-bold text-white">
                                                                {entry.action.replace(/_/g, ' ')}
                                                            </p>
                                                            <div className="flex items-center gap-1.5 mt-0.5 mb-1">
                                                                <div className="w-4 h-4 rounded-full bg-slate-800 flex items-center justify-center">
                                                                    <User className="w-2.5 h-2.5 text-slate-500" />
                                                                </div>
                                                                <p className="text-xs text-slate-500 font-semibold">{entry.performed_by?.name || 'System'}</p>
                                                            </div>
                                                            {entry.details && (
                                                                <p className="text-xs text-slate-400 bg-slate-900/60 p-2 rounded border border-slate-800 mt-1">{entry.details}</p>
                                                            )}
                                                        </div>
                                                        <span className="text-[10px] text-slate-600 font-mono">
                                                            {format(new Date(entry.timestamp), 'MMM d, h:mm a')}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
