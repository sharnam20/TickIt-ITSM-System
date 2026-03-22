import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Briefcase, Ticket, CheckCircle2, AlertCircle, Zap,
    Wifi, WifiOff, Coffee, Loader2, Plus, X, Wrench, Save
} from 'lucide-react';
import TicketList from '../../components/TicketList';
import { userService } from '../../services/userService';
import { ticketService } from '../../services/ticketService';
import { PersonalPerformance, WorkloadAnalytics, BreachRadar } from '../../components/dashboard/EmployeeEnterprise';
import { LayoutDashboard } from 'lucide-react';

const AgentStatCard = ({ label, value, subtext, icon: Icon, color }) => (
    <div className={`bg-[#0B1120] border border-slate-800 rounded-xl p-5 flex items-start justify-between shadow-sm relative overflow-hidden group hover:border-${color}-500/30 transition-all`}>
        <div>
            <p className="text-sm font-medium text-slate-400 uppercase tracking-wide">{label}</p>
            <h3 className="text-3xl font-extrabold text-white mt-1 group-hover:scale-105 transition-transform origin-left">{value}</h3>
            {subtext && <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">{subtext}</p>}
        </div>
        <div className={`p-3 rounded-lg bg-${color}-500/10 text-${color}-500`}>
            <Icon className="w-5 h-5" />
        </div>
    </div>
);

const ALL_SKILLS = ['Network', 'Hardware', 'Software', 'Security', 'Account', 'General'];

const SkillsManager = ({ currentSkills, onUpdate }) => {
    const [skills, setSkills] = useState(currentSkills);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const changed = JSON.stringify(skills.sort()) !== JSON.stringify(currentSkills.sort());

    useEffect(() => { setSkills(currentSkills); }, [currentSkills]);

    const toggleSkill = (skill) => {
        setSkills(prev =>
            prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
        );
        setSaved(false);
    };

    const handleSave = async () => {
        setSaving(true);
        const res = await userService.updateSkills(skills);
        if (res.success) {
            onUpdate(res.data.skills || skills);
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
        }
        setSaving(false);
    };

    return (
        <div className="bg-[#0B1120] border border-slate-800 rounded-xl p-5 mb-8">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Wrench className="w-4 h-4 text-purple-500" />
                    My Skills & Competencies
                </h3>
                {changed && (
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-4 py-1.5 bg-purple-600 text-white text-xs font-bold rounded-lg hover:bg-purple-500 disabled:opacity-50 flex items-center gap-2 transition-all"
                    >
                        {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                        Save
                    </button>
                )}
                {saved && (
                    <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Saved!
                    </span>
                )}
            </div>
            <p className="text-xs text-slate-500 mb-4">Select the categories you're skilled in. Tickets matching your skills will be auto-assigned to you.</p>
            <div className="flex flex-wrap gap-2">
                {ALL_SKILLS.map(skill => {
                    const active = skills.includes(skill);
                    return (
                        <button
                            key={skill}
                            onClick={() => toggleSkill(skill)}
                            className={`px-4 py-2 rounded-lg text-sm font-bold border transition-all flex items-center gap-2 ${
                                active
                                    ? 'bg-purple-600/20 border-purple-500/50 text-purple-300 shadow-md shadow-purple-900/10'
                                    : 'bg-slate-900 border-slate-700 text-slate-500 hover:border-slate-600 hover:text-slate-300'
                            }`}
                        >
                            {active ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                            {skill}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default function EmployeeDashboard() {
    const [activeTab, setActiveTab] = useState('assigned');
    const [userProfile, setUserProfile] = useState(null);
    const [status, setStatus] = useState('OFFLINE');
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const [userRes, ticketRes] = await Promise.all([
            userService.getMe(),
            ticketService.getMyTickets() // Gets assigned tickets
        ]);

        if (userRes.success) {
            setUserProfile(userRes.data);
            if (userRes.data.status) setStatus(userRes.data.status);
        }

        if (ticketRes.success) {
            setTickets(ticketRes.data || []);
        }

        setLoading(false);
    };

    const handleStatusChange = async (newStatus) => {
        setStatus(newStatus); // Optimistic update
        await userService.updateStatus(newStatus);
        // loadProfile(); // Optional: specific refresh if needed
    };

    const tabs = [
        { id: 'overview', label: 'Performance', icon: LayoutDashboard },
        { id: 'assigned', label: 'My Queue', icon: Briefcase },
        { id: 'all', label: 'Team Inbox', icon: Ticket },
        { id: 'resolved', label: 'Resolved', icon: CheckCircle2 },
    ];

    const getStatusColor = (s) => {
        if (s === 'AVAILABLE') return 'emerald';
        if (s === 'ON_LEAVE') return 'amber';
        return 'slate';
    };

    const statusColor = getStatusColor(status);

    return (
        <div className="space-y-6 p-2">
            {/* Header with Status Toggle */}
            <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-6 gap-4 border-b border-slate-800 pb-6">
                <div>
                    <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                            Agent Workspace
                        </span>
                    </h1>
                    <div className="flex items-center gap-4 mt-4">
                        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-1 rounded-lg">
                            <button
                                onClick={() => handleStatusChange('AVAILABLE')}
                                className={`px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-2 transition-all ${status === 'AVAILABLE' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/20' : 'text-slate-500 hover:text-slate-300'}`}
                            >
                                <Wifi className="w-3 h-3" /> Available
                            </button>
                            <button
                                onClick={() => handleStatusChange('ON_LEAVE')}
                                className={`px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-2 transition-all ${status === 'ON_LEAVE' ? 'bg-amber-600 text-white shadow-lg shadow-amber-900/20' : 'text-slate-500 hover:text-slate-300'}`}
                            >
                                <Coffee className="w-3 h-3" /> Break
                            </button>
                            <button
                                onClick={() => handleStatusChange('OFFLINE')}
                                className={`px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-2 transition-all ${status === 'OFFLINE' ? 'bg-slate-700 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                            >
                                <WifiOff className="w-3 h-3" /> Offline
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Stats Strip */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 pt-2">
                <AgentStatCard
                    label="Current Load"
                    value={userProfile?.current_load || 0}
                    subtext="Active Tickets"
                    icon={Briefcase}
                    color="blue"
                />
                <AgentStatCard
                    label="Status"
                    value={status.replace('_', ' ')}
                    subtext="Visibility Mode"
                    icon={status === 'AVAILABLE' ? Wifi : status === 'ON_LEAVE' ? Coffee : WifiOff}
                    color={statusColor}
                />
                <AgentStatCard
                    label="Skills Verified"
                    value={userProfile?.skills?.length || 0}
                    subtext="Competencies"
                    icon={CheckCircle2}
                    color="purple"
                />
            </div>

            {/* Skills Manager */}
            <SkillsManager
                currentSkills={userProfile?.skills || []}
                onUpdate={(newSkills) => {
                    setUserProfile(prev => ({ ...prev, skills: newSkills }));
                }}
            />

            {/* Navigation Tabs */}
            <div className="flex border-b border-slate-800 mb-8 overflow-x-auto">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-6 py-3 text-sm font-bold border-b-2 transition-all whitespace-nowrap ${activeTab === tab.id
                            ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5'
                            : 'border-transparent text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'
                            }`}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
            >
                {activeTab === 'overview' && (
                    <div className="space-y-8">
                        <PersonalPerformance tickets={tickets} />
                        <WorkloadAnalytics tickets={tickets} />
                        <BreachRadar tickets={tickets} />
                    </div>
                )}

                {activeTab === 'assigned' && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <Zap className="w-4 h-4 text-emerald-500" />
                                My Active Queue
                            </h3>
                        </div>
                        <TicketList />
                    </div>
                )}

                {activeTab === 'all' && (
                    <div className="space-y-6">
                        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl text-center">
                            <p className="text-slate-500 text-sm">Team Global Inbox - Unassigned Tickets</p>
                        </div>
                        <TicketList />
                    </div>
                )}

                {activeTab === 'resolved' && (
                    <div className="border border-slate-800 rounded-2xl bg-slate-900/50 p-16 text-center">
                        <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                        </div>
                        <h3 className="text-xl font-bold text-white">Resolution Archive</h3>
                        <p className="text-slate-500 mt-2">Access your past resolved tickets for reference.</p>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
