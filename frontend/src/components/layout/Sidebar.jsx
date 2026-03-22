// Enterprise Sidebar.jsx — Light/Dark Theme Aware
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { cn } from '../../lib/utils';
import {
    LayoutDashboard,
    Ticket,
    Users,
    BarChart3,
    Settings,
    LogOut,
    ChevronLeft,
    ChevronRight,
    Sun,
    Moon,
    Shield,
    BookOpen
} from 'lucide-react';

export default function Sidebar() {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [collapsed, setCollapsed] = useState(false);

    const role = user?.role || 'CUSTOMER';
    const isDark = theme === 'dark';

    const links = [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, roles: ['CUSTOMER', 'EMPLOYEE', 'MANAGER'] },
        { name: 'My Tickets', href: '/tickets', icon: Ticket, roles: ['CUSTOMER'] },
        { name: 'Assigned Tickets', href: '/assigned-tickets', icon: Ticket, roles: ['EMPLOYEE'] },
        { name: 'All Tickets', href: '/all-tickets', icon: Ticket, roles: ['MANAGER'] },
        { name: 'Team', href: '/team', icon: Users, roles: ['MANAGER'] },
        { name: 'Analytics', href: '/analytics', icon: BarChart3, roles: ['MANAGER'] },
        { name: 'Knowledge Base', href: '/knowledge-base', icon: BookOpen, roles: ['CUSTOMER', 'EMPLOYEE', 'MANAGER'] },
        { name: 'Settings', href: '/settings', icon: Settings, roles: ['CUSTOMER', 'EMPLOYEE', 'MANAGER'] },
    ];

    const filteredLinks = links.filter(link => link.roles.includes(role));

    return (
        <div className={cn(
            "h-screen transition-all duration-300 flex flex-col relative border-r overflow-hidden",
            isDark
                ? "bg-[#0B1120] border-slate-800 text-slate-300"
                : "bg-white border-slate-200 text-slate-600",
            collapsed ? "w-20" : "w-72"
        )}>

            {/* Enterprise Brand Header */}
            <div className={cn("p-6 border-b flex items-center gap-4 mb-2", isDark ? "border-slate-800/50" : "border-slate-200")}>
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shrink-0 shadow-sm">
                    <Shield className="text-white w-5 h-5" />
                </div>
                {!collapsed && (
                    <div>
                        <h1 className={cn("font-semibold text-base tracking-tight leading-none", isDark ? "text-white" : "text-slate-900")}>IT Operations</h1>
                        <span className={cn("text-[10px] uppercase font-medium tracking-wide", isDark ? "text-slate-500" : "text-slate-400")}>Enterprise Console</span>
                    </div>
                )}
            </div>

            {/* Toggle Button */}
            <button
                onClick={() => setCollapsed(!collapsed)}
                className={cn(
                    "absolute -right-3 top-8 rounded-full p-1 shadow-md transition-all z-50",
                    isDark
                        ? "bg-slate-800 border border-slate-700 text-slate-400 hover:bg-slate-700 hover:text-white"
                        : "bg-white border border-slate-200 text-slate-400 hover:bg-slate-50 hover:text-slate-700 shadow-lg"
                )}
            >
                {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
            </button>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto custom-scrollbar">
                {filteredLinks.map((link) => (
                    <NavLink
                        key={link.name}
                        to={link.href}
                        className={({ isActive }) => cn(
                            "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative select-none",
                            isActive
                                ? isDark
                                    ? "bg-slate-800/80 text-white font-medium shadow-sm border border-slate-700/50"
                                    : "bg-blue-50 text-blue-700 font-medium shadow-sm border border-blue-100"
                                : isDark
                                    ? "text-slate-400 hover:bg-slate-800/40 hover:text-slate-200"
                                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                        )}
                    >
                        {({ isActive }) => (
                            <>
                                <link.icon size={18} className={cn(
                                    "shrink-0 transition-colors",
                                    isActive
                                        ? "text-blue-500"
                                        : isDark
                                            ? "text-slate-400 group-hover:text-slate-300"
                                            : "text-slate-400 group-hover:text-slate-600",
                                    collapsed && "mx-auto"
                                )} />

                                {!collapsed && (
                                    <span className="text-sm tracking-normal">{link.name}</span>
                                )}

                                {/* Hover Tooltip for collapsed state */}
                                {collapsed && (
                                    <div className={cn(
                                        "absolute left-14 px-3 py-1.5 rounded text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-xl",
                                        isDark
                                            ? "bg-slate-900 text-white border border-slate-700"
                                            : "bg-white text-slate-800 border border-slate-200 shadow-lg"
                                    )}>
                                        {link.name}
                                    </div>
                                )}
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* User Profile Footer */}
            <div className={cn("p-4 border-t", isDark ? "border-slate-800/50 bg-[#080d19]/50" : "border-slate-200 bg-slate-50")}>
                <div className={cn("flex items-center gap-3", collapsed ? "justify-center" : "")}>
                    <div className="relative shrink-0">
                        <div className={cn(
                            "w-8 h-8 rounded flex items-center justify-center text-xs font-bold border",
                            isDark ? "bg-slate-700 text-white border-slate-600" : "bg-blue-100 text-blue-700 border-blue-200"
                        )}>
                            {user?.name?.[0] || 'U'}
                        </div>
                        <div className={cn(
                            "absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 rounded-full",
                            isDark ? "border-[#0B1120]" : "border-white"
                        )}></div>
                    </div>

                    {!collapsed && (
                        <div className="flex-1 overflow-hidden">
                            <p className={cn("text-sm font-medium truncate", isDark ? "text-slate-200" : "text-slate-800")}>{user?.name || 'User'}</p>
                            <p className={cn("text-[10px] truncate capitalize", isDark ? "text-slate-500" : "text-slate-400")}>{role.toLowerCase()}</p>
                        </div>
                    )}

                    {!collapsed && (
                        <div className="flex items-center gap-1">
                            <button onClick={toggleTheme} className={cn(
                                "p-1.5 rounded transition-colors",
                                isDark ? "text-slate-500 hover:text-white" : "text-slate-400 hover:text-slate-700"
                            )} title="Toggle Theme">
                                {isDark ? <Sun size={16} /> : <Moon size={16} />}
                            </button>
                            <button onClick={logout} className={cn(
                                "p-1.5 rounded transition-colors",
                                isDark ? "text-slate-500 hover:text-red-400" : "text-slate-400 hover:text-red-500"
                            )} title="Sign Out">
                                <LogOut size={16} />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
