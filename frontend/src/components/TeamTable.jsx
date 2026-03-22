import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users, Plus, Search, MoreVertical, Shield, Trash2,
    CheckCircle2, XCircle, Mail, User, Briefcase, Activity,
    FolderPlus, UserPlus, ChevronDown, ChevronRight, X
} from 'lucide-react';
import { userService } from '../services/userService';
import { teamService } from '../services/teamService';

export default function TeamTable({ refreshTrigger }) {
    const [staff, setStaff] = useState([]);
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showTeamModal, setShowTeamModal] = useState(false);
    const [activeView, setActiveView] = useState('teams'); // 'teams' or 'members'
    const [expandedTeam, setExpandedTeam] = useState(null);
    const [showAssignModal, setShowAssignModal] = useState(null); // team id

    useEffect(() => {
        fetchAll();
    }, [refreshTrigger]);

    const fetchAll = async () => {
        setLoading(true);
        const [staffResult, teamsResult] = await Promise.all([
            userService.getStaff(),
            teamService.getTeams()
        ]);
        if (staffResult.success) setStaff(staffResult.data);
        if (teamsResult.success) setTeams(teamsResult.data);
        setLoading(false);
    };

    const handleDeleteTeam = async (teamId) => {
        if (!window.confirm('Are you sure you want to delete this team?')) return;
        const result = await teamService.deleteTeam(teamId);
        if (result.success) fetchAll();
    };

    const handleRemoveMember = async (teamId, userId) => {
        const result = await teamService.removeMember(teamId, userId);
        if (result.success) fetchAll();
    };

    const filteredStaff = staff.filter(member =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Get members not in a specific team
    const getAvailableMembers = (teamId) => {
        const team = teams.find(t => t.id === teamId);
        if (!team) return staff;
        const teamMemberIds = team.members.map(m => m.id);
        return staff.filter(s => !teamMemberIds.includes(s.id));
    };

    return (
        <div className="space-y-6">
            {/* View Toggle + Actions */}
            <div className="flex flex-col sm:flex-row justify-between gap-4">
                {/* View Tabs */}
                <div className="flex border border-slate-700 rounded-lg overflow-hidden">
                    <button
                        onClick={() => setActiveView('teams')}
                        className={`px-5 py-2 text-sm font-bold flex items-center gap-2 transition-all ${activeView === 'teams' ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'
                            }`}
                    >
                        <Users className="w-4 h-4" /> Teams
                    </button>
                    <button
                        onClick={() => setActiveView('members')}
                        className={`px-5 py-2 text-sm font-bold flex items-center gap-2 transition-all ${activeView === 'members' ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'
                            }`}
                    >
                        <User className="w-4 h-4" /> All Members
                    </button>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                    {activeView === 'teams' && (
                        <button
                            onClick={() => setShowTeamModal(true)}
                            className="flex items-center gap-2 px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-sm transition-all"
                        >
                            <FolderPlus className="w-4 h-4" /> Create Team
                        </button>
                    )}
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg text-sm transition-all"
                    >
                        <UserPlus className="w-4 h-4" /> Add Member
                    </button>
                </div>
            </div>

            {/* Search */}
            {activeView === 'members' && (
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                        type="text"
                        placeholder="Search members..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
                    />
                </div>
            )}

            {loading ? (
                <div className="text-center py-16 text-slate-500">Loading...</div>
            ) : activeView === 'teams' ? (
                /* ========== TEAMS VIEW ========== */
                <div className="space-y-4">
                    {teams.length === 0 ? (
                        <div className="border border-dashed border-slate-700 rounded-xl p-12 text-center">
                            <Users className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                            <h3 className="text-lg font-bold text-white mb-2">No Teams Created Yet</h3>
                            <p className="text-slate-500 text-sm mb-6">Create your first team and assign members to it.</p>
                            <button
                                onClick={() => setShowTeamModal(true)}
                                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-sm"
                            >
                                <FolderPlus className="w-4 h-4 inline mr-2" /> Create First Team
                            </button>
                        </div>
                    ) : (
                        teams.map((team) => (
                            <div key={team.id} className="bg-[#0B1120] border border-slate-800 rounded-xl overflow-hidden hover:border-slate-700 transition-all">
                                {/* Team Header */}
                                <div
                                    className="p-5 flex items-center justify-between cursor-pointer"
                                    onClick={() => setExpandedTeam(expandedTeam === team.id ? null : team.id)}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-indigo-500/15 text-indigo-400 flex items-center justify-center font-bold text-lg">
                                            {team.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h4 className="text-white font-bold text-base">{team.name}</h4>
                                            <p className="text-slate-500 text-xs mt-0.5">
                                                {team.member_count} member{team.member_count !== 1 ? 's' : ''}
                                                {team.lead && ` • Lead: ${team.lead.name}`}
                                                {team.description && ` • ${team.description}`}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); setShowAssignModal(team.id); }}
                                            className="p-2 text-slate-500 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-all"
                                            title="Add member to team"
                                        >
                                            <UserPlus className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleDeleteTeam(team.id); }}
                                            className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                                            title="Delete team"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                        {expandedTeam === team.id ? (
                                            <ChevronDown className="w-4 h-4 text-slate-500" />
                                        ) : (
                                            <ChevronRight className="w-4 h-4 text-slate-500" />
                                        )}
                                    </div>
                                </div>

                                {/* Expanded: Team Members */}
                                <AnimatePresence>
                                    {expandedTeam === team.id && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="border-t border-slate-800 px-5 py-4">
                                                {team.members.length === 0 ? (
                                                    <p className="text-slate-500 text-sm text-center py-4">No members assigned yet. Click + to add.</p>
                                                ) : (
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                        {team.members.map((member) => (
                                                            <div key={member.id} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg border border-slate-800">
                                                                <div className="flex items-center gap-3">
                                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${member.role === 'MANAGER' ? 'bg-purple-600' : 'bg-blue-600'
                                                                        }`}>
                                                                        {member.name.charAt(0)}
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-white text-sm font-semibold">{member.name}</p>
                                                                        <p className="text-slate-500 text-xs">{member.email}</p>
                                                                    </div>
                                                                </div>
                                                                <button
                                                                    onClick={() => handleRemoveMember(team.id, member.id)}
                                                                    className="p-1.5 text-slate-600 hover:text-red-400 hover:bg-red-500/10 rounded transition-all"
                                                                    title="Remove from team"
                                                                >
                                                                    <X className="w-3.5 h-3.5" />
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))
                    )}
                </div>
            ) : (
                /* ========== ALL MEMBERS VIEW ========== */
                <div className="bg-[#0B1120] rounded-xl border border-slate-800 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-800 bg-slate-900/50">
                                    <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Name / Role</th>
                                    <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                    <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Workload</th>
                                    <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Skills</th>
                                    <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Joined</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {filteredStaff.length === 0 ? (
                                    <tr><td colSpan="5" className="p-12 text-center text-slate-500">No team members found.</td></tr>
                                ) : (
                                    filteredStaff.map((member) => (
                                        <tr key={member.id} className="hover:bg-slate-800/30 transition-colors">
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold ${member.role === 'MANAGER' ? 'bg-purple-600' : 'bg-blue-600'
                                                        }`}>
                                                        {member.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-white text-sm">{member.name}</div>
                                                        <div className="text-xs text-slate-500 flex items-center gap-1">
                                                            <Mail className="w-3 h-3" /> {member.email}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <StatusBadge status={member.status} role={member.role} />
                                            </td>
                                            <td className="p-4">
                                                {member.role === 'EMPLOYEE' ? (
                                                    <div className="flex items-center gap-2 text-sm text-slate-300">
                                                        <Activity className="w-3.5 h-3.5 text-slate-500" />
                                                        {member.current_load || 0} active
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-slate-600">—</span>
                                                )}
                                            </td>
                                            <td className="p-4">
                                                <div className="flex flex-wrap gap-1">
                                                    {member.skills?.map(skill => (
                                                        <span key={skill} className="px-2 py-0.5 rounded bg-slate-800 text-xs text-slate-400 border border-slate-700">
                                                            {skill}
                                                        </span>
                                                    ))}
                                                    {!member.skills?.length && <span className="text-xs text-slate-600">—</span>}
                                                </div>
                                            </td>
                                            <td className="p-4 text-sm text-slate-500">
                                                {new Date(member.joined_at).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Modals */}
            <AddMemberModal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                onSuccess={() => { fetchAll(); setShowAddModal(false); }}
            />
            <CreateTeamModal
                isOpen={showTeamModal}
                onClose={() => setShowTeamModal(false)}
                onSuccess={() => { fetchAll(); setShowTeamModal(false); }}
                staff={staff}
            />
            <AssignMemberModal
                teamId={showAssignModal}
                isOpen={!!showAssignModal}
                onClose={() => setShowAssignModal(null)}
                onSuccess={() => { fetchAll(); setShowAssignModal(null); }}
                availableMembers={showAssignModal ? getAvailableMembers(showAssignModal) : []}
            />
        </div>
    );
}

// ── Status Badge ──────────────────────────────────────
const StatusBadge = ({ status, role }) => {
    if (role === 'MANAGER') {
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-purple-500/15 text-purple-400 text-xs font-bold"><Shield className="w-3 h-3" /> Admin</span>;
    }
    const colors = {
        'AVAILABLE': 'bg-emerald-500/15 text-emerald-400',
        'ONLINE': 'bg-emerald-500/15 text-emerald-400',
        'ON_LEAVE': 'bg-amber-500/15 text-amber-400',
        'BUSY': 'bg-amber-500/15 text-amber-400',
        'OFFLINE': 'bg-slate-700/50 text-slate-500'
    };
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-bold ${colors[status] || colors['OFFLINE']}`}>
            <div className={`w-1.5 h-1.5 rounded-full ${status === 'AVAILABLE' || status === 'ONLINE' ? 'bg-emerald-400' : 'bg-current'}`}></div>
            {status || 'OFFLINE'}
        </span>
    );
};

// ── Add Individual Member Modal ─────────────────────
const AddMemberModal = ({ isOpen, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'EMPLOYEE', skills: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        const payload = { ...formData, skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean) };
        const result = await userService.createStaff(payload);
        setLoading(false);
        if (result.success) {
            setFormData({ name: '', email: '', password: '', role: 'EMPLOYEE', skills: '' });
            onSuccess();
        } else setError(result.error);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="bg-[#0F172A] rounded-xl shadow-2xl w-full max-w-lg border border-slate-800">
                <div className="p-5 border-b border-slate-800 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2"><UserPlus className="w-5 h-5 text-blue-500" /> Add New Member</h3>
                    <button onClick={onClose} className="text-slate-500 hover:text-white"><XCircle className="w-5 h-5" /></button>
                </div>
                <form onSubmit={handleSubmit} className="p-5 space-y-4">
                    {error && <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg">{error}</div>}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Full Name</label>
                            <input required className="w-full mt-1 p-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm focus:ring-2 focus:ring-blue-500/50 focus:outline-none"
                                value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Role</label>
                            <select className="w-full mt-1 p-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm focus:ring-2 focus:ring-blue-500/50 focus:outline-none"
                                value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })}>
                                <option value="EMPLOYEE">Employee</option>
                                <option value="MANAGER">Manager</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Email Address</label>
                        <input type="email" required className="w-full mt-1 p-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm focus:ring-2 focus:ring-blue-500/50 focus:outline-none"
                            value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Initial Password</label>
                        <input type="password" required className="w-full mt-1 p-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm focus:ring-2 focus:ring-blue-500/50 focus:outline-none"
                            value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} />
                    </div>
                    {formData.role === 'EMPLOYEE' && (
                        <div>
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Skills (comma separated)</label>
                            <input className="w-full mt-1 p-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm focus:ring-2 focus:ring-blue-500/50 focus:outline-none"
                                placeholder="e.g. Network, Python, Hardware"
                                value={formData.skills} onChange={e => setFormData({ ...formData, skills: e.target.value })} />
                        </div>
                    )}
                    <div className="pt-3 flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-slate-400 font-medium hover:bg-slate-800 rounded-lg text-sm">Cancel</button>
                        <button type="submit" disabled={loading} className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-500 disabled:opacity-50 text-sm">
                            {loading ? 'Creating...' : 'Create Account'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

// ── Create Team Modal ──────────────────────────────
const CreateTeamModal = ({ isOpen, onClose, onSuccess, staff }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [leadId, setLeadId] = useState('');
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const toggleMember = (id) => {
        setSelectedMembers(prev =>
            prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        const result = await teamService.createTeam({
            name,
            description,
            lead_id: leadId || null,
            members: selectedMembers
        });
        setLoading(false);
        if (result.success) {
            setName(''); setDescription(''); setLeadId(''); setSelectedMembers([]);
            onSuccess();
        } else setError(result.error);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="bg-[#0F172A] rounded-xl shadow-2xl w-full max-w-lg border border-slate-800 max-h-[85vh] overflow-y-auto">
                <div className="p-5 border-b border-slate-800 flex justify-between items-center sticky top-0 bg-[#0F172A] z-10">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2"><FolderPlus className="w-5 h-5 text-emerald-500" /> Create New Team</h3>
                    <button onClick={onClose} className="text-slate-500 hover:text-white"><XCircle className="w-5 h-5" /></button>
                </div>
                <form onSubmit={handleSubmit} className="p-5 space-y-4">
                    {error && <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg">{error}</div>}

                    <div>
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Team Name *</label>
                        <input required className="w-full mt-1 p-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm focus:ring-2 focus:ring-emerald-500/50 focus:outline-none"
                            placeholder="e.g. Infrastructure Support"
                            value={name} onChange={e => setName(e.target.value)} />
                    </div>

                    <div>
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Description</label>
                        <input className="w-full mt-1 p-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm focus:ring-2 focus:ring-emerald-500/50 focus:outline-none"
                            placeholder="e.g. Handles network & hardware issues"
                            value={description} onChange={e => setDescription(e.target.value)} />
                    </div>

                    <div>
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Team Lead</label>
                        <select className="w-full mt-1 p-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm focus:ring-2 focus:ring-emerald-500/50 focus:outline-none"
                            value={leadId} onChange={e => setLeadId(e.target.value)}>
                            <option value="">No lead assigned</option>
                            {staff.map(s => <option key={s.id} value={s.id}>{s.name} ({s.role})</option>)}
                        </select>
                    </div>

                    <div>
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2 block">
                            Select Members ({selectedMembers.length} selected)
                        </label>
                        <div className="max-h-48 overflow-y-auto border border-slate-700 rounded-lg divide-y divide-slate-800">
                            {staff.length === 0 ? (
                                <p className="p-4 text-slate-500 text-sm text-center">No staff members available. Add members first.</p>
                            ) : (
                                staff.map(s => (
                                    <label key={s.id} className="flex items-center gap-3 p-3 hover:bg-slate-800/50 cursor-pointer transition-colors">
                                        <input
                                            type="checkbox"
                                            checked={selectedMembers.includes(s.id)}
                                            onChange={() => toggleMember(s.id)}
                                            className="accent-emerald-500 w-4 h-4"
                                        />
                                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold ${s.role === 'MANAGER' ? 'bg-purple-600' : 'bg-blue-600'
                                            }`}>
                                            {s.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-white text-sm font-medium">{s.name}</p>
                                            <p className="text-slate-500 text-xs">{s.role}</p>
                                        </div>
                                    </label>
                                ))
                            )}
                        </div>
                    </div>

                    <div className="pt-3 flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-slate-400 font-medium hover:bg-slate-800 rounded-lg text-sm">Cancel</button>
                        <button type="submit" disabled={loading} className="px-6 py-2 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-500 disabled:opacity-50 text-sm">
                            {loading ? 'Creating...' : 'Create Team'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

// ── Assign Member to Team Modal ─────────────────────
const AssignMemberModal = ({ isOpen, teamId, onClose, onSuccess, availableMembers }) => {
    const [loading, setLoading] = useState(null); // tracks which user is loading

    if (!isOpen) return null;

    const handleAssign = async (userId) => {
        setLoading(userId);
        const result = await teamService.addMember(teamId, userId);
        setLoading(null);
        if (result.success) onSuccess();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="bg-[#0F172A] rounded-xl shadow-2xl w-full max-w-md border border-slate-800 max-h-[70vh] overflow-y-auto">
                <div className="p-5 border-b border-slate-800 flex justify-between items-center sticky top-0 bg-[#0F172A] z-10">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2"><UserPlus className="w-5 h-5 text-emerald-500" /> Add to Team</h3>
                    <button onClick={onClose} className="text-slate-500 hover:text-white"><XCircle className="w-5 h-5" /></button>
                </div>
                <div className="p-4 space-y-2">
                    {availableMembers.length === 0 ? (
                        <p className="text-slate-500 text-sm text-center py-8">All members are already in this team.</p>
                    ) : (
                        availableMembers.map(member => (
                            <div key={member.id} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg border border-slate-800 hover:border-slate-700 transition-all">
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${member.role === 'MANAGER' ? 'bg-purple-600' : 'bg-blue-600'
                                        }`}>
                                        {member.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="text-white text-sm font-semibold">{member.name}</p>
                                        <p className="text-slate-500 text-xs">{member.email}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleAssign(member.id)}
                                    disabled={loading === member.id}
                                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg disabled:opacity-50 transition-all"
                                >
                                    {loading === member.id ? '...' : 'Add'}
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </motion.div>
        </div>
    );
};
