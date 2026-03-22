import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, BookOpen, Plus, Edit2, Trash2, Eye, Tag,
    ChevronRight, X, Save, Globe, Lock, Loader2, FileText
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { getCurrentToken } from '../context/AuthContext';

const API = 'http://localhost:5001/api/solutions';

const getHeaders = () => ({
    headers: { Authorization: `Bearer ${getCurrentToken()}` }
});

// ─── Article Card ───
const ArticleCard = ({ article, onView, onEdit, onDelete, isManager }) => (
    <motion.div
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        onClick={() => onView(article)}
        className="bg-[#0B1120] border border-slate-800 rounded-xl p-5 cursor-pointer hover:border-slate-600 hover:shadow-lg hover:shadow-blue-900/5 transition-all group"
    >
        <div className="flex items-start justify-between mb-3">
            <span className="px-2.5 py-0.5 bg-blue-500/10 text-blue-400 text-[10px] font-bold rounded-full border border-blue-500/20 uppercase tracking-wider">
                {article.category}
            </span>
            <div className="flex items-center gap-1 text-slate-600 text-xs">
                <Eye className="w-3 h-3" /> {article.views}
            </div>
        </div>

        <h3 className="text-white font-bold text-base mb-2 group-hover:text-blue-300 transition-colors line-clamp-2">
            {article.title}
        </h3>
        <p className="text-slate-500 text-xs line-clamp-3 mb-4 leading-relaxed">
            {article.content.replace(/[#*_`]/g, '').substring(0, 150)}...
        </p>

        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                {(article.tags || []).slice(0, 3).map(tag => (
                    <span key={tag} className="px-2 py-0.5 bg-slate-800 text-slate-400 text-[10px] rounded">
                        {tag}
                    </span>
                ))}
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {isManager && (
                    <>
                        <button
                            onClick={(e) => { e.stopPropagation(); onEdit(article); }}
                            className="p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-blue-400"
                        >
                            <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); onDelete(article.id); }}
                            className="p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-red-400"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                        </button>
                    </>
                )}
                <ChevronRight className="w-4 h-4 text-slate-600" />
            </div>
        </div>

        {/* Draft badge */}
        {!article.is_published && isManager && (
            <div className="mt-3 flex items-center gap-1 text-amber-500 text-[10px] font-bold">
                <Lock className="w-3 h-3" /> DRAFT
            </div>
        )}
    </motion.div>
);

