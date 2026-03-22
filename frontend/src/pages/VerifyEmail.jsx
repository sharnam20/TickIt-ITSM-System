import { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Loader2, Sparkles } from 'lucide-react';
import axios from 'axios';

export default function VerifyEmail() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('verifying'); // verifying, success, error
    const [message, setMessage] = useState('');
    const hasCalledApi = useRef(false);

    useEffect(() => {
        const token = searchParams.get('token');

        if (!token) {
            setStatus('error');
            setMessage('Invalid verification link');
            return;
        }

        if (hasCalledApi.current) return;
        hasCalledApi.current = true;

        if (!token) {
            setStatus('error');
            setMessage('Invalid verification link');
            return;
        }

        // Verify the email
        console.log(`[VERIFY] Attempting to verify token: ${token}`);
        axios.get(`http://localhost:5001/api/auth/verify-email/${token}`)
            .then(response => {
                console.log("[VERIFY] Success:", response.data);
                setStatus('success');
                setMessage(response.data.message);

                // Auto-login: Save the token
                if (response.data.access_token) {
                    localStorage.setItem('token', response.data.access_token);
                    localStorage.setItem('role', response.data.role);
                    localStorage.setItem('name', response.data.name);

                    // Redirect to dashboard after 2 seconds
                    setTimeout(() => navigate('/dashboard'), 2000);
                } else {
                    // Old users without token - redirect to login
                    setTimeout(() => navigate('/login'), 3000);
                }
            })
            .catch(error => {
                console.error("[VERIFY] Error:", error.response?.data || error.message);
                setStatus('error');
                setMessage(error.response?.data?.error || 'Verification failed');
            });
    }, [searchParams, navigate]);

    return (
        <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex items-center justify-center p-4">
            {/* Background effects */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl animate-pulse delay-500"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative z-10 glass rounded-3xl p-12 max-w-md w-full text-center"
            >
                <div className="mb-6">
                    {status === 'verifying' && (
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="inline-block"
                        >
                            <Loader2 className="w-16 h-16 text-blue-400" />
                        </motion.div>
                    )}

                    {status === 'success' && (
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200 }}
                        >
                            <CheckCircle className="w-16 h-16 text-green-400 mx-auto" />
                        </motion.div>
                    )}

                    {status === 'error' && (
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200 }}
                        >
                            <XCircle className="w-16 h-16 text-red-400 mx-auto" />
                        </motion.div>
                    )}
                </div>

                <h1 className="text-2xl font-bold text-white mb-3">
                    {status === 'verifying' && 'Verifying Your Email...'}
                    {status === 'success' && 'Email Verified!'}
                    {status === 'error' && 'Verification Failed'}
                </h1>

                <p className="text-slate-400 mb-6">
                    {status === 'verifying' && 'Please wait while we verify your email address.'}
                    {status === 'success' && message}
                    {status === 'error' && message}
                </p>

                {status === 'success' && (
                    <p className="text-sm text-slate-500">
                        Redirecting to login page...
                    </p>
                )}

                {status === 'error' && (
                    <button
                        onClick={() => navigate('/login')}
                        className="mt-4 px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                    >
                        Go to Login
                    </button>
                )}
            </motion.div>
        </div>
    );
}
