
import React, { useMemo } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts';
import {
    Star, MessageSquare, Clock, FileText, CheckCircle2, TrendingUp, HelpCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b'];

// 1️⃣ Service Summary & 5️⃣ Satisfaction Tracker
export const ServiceSummary = ({ tickets }) => {
    const total = tickets.length;
    const resolved = tickets.filter(t => t.status === 'RESOLVED').length;
    const avgTime = "4.2h"; // Mocked for UI based on tickets

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="md:col-span-3 bg-[#0f172a] border border-slate-800 rounded-xl p-6 flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="flex-1 space-y-4 w-full">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-indigo-400" /> Service Pulse
                    </h3>
                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-800 text-center">
                            <p className="text-slate-500 text-[10px] uppercase font-bold">Total Requests</p>
                            <p className="text-2xl font-black text-white mt-1">{total}</p>
                        </div>
                        <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-800 text-center">
                            <p className="text-slate-500 text-[10px] uppercase font-bold">Resolved</p>
                            <p className="text-2xl font-black text-emerald-400 mt-1">{resolved}</p>
                        </div>
                        <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-800 text-center">
                            <p className="text-slate-500 text-[10px] uppercase font-bold">Avg Speed</p>
                            <p className="text-2xl font-black text-indigo-400 mt-1">{avgTime}</p>
                        </div>
                    </div>
                </div>

                {/* 5️⃣ Satisfaction Tracker (Mock UI) */}
                <div className="bg-slate-900/30 p-4 rounded-xl border border-slate-800 flex flex-col items-center min-w-[200px]">
                    <p className="text-slate-400 text-xs font-bold uppercase mb-2">Satisfaction Score</p>
                    <div className="flex gap-1 mb-2">
                        {[1, 2, 3, 4, 5].map(s => (
                            <Star key={s} className={`w-5 h-5 ${s <= 4 ? 'text-amber-400 fill-amber-400' : 'text-slate-600'}`} />
                        ))}
                    </div>
                    <p className="text-3xl font-black text-white">4.8/5</p>
                    <p className="text-[10px] text-emerald-400 font-bold mt-1">Top Tier Service</p>
                </div>
            </div>

            {/* 4️⃣ Communication Activity */}
            <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 flex flex-col justify-center items-center text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5">
                    <MessageSquare className="w-24 h-24 text-blue-500" />
                </div>
                <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center mb-3 text-blue-400">
                    <MessageSquare className="w-6 h-6" />
                </div>
                <h4 className="text-3xl font-black text-white">12</h4>
                <p className="text-slate-400 text-xs font-bold uppercase mt-1">Replies Exchanged</p>
                <p className="text-[10px] text-slate-500 mt-2">Last reply: 2h ago</p>
            </div>
        </div>
    );
};

