import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, UserPlus } from 'lucide-react';
import TeamTable from '../components/TeamTable';

export default function Team() {
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    return (
        <div className="space-y-8 p-2">
            {/* Premium Header */}
            <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4 mb-6">
                <div>
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                        <Users className="w-10 h-10 text-indigo-500" />
                        <span className="text-gradient">Team Directory</span>
                    </h1>
                    <p className="text-slate-500 font-medium mt-1">Manage workforce and user permissions.</p>
                </div>
                {/* 
                <button
                    onClick={() => {}} // TODO: Add create user modal
                    className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/30 hover:scale-[1.02] active:scale-95 transition-all"
                >
                    <UserPlus className="w-5 h-5" /> Add Member
                </button>
                */}
            </div>

            {/* Content Area */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                <div className="glass p-6 rounded-3xl premium-shadow">
                    <TeamTable refreshTrigger={refreshTrigger} />
                </div>
            </motion.div>
        </div>
    );
}
