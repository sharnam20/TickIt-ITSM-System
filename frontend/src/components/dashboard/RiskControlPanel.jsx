import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ResponsiveContainer, PieChart, Pie, Cell, Label, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Activity, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#6366f1'];

export default function RiskControlPanel({ stats }) {
    // Derived or simulated data for demonstration if stats limited
    const total = stats?.total || 100;
    const breached = stats?.sla_breached || 12;
    const atRisk = Math.floor(total * 0.15); // Simulated
    const compliant = total - breached - atRisk;

    const riskData = [
        { name: 'Compliant', value: compliant, color: '#10b981' }, // Green
        { name: 'At Risk', value: atRisk, color: '#f59e0b' },    // Amber
        { name: 'Breached', value: breached, color: '#ef4444' }   // Red
    ];

    const volumeData = stats?.trends || [];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Risk Gauge Widget */}
            <div className="p-6 bg-[#0B1120] rounded-xl border border-slate-800 shadow-sm flex flex-col items-center justify-center relative overflow-hidden group hover:border-slate-700 transition-all">
                <div className="flex w-full justify-between items-center mb-4">
                    <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-500" />
                        SLA Risk Matrix
                    </h3>
                </div>

                <div className="h-64 w-full relative min-h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={riskData}
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                                stroke="none"
                            >
                                {riskData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                                <Label
                                    value={`${Math.round((compliant / total) * 100)}%`}
                                    position="center"
                                    fill="white"
                                    style={{ fontSize: '24px', fontWeight: 'bold', fontFamily: 'Inter' }}
                                />
                            </Pie>
                            <Tooltip
                                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', color: '#fff' }}
                                itemStyle={{ color: '#fff' }}
                            />
                        </PieChart>
                    </ResponsiveContainer>

                    {/* Data Legend */}
                    <div className="flex justify-center gap-4 mt-4 text-xs font-mono">
                        <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Compliant</div>
                        <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-amber-500"></span> Risk</div>
                        <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-red-500"></span> Breach</div>
                    </div>
                </div>
            </div>

            {/* Volume Trend Widget */}
            <div className="col-span-1 lg:col-span-2 p-6 bg-[#0B1120] rounded-xl border border-slate-800 shadow-sm relative group hover:border-slate-700 transition-all">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
                            <Activity className="w-4 h-4 text-indigo-500" />
                            Incident Velocity
                        </h3>
                        <p className="text-xs text-slate-500 mt-1">Daily ticket creation vs resolution rate</p>
                    </div>
                    <div className="flex gap-2">
                        <span className="px-3 py-1 bg-slate-800 text-slate-400 text-xs rounded-full cursor-pointer hover:bg-indigo-600 hover:text-white transition-colors">Day</span>
                        <span className="px-3 py-1 bg-indigo-600 text-white text-xs rounded-full font-bold shadow-sm">Week</span>
                        <span className="px-3 py-1 bg-slate-800 text-slate-400 text-xs rounded-full cursor-pointer hover:bg-indigo-600 hover:text-white transition-colors">Month</span>
                    </div>
                </div>

                <div className="h-64 w-full min-h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={volumeData} barSize={20}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                            <Tooltip
                                cursor={{ fill: '#1e293b', opacity: 0.4 }}
                                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', color: '#fff' }}
                            />
                            <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} name="Inflow" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