// 2️⃣ Ticket Category Insights & 3️⃣ Resolution Timeline
export const HistoryAnalytics = ({ tickets }) => {
    // Process Categories
    const categoryData = useMemo(() => {
        const counts = {};
        tickets.forEach(t => counts[t.category || 'General'] = (counts[t.category || 'General'] || 0) + 1);
        return Object.keys(counts).map(k => ({ name: k, value: counts[k] }));
    }, [tickets]);

    // Mock Resolution Trend (Last 5 tickets)
    const trendData = [
        { ticket: '#1', hours: 5 }, { ticket: '#2', hours: 2 }, { ticket: '#3', hours: 8 },
        { ticket: '#4', hours: 3 }, { ticket: '#5', hours: 4 }
    ];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-6">
                    <FileText className="w-5 h-5 text-indigo-500" /> Issue Types
                </h3>
                <div className="h-48 flex items-center">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={categoryData}
                                cx="50%"
                                cy="50%"
                                innerRadius={50}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {categoryData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderRadius: '8px', border: 'none' }} />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="ml-4 space-y-2">
                        {categoryData.slice(0, 3).map((c, i) => (
                            <div key={i} className="flex items-center gap-2 text-xs text-slate-400">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                                {c.name}: <span className="text-white font-bold">{c.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-6">
                    <Clock className="w-5 h-5 text-emerald-500" /> Resolution Speed
                </h3>
                <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={trendData}>
                            <defs>
                                <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="ticket" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                            <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderRadius: '8px', border: 'none' }} />
                            <Area type="monotone" dataKey="hours" stroke="#10b981" fillOpacity={1} fill="url(#colorHours)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

// 6️⃣ FAQ Recommendations — fetches real Knowledge Base articles
export const FaqSection = () => {
    const [articles, setArticles] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [selectedArticle, setSelectedArticle] = React.useState(null);

    React.useEffect(() => {
        const fetchArticles = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch('http://localhost:5001/api/solutions/articles', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await res.json();
                if (data.articles && data.articles.length > 0) {
                    setArticles(data.articles.slice(0, 4));
                }
            } catch (err) {
                console.error('Failed to fetch articles:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchArticles();
    }, []);

    // Fallback items when no articles exist in KB
    const fallbackItems = [
        { id: 'f1', title: 'How to reset VPN password', category: 'Network', content: 'You can reset your VPN password through the self-service portal at https://reset.company.com. If your account is locked, wait 15 minutes and try again.' },
        { id: 'f2', title: 'Email sync issues troubleshooting', category: 'Email', content: 'To fix Outlook sync issues:\n1. Close Outlook completely\n2. Open Control Panel → Mail → Show Profiles\n3. Click "Repair" on your profile\n4. Restart Outlook and wait for sync to complete' },
        { id: 'f3', title: 'Software installation guide', category: 'General', content: 'To install approved software:\n1. Open the Company Software Center from Start Menu\n2. Browse or search for the application\n3. Click "Install" and wait for completion\n4. Contact IT if the app is not listed' },
    ];

    const displayItems = articles.length > 0 ? articles : fallbackItems;

    return (
        <>
            <div className="bg-gradient-to-r from-slate-900 to-indigo-900/20 border border-slate-800 rounded-xl p-6 mb-8">
                <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
                    <HelpCircle className="w-5 h-5 text-cyan-400" /> Recommended Solutions
                </h3>
                {loading ? (
                    <div className="flex justify-center py-8">
                        <div className="w-6 h-6 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {displayItems.map((item, i) => (
                            <button
                                key={item.id || i}
                                onClick={() => setSelectedArticle(item)}
                                className="flex items-center gap-3 p-4 bg-slate-900/50 border border-slate-800 rounded-lg hover:bg-slate-800 hover:border-indigo-500/30 transition-all group text-left w-full"
                            >
                                <FileText className="w-5 h-5 text-slate-500 group-hover:text-indigo-400 transition-colors shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors block truncate">{item.title}</span>
                                    {item.category && (
                                        <span className="text-[10px] text-slate-500 uppercase tracking-wider">{item.category}</span>
                                    )}
                                </div>
                                <CheckCircle2 className="w-4 h-4 text-slate-700 group-hover:text-cyan-400 transition-colors shrink-0" />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Article Detail Modal */}
            {selectedArticle && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedArticle(null)}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        transition={{ duration: 0.2 }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-[#0f172a] border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto shadow-2xl"
                    >
                        {/* Header */}
                        <div className="sticky top-0 bg-[#0f172a] border-b border-slate-800 p-6 flex items-start justify-between z-10">
                            <div className="flex-1 min-w-0 pr-4">
                                {selectedArticle.category && (
                                    <span className="px-2.5 py-0.5 bg-blue-500/10 text-blue-400 text-[10px] font-bold rounded-full border border-blue-500/20 uppercase tracking-wider inline-block mb-3">
                                        {selectedArticle.category}
                                    </span>
                                )}
                                <h2 className="text-xl font-bold text-white">{selectedArticle.title}</h2>
                                {selectedArticle.author && (
                                    <p className="text-xs text-slate-500 mt-1">By {selectedArticle.author}</p>
                                )}
                            </div>
                            <button
                                onClick={() => setSelectedArticle(null)}
                                className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors shrink-0"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                            <div className="prose prose-invert prose-sm max-w-none text-slate-300 leading-relaxed whitespace-pre-wrap">
                                {selectedArticle.content}
                            </div>

                            {selectedArticle.tags && selectedArticle.tags.length > 0 && (
                                <div className="flex items-center gap-2 mt-6 pt-4 border-t border-slate-800">
                                    <span className="text-xs text-slate-500">Tags:</span>
                                    {selectedArticle.tags.map(tag => (
                                        <span key={tag} className="px-2 py-0.5 bg-slate-800 text-slate-400 text-[10px] rounded">{tag}</span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </>
    );
};

