import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, CheckCircle2, Info, AlertCircle, Clock, MessageSquare, ChevronRight } from 'lucide-react';
import { notificationService } from '../../services/notificationService';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '../../lib/utils';

export default function NotificationBell() {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const dropdownRef = useRef(null);

    const fetchNotifications = async () => {
        try {
            const result = await notificationService.getNotifications();
            if (result.success) {
                setNotifications(result.data.notifications || []);
                setUnreadCount(result.data.unread_count || 0);
            }
        } catch (err) {
            console.error('[NOTIF] Fetch failed:', err);
        }
    };

    useEffect(() => {
        fetchNotifications();
        // Poll every 30 seconds for new notifications
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleMarkAllRead = async () => {
        await notificationService.markAllRead();
        setUnreadCount(0);
        setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    };

    const handleNotifClick = async (notif) => {
        if (!notif.is_read) {
            await notificationService.markRead(notif.id);
            setUnreadCount(prev => Math.max(0, prev - 1));
            setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, is_read: true } : n));
        }
        setIsOpen(false);
        // Navigate if link exists (using window.location for simplicity in this component)
        if (notif.link) window.location.href = notif.link;
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-blue-500 dark:hover:text-blue-400 transition-all relative group"
            >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full animate-pulse border-2 border-white dark:border-slate-800">
                        {unreadCount}
                    </span>
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-3 w-80 md:w-96 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-50"
                    >
                        {/* Header */}
                        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
                            <h3 className="font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                                Notifications
                                {unreadCount > 0 && <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] rounded-full uppercase tracking-tighter">New</span>}
                            </h3>
                            {unreadCount > 0 && (
                                <button
                                    onClick={handleMarkAllRead}
                                    className="text-xs font-bold text-blue-500 hover:text-blue-600 transition-colors"
                                >
                                    Mark all read
                                </button>
                            )}
                        </div>

                        {/* Feed */}
                        <div className="max-h-[450px] overflow-y-auto custom-scrollbar">
                            {notifications.length === 0 ? (
                                <div className="p-12 text-center">
                                    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-3xl flex items-center justify-center mx-auto mb-4">
                                        <Bell className="w-8 h-8 text-slate-300 dark:text-slate-600" />
                                    </div>
                                    <p className="text-slate-500 font-medium">No activity yet</p>
                                    <p className="text-xs text-slate-400 mt-1">Updates will appear here</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-slate-50 dark:divide-slate-800">
                                    {notifications.map((n) => (
                                        <button
                                            key={n.id}
                                            onClick={() => handleNotifClick(n)}
                                            className={cn(
                                                "w-full p-4 flex gap-4 text-left transition-all hover:bg-slate-50 dark:hover:bg-slate-800/50 relative group",
                                                !n.is_read && "bg-blue-50/30 dark:bg-blue-900/5"
                                            )}
                                        >
                                            {!n.is_read && <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500" />}
                                            <div className={cn(
                                                "w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm",
                                                n.is_read ? "bg-slate-100 dark:bg-slate-800 text-slate-400" : "bg-blue-100 dark:bg-blue-900/30 text-blue-500"
                                            )}>
                                                {n.title.toLowerCase().includes('status') ? <CheckCircle2 className="w-5 h-5" /> :
                                                    n.title.toLowerCase().includes('priority') ? <AlertCircle className="w-5 h-5" /> :
                                                        <Info className="w-5 h-5" />}
                                            </div>
                                            <div className="flex-1 overflow-hidden">
                                                <p className={cn("text-xs font-bold mb-1", n.is_read ? "text-slate-500" : "text-slate-900 dark:text-white")}>
                                                    {n.title}
                                                </p>
                                                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed truncate">
                                                    {n.message}
                                                </p>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <Clock className="w-3 h-3 text-slate-300" />
                                                    <span className="text-[10px] font-medium text-slate-400">
                                                        {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <ChevronRight className="w-4 h-4 text-slate-300" />
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-4 bg-slate-50/50 dark:bg-slate-900/50 text-center border-t border-slate-100 dark:border-slate-800">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">End of Activity Feed</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
