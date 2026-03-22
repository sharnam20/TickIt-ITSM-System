import { useState } from 'react';
import { motion } from 'framer-motion';
import { Ticket, PlusCircle } from 'lucide-react';
import TicketList from '../components/TicketList';
import CreateTicketModal from '../components/CreateTicketModal'; // Standardized import

export default function Tickets() {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const handleCreateSuccess = () => {
        setIsCreateOpen(false);
        setRefreshTrigger(prev => prev + 1);
    };

    return (
        <div className="space-y-8 p-2">
            <CreateTicketModal
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
                onCreated={handleCreateSuccess}
            />

            {/* Premium Header */}
            <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4 mb-6">
                <div>
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                        <span className="text-gradient">Task & Ticket Manager</span>
                    </h1>
                    <p className="text-slate-500 font-medium mt-1">Centralized queue for all ongoing support requests.</p>
                </div>
                <button
                    onClick={() => setIsCreateOpen(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/30 hover:scale-[1.02] active:scale-95 transition-all"
                >
                    <PlusCircle className="w-5 h-5" /> New Request
                </button>
            </div>

            {/* List with Refresh Trigger */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                <div className="glass p-6 rounded-3xl premium-shadow">
                    <TicketList refreshTrigger={refreshTrigger} />
                </div>
            </motion.div>
        </div>
    );
}
