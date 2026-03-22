import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, AlertCircle, ArrowLeft, ShieldCheck, CheckCircle2, Send } from 'lucide-react';
import axios from 'axios';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await axios.post('http://localhost:5001/api/auth/forgot-password', { email });
            setSent(true);
        } catch (err) {
            setError(err.response?.data?.error || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-slate-50 dark:bg-[#0F172A] text-slate-900 dark:text-slate-100 font-sans">

            {/* Left Side: Branding */}
            <div className="hidden lg:flex flex-col justify-between p-16 bg-[#0B1120] relative overflow-hidden border-r border-slate-800">
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-12">
                        <div className="bg-blue-600 p-2.5 rounded-lg">
                            <ShieldCheck className="text-white w-6 h-6" />
                        </div>
                        <span className="text-2xl font-bold tracking-tight text-white">IT Operations Console</span>
                    </div>

                    <h2 className="text-5xl font-extrabold text-white leading-tight mb-6">
                        Password<br />
                        <span className="text-blue-500">Recovery</span>
                    </h2>
                    <p className="text-lg text-slate-400 max-w-md leading-relaxed">
                        Don't worry — it happens to everyone. We'll send you a secure link to reset your password.
                    </p>
                </div>

                <div className="relative z-10 space-y-6">
                    <div className="flex items-center gap-4 text-slate-300">
                        <CheckCircle2 className="text-emerald-500 w-5 h-5" />
                        <span className="font-medium">Secure Token-Based Reset</span>
                    </div>
                    <div className="flex items-center gap-4 text-slate-300">
                        <CheckCircle2 className="text-emerald-500 w-5 h-5" />
                        <span className="font-medium">1-Hour Expiry for Safety</span>
                    </div>
                    <div className="flex items-center gap-4 text-slate-300">
                        <CheckCircle2 className="text-emerald-500 w-5 h-5" />
                        <span className="font-medium">Encrypted Password Storage</span>
                    </div>
                </div>

                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3B82F6_1px,transparent_1px)] [background-size:24px_24px]"></div>
            </div>

            {/* Right Side: Form */}
            <div className="flex items-center justify-center p-8 sm:p-12 lg:p-24 bg-slate-50 dark:bg-[#0F172A]">
                <div className="w-full max-w-md space-y-8">

                    <AnimatePresence mode="wait">
                        {!sent ? (
                            <motion.div
                                key="form"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="mb-10">
                                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Forgot your password?</h1>
                                    <p className="mt-2 text-slate-600 dark:text-slate-400">
                                        Enter your registered email address and we'll send you a reset link.
                                    </p>
                                </div>

                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="p-4 rounded-lg bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/30 flex items-start gap-3 mb-6"
                                    >
                                        <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                                        <p className="text-sm text-red-700 dark:text-red-300 font-medium">{error}</p>
                                    </motion.div>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Work Email</label>
                                        <div className="relative">
                                            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                            <input
                                                type="email"
                                                required
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg py-3 pl-11 pr-4 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm font-medium"
                                                placeholder="name@company.com"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-6"
                                    >
                                        {loading ? (
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                <Send className="w-4 h-4" />
                                                <span>Send Reset Link</span>
                                            </>
                                        )}
                                    </button>
                                </form>

                                <div className="mt-8 text-center pt-6 border-t border-slate-200 dark:border-slate-800">
                                    <Link to="/login" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center justify-center gap-2 text-sm">
                                        <ArrowLeft className="w-4 h-4" />
                                        Back to Sign In
                                    </Link>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.4 }}
                                className="text-center"
                            >
                                <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Mail className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
                                </div>
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Check Your Email!</h2>
                                <p className="text-slate-600 dark:text-slate-400 mb-2">
                                    We've sent a password reset link to:
                                </p>
                                <p className="text-blue-600 dark:text-blue-400 font-semibold text-lg mb-6">{email}</p>
                                <p className="text-sm text-slate-500 mb-8">
                                    Click the link in the email to reset your password. The link expires in <strong>1 hour</strong>.
                                </p>

                                <div className="space-y-3">
                                    <button
                                        onClick={() => { setSent(false); setEmail(''); }}
                                        className="w-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold py-3 rounded-lg transition-all text-sm"
                                    >
                                        Try a different email
                                    </button>
                                    <Link to="/login" className="block w-full text-center text-blue-600 dark:text-blue-400 font-semibold hover:underline text-sm mt-4">
                                        <ArrowLeft className="w-4 h-4 inline mr-1" />
                                        Back to Sign In
                                    </Link>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="text-center mt-8">
                        <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold flex items-center justify-center gap-2">
                            Secure Server Connection <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