// ─── Article Viewer (slide-in) ───
const ArticleViewer = ({ article, onClose }) => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-end"
        onClick={onClose}
    >
        <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25 }}
            className="w-full max-w-2xl bg-[#0A0F1C] border-l border-slate-800 h-full overflow-y-auto"
            onClick={e => e.stopPropagation()}
        >
            <div className="sticky top-0 bg-[#0A0F1C]/95 backdrop-blur-md border-b border-slate-800 px-6 py-4 flex items-center justify-between z-10">
                <div className="flex items-center gap-3">
                    <BookOpen className="w-5 h-5 text-blue-500" />
                    <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">Knowledge Base</span>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white">
                    <X className="w-5 h-5" />
                </button>
            </div>

            <div className="p-8">
                <span className="px-3 py-1 bg-blue-500/10 text-blue-400 text-xs font-bold rounded-full border border-blue-500/20">
                    {article.category}
                </span>
                <h1 className="text-2xl font-extrabold text-white mt-4 mb-2">{article.title}</h1>
                <p className="text-xs text-slate-500 mb-8">
                    By {article.author} • {new Date(article.created_at).toLocaleDateString()} • {article.views} views
                </p>

                {/* Render content as simple formatted text */}
                <div className="prose prose-invert prose-sm max-w-none">
                    {article.content.split('\n').map((line, i) => {
                        if (line.startsWith('### ')) return <h3 key={i} className="text-lg font-bold text-white mt-6 mb-2">{line.replace('### ', '')}</h3>;
                        if (line.startsWith('## ')) return <h2 key={i} className="text-xl font-bold text-white mt-8 mb-3">{line.replace('## ', '')}</h2>;
                        if (line.startsWith('# ')) return <h1 key={i} className="text-2xl font-extrabold text-white mt-8 mb-4">{line.replace('# ', '')}</h1>;
                        if (line.startsWith('- ')) return <li key={i} className="text-slate-300 ml-4 mb-1">{line.replace('- ', '')}</li>;
                        if (line.trim() === '') return <br key={i} />;
                        return <p key={i} className="text-slate-300 leading-relaxed mb-3">{line}</p>;
                    })}
                </div>

                <div className="mt-8 pt-6 border-t border-slate-800">
                    <p className="text-xs text-slate-600 uppercase tracking-wider mb-3">Tags</p>
                    <div className="flex flex-wrap gap-2">
                        {(article.tags || []).map(tag => (
                            <span key={tag} className="px-3 py-1 bg-slate-800 text-slate-400 text-xs rounded-full">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
    </motion.div>
);

// ─── Article Editor Modal ───
const ArticleEditor = ({ article, onClose, onSave }) => {
    const [form, setForm] = useState({
        title: article?.title || '',
        content: article?.content || '',
        category: article?.category || 'General',
        tags: (article?.tags || []).join(', '),
        is_published: article?.is_published ?? true
    });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const handleSave = async () => {
        setSaving(true);
        setError('');
        const payload = {
            ...form,
            tags: form.tags.split(',').map(t => t.trim()).filter(Boolean)
        };

        try {
            console.log('[KB] Saving article:', payload);
            if (article?.id) {
                await axios.patch(`${API}/articles/${article.id}`, payload, getHeaders());
            } else {
                await axios.post(`${API}/articles`, payload, getHeaders());
            }
            console.log('[KB] Save successful');
            onSave();
        } catch (err) {
            console.error('[KB] Save failed:', err.response?.data || err.message);
            setError(err.response?.data?.error || err.message || 'Failed to save article');
        }
        setSaving(false);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-[#0A0F1C] border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
                onClick={e => e.stopPropagation()}
            >
                <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <FileText className="w-5 h-5 text-blue-500" />
                        {article?.id ? 'Edit Article' : 'New Article'}
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white">
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <div className="p-6 space-y-5">
                    <div>
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Title</label>
                        <input
                            value={form.title}
                            onChange={e => setForm({ ...form, title: e.target.value })}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                            placeholder="How to reset your password"
                        />
                    </div>

                    <div>
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Content (Markdown)</label>
                        <textarea
                            value={form.content}
                            onChange={e => setForm({ ...form, content: e.target.value })}
                            rows={12}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white text-sm font-mono focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-y"
                            placeholder="## Steps&#10;1. Go to the reset portal...&#10;2. Enter your email..."
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Category</label>
                            <select
                                value={form.category}
                                onChange={e => setForm({ ...form, category: e.target.value })}
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white text-sm focus:border-blue-500 outline-none"
                            >
                                <option>General</option>
                                <option>Network</option>
                                <option>Hardware</option>
                                <option>Software</option>
                                <option>Security</option>
                                <option>Account</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Tags (comma-separated)</label>
                            <input
                                value={form.tags}
                                onChange={e => setForm({ ...form, tags: e.target.value })}
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white text-sm focus:border-blue-500 outline-none"
                                placeholder="password, reset, sso"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={form.is_published}
                                onChange={e => setForm({ ...form, is_published: e.target.checked })}
                                className="sr-only peer"
                            />
                            <div className="w-9 h-5 bg-slate-700 rounded-full peer peer-checked:bg-blue-600 transition-colors after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full"></div>
                        </label>
                        <span className="text-sm text-slate-300 flex items-center gap-2">
                            {form.is_published ? <><Globe className="w-3.5 h-3.5 text-blue-400" /> Published</> : <><Lock className="w-3.5 h-3.5 text-slate-500" /> Draft</>}
                        </span>
                    </div>
                </div>

                <div className="p-6 border-t border-slate-800">
                    {error && (
                        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                            ⚠️ {error}
                        </div>
                    )}
                    <div className="flex justify-end gap-3">
                        <button onClick={onClose} className="px-4 py-2 text-slate-400 hover:text-white text-sm font-medium">
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={saving || !form.title || !form.content}
                            className="px-5 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-500 disabled:opacity-50 flex items-center gap-2"
                        >
                            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            {article?.id ? 'Update' : 'Publish'}
                        </button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};


// ─── Main Knowledge Base Page ───
export default function KnowledgeBase() {
    const { user } = useAuth();
    const isManager = user?.role === 'MANAGER';

    const [articles, setArticles] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const [viewingArticle, setViewingArticle] = useState(null);
    const [editingArticle, setEditingArticle] = useState(null);
    const [showEditor, setShowEditor] = useState(false);

    useEffect(() => {
        fetchArticles();
    }, [activeCategory]);

    const fetchArticles = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (activeCategory !== 'All') params.append('category', activeCategory);
            if (search) params.append('search', search);

            const res = await axios.get(`${API}/articles?${params}`, getHeaders());
            setArticles(res.data.articles);
            setCategories(['All', ...(res.data.categories || [])]);
        } catch (err) {
            console.error('Failed to load articles:', err);
        }
        setLoading(false);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchArticles();
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this article?')) return;
        try {
            await axios.delete(`${API}/articles/${id}`, getHeaders());
            fetchArticles();
        } catch (err) {
            console.error('Delete failed:', err);
        }
    };

    const handleEditorSave = () => {
        setShowEditor(false);
        setEditingArticle(null);
        fetchArticles();
    };

    return (
        <div className="space-y-6 p-2">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4 border-b border-slate-800 pb-6">
                <div>
                    <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
                        <BookOpen className="w-8 h-8 text-blue-500" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                            Knowledge Base
                        </span>
                    </h1>
                    <p className="text-slate-500 text-xs mt-2 uppercase tracking-wider font-mono">
                        {articles.length} articles • Self-Service Support
                    </p>
                </div>
                {isManager && (
                    <button
                        onClick={() => { setEditingArticle(null); setShowEditor(true); }}
                        className="px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-500 flex items-center gap-2 shadow-lg shadow-blue-900/20"
                    >
                        <Plus className="w-4 h-4" /> New Article
                    </button>
                )}
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full bg-[#0B1120] border border-slate-800 rounded-xl pl-12 pr-4 py-3.5 text-white text-sm placeholder-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 outline-none"
                    placeholder="Search articles by title, content, or tags..."
                />
            </form>

            {/* Category Filters */}
            <div className="flex gap-2 overflow-x-auto pb-2">
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${activeCategory === cat
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                            : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-600'
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Articles Grid */}
            {loading ? (
                <div className="py-20 text-center">
                    <Loader2 className="w-6 h-6 text-blue-500 animate-spin mx-auto mb-3" />
                    <p className="text-slate-500 text-sm">Loading articles...</p>
                </div>
            ) : articles.length === 0 ? (
                <div className="py-20 text-center border border-dashed border-slate-800 rounded-2xl">
                    <BookOpen className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">No Articles Found</h3>
                    <p className="text-slate-500 text-sm">
                        {isManager ? 'Create your first article to help users solve common issues.' : 'Check back later for helpful guides and solutions.'}
                    </p>
                </div>
            ) : (
                <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <AnimatePresence>
                        {articles.map(article => (
                            <ArticleCard
                                key={article.id}
                                article={article}
                                onView={setViewingArticle}
                                onEdit={(a) => { setEditingArticle(a); setShowEditor(true); }}
                                onDelete={handleDelete}
                                isManager={isManager}
                            />
                        ))}
                    </AnimatePresence>
                </motion.div>
            )}

            {/* Article Viewer Slide-in */}
            <AnimatePresence>
                {viewingArticle && (
                    <ArticleViewer
                        article={viewingArticle}
                        onClose={() => setViewingArticle(null)}
                    />
                )}
            </AnimatePresence>

            {/* Article Editor Modal */}
            <AnimatePresence>
                {showEditor && (
                    <ArticleEditor
                        article={editingArticle}
                        onClose={() => { setShowEditor(false); setEditingArticle(null); }}
                        onSave={handleEditorSave}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
