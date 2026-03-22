import { Shield, Lock, Clock, UserCheck } from 'lucide-react';

const ComplianceCard = ({ title, score, target, status, icon: Icon }) => (
    <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between hover:border-indigo-500/20 hover:shadow-lg transition-all">
        <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${score >= target ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                <Icon className="w-5 h-5" />
            </div>
            <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">{title}</h4>
                <div className="h-1.5 w-24 bg-slate-800 rounded-full mt-2 overflow-hidden">
                    <div
                        className={`h-full rounded-full ${score >= target ? 'bg-emerald-500' : 'bg-red-500'}`}
                        style={{ width: `${score}%` }}
                    />
                </div>
            </div>
        </div>
        <div className="text-right">
            <span className={`text-lg font-mono font-bold ${score >= target ? 'text-emerald-400' : 'text-red-400'}`}>
                {score}%
            </span>
            <p className="text-[10px] text-slate-500">Target: {target}%</p>
        </div>
    </div>
);

export default function GovernanceAnalytics({ stats }) {
    // Simulated governance data points
    const compliance = {
        security: 98,
        privacy: 100,
        timeliness: 87, // Simulate a breach area
        accuracy: 94
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            <ComplianceCard
                title="Security Protocol"
                score={compliance.security}
                target={95}
                icon={Shield}
            />
            <ComplianceCard
                title="Privacy Audit"
                score={compliance.privacy}
                target={100}
                icon={Lock}
            />
            <ComplianceCard
                title="Resolution Time"
                score={compliance.timeliness}
                target={90}
                icon={Clock}
            />
            <ComplianceCard
                title="Agent Accuracy"
                score={compliance.accuracy}
                target={95}
                icon={UserCheck}
            />
        </div>
    );
}
