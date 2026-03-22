import { useState, useEffect } from 'react';
import { ShieldAlert, LogIn, UserPlus, FileEdit, Trash2, Clock, CheckCircle } from 'lucide-react';
import { statsService } from '../../services/statsService';

const ActionIcon = ({ action }) => {
    switch (action) {
        case 'LOGIN': return <LogIn className="w-4 h-4 text-blue-500" />;
        case 'STAFF_CREATED': return <UserPlus className="w-4 h-4 text-emerald-500" />;
        case 'TICKET_DELETED': return <Trash2 className="w-4 h-4 text-red-500" />;
        case 'ARTICLE_PUBLISHED': return <CheckCircle className="w-4 h-4 text-purple-500" />;
        default: return <FileEdit className="w-4 h-4 text-slate-400" />;
    }
};

export default function AuditLogsList({ refreshTrigger }) {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLogs = async () => {
            setLoading(true);
            const res = await statsService.getAuditLogs(50);
            if (res.success) {
                setLogs(res.data.logs || []);
            }
            setLoading(false);
        };
        fetchLogs();
    }, [refreshTrigger]);

    if (loading) return <div className="text-center p-8 text-slate-500 animate-pulse bg-slate-900 border border-slate-800 rounded-xl">Loading security logs...</div>;

    if (logs.length === 0) return (
        <div className="bg-slate-900 border border-dashed border-slate-700 p-8 rounded-xl text-center">
            <ShieldAlert className="w-8 h-8 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400 font-medium">No recent security events found.</p>
        </div>
    );

    return (
        <div className="bg-[#0B1120] border border-slate-800 rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-900/50 border-b border-slate-800 text-xs text-slate-400 font-bold uppercase tracking-wider">
                            <th className="px-6 py-4">Timestamp</th>
                            <th className="px-6 py-4">Action</th>
                            <th className="px-6 py-4">User</th>
                            <th className="px-6 py-4">Details</th>
                            <th className="px-6 py-4">IP Address</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                        {logs.map((log) => (
                            <tr key={log.id} className="hover:bg-slate-800/20 transition-colors group">
                                <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-400 flex items-center gap-2">
                                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                                    {log.timestamp}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-2">
                                        <div className="p-1.5 bg-slate-800 rounded-md group-hover:bg-slate-700 transition-colors">
                                            <ActionIcon action={log.action} />
                                        </div>
                                        <span className="text-sm font-bold text-slate-200">{log.action.replace('_', ' ')}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm font-medium text-slate-300">{log.user_name}</div>
                                    <div className="text-xs text-slate-500">{log.user_email}</div>
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-400">
                                    {log.details}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500 font-mono">
                                    {log.ip_address || 'N/A'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="px-6 py-3 border-t border-slate-800 bg-slate-900/50 text-xs text-slate-500 flex justify-between">
                <span>Showing last {logs.length} security events</span>
                <span>System Security Level: MAX</span>
            </div>
        </div>
    );
}
