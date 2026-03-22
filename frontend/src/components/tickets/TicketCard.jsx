import { motion } from 'framer-motion';
import { Clock, AlertTriangle, Shield, User, Calendar, ArrowRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const priorityColors = {
    LOW: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800',
    MEDIUM: 'text-amber-500 bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-800',
    HIGH: 'text-red-500 bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-900/30'
};

const statusColors = {
    OPEN: 'text-slate-500 bg-slate-100 dark:bg-slate-800',
    IN_PROGRESS: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20',
    RESOLVED: 'text-green-500 bg-green-50 dark:bg-green-900/20',
    CLOSED: 'text-slate-700 bg-slate-200 dark:bg-slate-700'
};

export default function TicketCard({ ticket, onClick }) {
    const isOverdue = new Date(ticket.sla_due_at) < new Date() && ticket.status !== 'RESOLVED' && ticket.status !== 'CLOSED';

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4 }}
            onClick={() => onClick(ticket)}
            className="group relative bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-xl hover:border-blue-200 dark:hover:border-blue-900/50 transition-all cursor-pointer overflow-hidden"
        >
            {/* SLA Indicator Line */}
            <div className={`absolute top-0 left-0 w-1 h-full ${isOverdue ? 'bg-red-500' : 'bg-blue-500'}`} />

            <div className="flex justify-between items-start mb-3">
                <div className="flex gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase border ${priorityColors[ticket.priority]}`}>
                        {ticket.priority}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase ${statusColors[ticket.status]}`}>
                        {ticket.status.replace('_', ' ')}
                    </span>
                </div>
                <span className="text-[10px] font-medium text-slate-400 tabular-nums">
                    #{ticket.id.slice(-6).toUpperCase()}
                </span>
            </div>

            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2 line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {ticket.title}
            </h3>

            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 line-clamp-2 leading-relaxed">
                {ticket.description}
            </p>

            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-50 dark:border-slate-700/50">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                        <User className="w-3.5 h-3.5 text-slate-500" />
                    </div>
                    <span className="text-xs font-medium text-slate-600 dark:text-slate-400 truncate">
                        {ticket.created_by?.name || 'User'}
                    </span>
                </div>

                <div className="flex items-center gap-2 justify-end">
                    <Clock className={`w-3.5 h-3.5 ${isOverdue ? 'text-red-500' : 'text-slate-400'}`} />
                    <span className={`text-[11px] font-semibold ${isOverdue ? 'text-red-500' : 'text-slate-500'}`}>
                        {ticket.status === 'RESOLVED' ? 'Resolved' : formatDistanceToNow(new Date(ticket.sla_due_at), { addSuffix: true })}
                    </span>
                </div>
            </div>

            <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowRight className="w-4 h-4 text-blue-500" />
            </div>
        </motion.div>
    );
}
