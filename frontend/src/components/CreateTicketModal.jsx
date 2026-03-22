import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Send, Upload, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { getCurrentToken } from '../context/AuthContext';

const API_URL = 'http://localhost:5001/api';

export default function CreateTicketModal({ isOpen, onClose, onCreated }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('Hardware');
    const [priority, setPriority] = useState('LOW');
    const [loading, setLoading] = useState(false);
    const [aiThinking, setAiThinking] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = getCurrentToken();
            await axios.post(`${API_URL}/tickets`,
                { title, description, category, priority },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            onCreated();
            onClose();
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to create ticket');
        }
        setLoading(false);
    };

    // Simulate AI categorization based on description
    const handleDescriptionChange = (e) => {
        const val = e.target.value;
        setDescription(val);

        if (val.length > 10 && !aiThinking) {
            setAiThinking(true);
            setTimeout(() => {
                if (val.toLowerCase().includes('wifi') || val.toLowerCase().includes('internet')) setCategory('Network');
                else if (val.toLowerCase().includes('screen') || val.toLowerCase().includes('keyboard')) setCategory('Hardware');
                else if (val.toLowerCase().includes('login') || val.toLowerCase().includes('password')) setCategory('Access');
                else setCategory('Software');
                setAiThinking(false);
            }, 1000);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                                <Sparkles className="w-5 h-5" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white">New Support Request</h2>
                                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">AI-Enhanced Submission</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                            <X className="w-5 h-5 text-slate-500" />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="p-8">
                        {error && (
                            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-3 text-sm border border-red-100">
                                <AlertCircle className="w-5 h-5" /> {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Issue Summary</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Briefly describe the problem..."
                                    className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border-none focus:ring-2 focus:ring-indigo-500 dark:text-white transition-all font-medium"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                                        Category
                                        {aiThinking && <span className="ml-2 text-indigo-500 text-xs animate-pulse font-normal">AI Analyzing...</span>}
                                    </label>
                                    <select
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border-none focus:ring-2 focus:ring-indigo-500 dark:text-white transition-all appearance-none cursor-pointer font-medium"
                                    >
                                        <option value="Hardware">Hardware Issue</option>
                                        <option value="Software">Software Glitch</option>
                                        <option value="Network">Network / Connectivity</option>
                                        <option value="Access">Account Access</option>
                                        <option value="General">General Inquiry</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Urgency Level</label>
                                    <div className="flex bg-slate-50 dark:bg-slate-800 p-1.5 rounded-xl">
                                        {['LOW', 'MEDIUM', 'HIGH'].map((p) => (
                                            <button
                                                key={p}
                                                type="button"
                                                onClick={() => setPriority(p)}
                                                className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all ${priority === p
                                                        ? p === 'HIGH' ? 'bg-red-500 text-white shadow-md'
                                                            : p === 'MEDIUM' ? 'bg-amber-500 text-white shadow-md'
                                                                : 'bg-blue-500 text-white shadow-md'
                                                        : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                                                    }`}
                                            >
                                                {p}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Detailed Description</label>
                                <textarea
                                    value={description}
                                    onChange={handleDescriptionChange}
                                    rows="4"
                                    placeholder="Please provide details about what happened..."
                                    className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border-none focus:ring-2 focus:ring-indigo-500 dark:text-white transition-all resize-none font-medium"
                                    required
                                ></textarea>
                                <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
                                    <Sparkles className="w-3 h-3 text-indigo-500" />
                                    AI will automatically suggest a category based on your description.
                                </p>
                            </div>

                            <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-6 py-3 rounded-xl text-slate-500 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all disabled:opacity-50"
                                >
                                    {loading ? 'Submitting...' : (
                                        <>
                                            Submit Request <Send className="w-4 h-4" />
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
