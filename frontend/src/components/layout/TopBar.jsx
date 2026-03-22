import { Search } from 'lucide-react';
import NotificationBell from '../ui/NotificationBell';

export default function TopBar() {
    return (
        <header className="h-20 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8 sticky top-0 z-40 transition-colors duration-300">
            {/* Search Bar Placeholder */}
            <div className="flex-1 max-w-md hidden md:block">
                <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search tickets, knowledge base..."
                        className="w-full bg-slate-100 dark:bg-slate-900 border-none rounded-2xl py-2.5 pl-10 pr-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                    />
                </div>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-4 ml-auto">
                <NotificationBell />
                <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-800 mx-2 hidden sm:block" />
                <div className="hidden sm:flex flex-col items-end">
                    <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">System Status</span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">All Systems Operational</span>
                    </div>
                </div>
            </div>
        </header>
    );
}
