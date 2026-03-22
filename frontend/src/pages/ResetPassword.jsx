import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, AlertCircle, ArrowRight, ShieldCheck, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';

export default function ResetPassword() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);

        try {
            const res = await axios.post(`http://localhost:5001/api/auth/reset-password/${token}`, {
                password
            });
            setSuccess(true);
        } catch (err) {
            setError(err.response?.data?.error || 'Something went wrong. The link may be invalid or expired.');
        } finally {
            setLoading(false);
        }
    };

    // If no token in URL, show error
    if (!token) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0F172A] p-8">
                <div className="text-center max-w-md">
                    <div className="w-20 h-20 bg-red-100 dark:bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <AlertCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Invalid Reset Link</h2>
                    <p className="text-slate-600 dark:text-slate-400 mb-6">
                        This password reset link is missing a valid token. Please request a new link.
                    </p>
                    <Link to="/forgot-password" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-all">
                        Request New Link
                    </Link>
                </div>
            </div>
        );
    }

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
                        Set Your<br />
                        <span className="text-blue-500">New Password</span>
                    </h2>
                    <p className="text-lg text-slate-400 max-w-md leading-relaxed">
                        Choose a strong password to keep your account secure.
                    </p>
                </div>

                <div className="relative z-10 space-y-6">
                    <div className="flex items-center gap-4 text-slate-300">
                        <CheckCircle2 className="text-emerald-500 w-5 h-5" />
                        <span className="font-medium">Minimum 6 characters</span>
                    </div>
                    <div className="flex items-center gap-4 text-slate-300">
                        <CheckCircle2 className="text-emerald-500 w-5 h-5" />
                        <span className="font-medium">Encrypted with Bcrypt</span>
                    </div>
                    <div className="flex items-center gap-4 text-slate-300">
                        <CheckCircle2 className="text-emerald-500 w-5 h-5" />
                        <span className="font-medium">Instant Login After Reset</span>
                    </div>
                </div>

                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3B82F6_1px,transparent_1px)] [background-size:24px_24px]"></div>
            </div>

            {/* Right Side: Form */}
            <div className="flex items-center justify-center p-8 sm:p-12 lg:p-24 bg-slate-50 dark:bg-[#0F172A]">
                <div className="w-full max-w-md space-y-8">

                    <AnimatePresence mode="wait">
                        {!success ? (
                            <motion.div
                                key="form"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="mb-10">
                                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Create new password</h1>
                                    <p className="mt-2 text-slate-600 dark:text-slate-400">
                                        Your new password must be at least 6 characters long.
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
                                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">New Password</label>
                                        <div className="relative">
                                            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                required
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg py-3 pl-11 pr-12 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm font-medium"
                                                placeholder="Enter new password"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                                            >
                                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Confirm Password</label>
                                        <div className="relative">
                                            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                required
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg py-3 pl-11 pr-4 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm font-medium"
                                                placeholder="Confirm new password"
                                            />
                                        </div>
                                        {confirmPassword && password !== confirmPassword && (
                                            <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
                                        )}
                                        {confirmPassword && password === confirmPassword && (
                                            <p className="text-xs text-emerald-500 mt-1 flex items-center gap-1">
                                                <CheckCircle2 className="w-3 h-3" /> Passwords match
                                            </p>
                                        )}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading || !password || !confirmPassword || password !== confirmPassword}
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-6"
                                    >
                                        {loading ? (
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                <span>Reset Password</span>
                                                <ArrowRight className="w-4 h-4" />
                                            </>
                                        )}
                                    </button>
                                </form>
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
                                    <CheckCircle2 className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
                                </div>
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Password Reset Successful!</h2>
                                <p className="text-slate-600 dark:text-slate-400 mb-8">
                                    Your password has been updated. You can now sign in with your new password.
                                </p>
                                <Link
                                    to="/login"
                                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg shadow-sm hover:shadow transition-all"
                                >
                                    <span>Go to Sign In</span>
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
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
