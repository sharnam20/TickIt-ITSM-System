import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, AlertCircle, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const result = await login(email, password);
            if (result.success) {
                navigate('/dashboard');
            } else {
                setError(result.error || 'Invalid credentials');
            }
        } catch (err) {
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-slate-50 dark:bg-[#0F172A] text-slate-900 dark:text-slate-100 font-sans">

            {/* Left Side: Corporate Branding & Value Prop */}
            <div className="hidden lg:flex flex-col justify-between p-16 bg-[#0B1120] relative overflow-hidden border-r border-slate-800">
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-12">
                        <div className="bg-blue-600 p-2.5 rounded-lg">
                            <ShieldCheck className="text-white w-6 h-6" />
                        </div>
                        <span className="text-2xl font-bold tracking-tight text-white">IT Operations Console</span>
                    </div>

                    <h2 className="text-5xl font-extrabold text-white leading-tight mb-6">
                        Enterprise Grade<br />
                        <span className="text-blue-500">Service Management</span>
                    </h2>
                    <p className="text-lg text-slate-400 max-w-md leading-relaxed">
                        Secure, scalable, and intelligent ticket resolution for high-performance teams.
                    </p>
                </div>

                <div className="relative z-10 space-y-6">
                    <div className="flex items-center gap-4 text-slate-300">
                        <CheckCircle2 className="text-emerald-500 w-5 h-5" />
                        <span className="font-medium">SOC2 Compliant Security</span>
                    </div>
                    <div className="flex items-center gap-4 text-slate-300">
                        <CheckCircle2 className="text-emerald-500 w-5 h-5" />
                        <span className="font-medium">99.99% Guaranteed SLA Uptime</span>
                    </div>
                    <div className="flex items-center gap-4 text-slate-300">
                        <CheckCircle2 className="text-emerald-500 w-5 h-5" />
                        <span className="font-medium">AI-Driven Incident Routing</span>
                    </div>
                </div>

                {/* Subtle Background Pattern */}
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3B82F6_1px,transparent_1px)] [background-size:24px_24px]"></div>
            </div>

            {/* Right Side: Authentication Form */}
            <div className="flex items-center justify-center p-8 sm:p-12 lg:p-24 bg-slate-50 dark:bg-[#0F172A]">
                <div className="w-full max-w-md space-y-8">

                    <div className="mb-10">
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Sign in to platform</h1>
                        <p className="mt-2 text-slate-600 dark:text-slate-400">Please enter your company credentials.</p>
                    </div>

                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="p-4 rounded-lg bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/30 flex items-start gap-3"
                            >
                                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                                <p className="text-sm text-red-700 dark:text-red-300 font-medium">{error}</p>
                            </motion.div>
                        )}
                    </AnimatePresence>

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

                        <div className="space-y-1.5">
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Password</label>
                                <Link to="/forgot-password" className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-500 hover:underline">Forgot password?</Link>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg py-3 pl-11 pr-4 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm font-medium"
                                    placeholder="••••••••"
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
                                    <span>Sign In</span>
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center pt-6 border-t border-slate-200 dark:border-slate-800">
                        <p className="text-slate-500 text-sm">
                            New to the platform?{' '}
                            <Link to="/register" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">
                                Request access
                            </Link>
                        </p>
                    </div>

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
