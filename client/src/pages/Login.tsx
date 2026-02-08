
import React, { useState } from 'react';
import { supabase } from '../supabase';
import { Link, useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';
import { FileText, ArrowRight, AlertCircle, Loader, Mail, Lock } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            if (error) throw error;
            navigate('/dashboard');
        } catch (error: any) {
            setError(error.message || "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-secondary font-body p-4">
            <SEO
                title="Login"
                description="Access your SwiftPDF account to manage your files and history."
            />

            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
            </div>

            <div className="w-full max-w-5xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row relative z-10">

                {/* Left Side - Brand/Illustration */}
                <div className="hidden md:flex w-1/2 bg-primary p-12 flex-col justify-between relative overflow-hidden text-white">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

                    <div className="relative z-10">
                        <Link to="/" className="inline-flex items-center gap-3 group mb-8">
                            <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm group-hover:scale-110 transition-transform">
                                <FileText className="h-6 w-6 text-white" />
                            </div>
                            <span className="text-2xl font-bold tracking-tight">SwiftPDF</span>
                        </Link>

                        <div className="mt-12">
                            <h1 className="text-5xl font-bold mb-6 leading-tight">
                                Welcome <br /> Back!
                            </h1>
                            <p className="text-blue-100 text-lg max-w-sm leading-relaxed">
                                Access your tools, history, and saved documents. We missed you!
                            </p>
                        </div>
                    </div>

                    <div className="relative z-10 mt-12 flex items-center gap-2 text-sm font-medium text-blue-100">
                        <div className="flex -space-x-2">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="w-8 h-8 rounded-full bg-white/20 border-2 border-primary"></div>
                            ))}
                        </div>
                        <span>Join 10,000+ happy users</span>
                    </div>
                </div>

                {/* Right Side - Form */}
                <div className="w-full md:w-1/2 p-8 md:p-12 lg:p-16 bg-white flex flex-col justify-center">
                    <div className="mb-10 text-center md:text-left">
                        <Link to="/" className="md:hidden inline-flex items-center gap-2 mb-6 text-primary font-bold">
                            <FileText className="h-5 w-5" /> SwiftPDF
                        </Link>
                        <h2 className="text-3xl font-bold text-text-main mb-2">Sign In</h2>
                        <p className="text-text-body">Please enter your details.</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl flex items-center gap-3 text-sm font-bold animate-fade-in-up">
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-5">
                        <div>
                            <label className="block text-sm font-bold text-text-main mb-2 ml-1">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="input-base pl-12"
                                    placeholder="name@example.com"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between mb-2 ml-1">
                                <label className="block text-sm font-bold text-text-main">Password</label>
                                <a href="#" className="text-sm font-bold text-primary hover:text-primary-dark">Forgot password?</a>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="input-base pl-12"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-4 rounded-full font-bold text-lg transition-all transform flex items-center justify-center gap-2
                                ${loading || !email || !password
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-primary text-white hover:bg-primary-dark hover:-translate-y-1 shadow-lg shadow-primary/30'}
                            `}
                        >
                            {loading ? (
                                <Loader className="w-6 h-6 animate-spin mx-auto" />
                            ) : (
                                <span className="flex items-center justify-center gap-2">
                                    Sign In
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </span>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-text-body font-medium">
                            Don't have an account?{' '}
                            <Link to="/signup" className="text-primary font-bold hover:text-primary-dark hover:underline">
                                Sign up for free
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
