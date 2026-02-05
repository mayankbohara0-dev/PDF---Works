import React, { useState } from 'react';
import { supabase } from '../supabase';
import { Link, useNavigate } from 'react-router-dom';
import { FileText, ArrowRight, AlertCircle, Loader } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
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
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-stretch bg-art-white font-body">
            {/* Left Side - Art / Branding */}
            <div className="hidden lg:flex w-1/2 bg-art-black flex-col justify-between p-12 relative overflow-hidden border-r-2 border-art-black">
                {/* Abstract Shapes */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-acid-yellow rounded-full blur-[100px] opacity-20 translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-electric-cyan rounded-full blur-[100px] opacity-20 -translate-x-1/2 translate-y-1/2"></div>

                <div className="relative z-10">
                    <Link to="/" className="inline-flex items-center gap-3 group mb-8">
                        <div className="bg-white text-black p-2 border-2 border-white group-hover:bg-acid-yellow group-hover:text-black transition-colors">
                            <FileText className="h-6 w-6" />
                        </div>
                        <span className="text-3xl font-black uppercase text-white italic tracking-tighter">PDFWorks</span>
                    </Link>
                    <h1 className="text-8xl font-black text-white uppercase leading-none mb-8">
                        Welcome <br />
                        <span className="text-stroke-white">Back.</span>
                    </h1>
                </div>

                <div className="relative z-10 text-white/60">
                    <p className="text-sm font-bold uppercase tracking-widest border-l-2 border-acid-yellow pl-4">
                        Secure Access • Industry Standard • Lightning Fast
                    </p>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-12 relative">
                <Link to="/" className="absolute top-8 left-8 lg:hidden flex items-center gap-2">
                    <FileText className="w-6 h-6" />
                    <span className="font-black uppercase">PDFWorks</span>
                </Link>

                <div className="w-full max-w-md">
                    <div className="mb-10">
                        <h2 className="text-5xl font-black uppercase mb-4">Sign In</h2>
                        <p className="text-lg text-gray-500 font-medium">Continue your work where you left off.</p>
                    </div>

                    {error && (
                        <div className="mb-8 p-4 bg-red-100 border-2 border-red-500 text-red-600 font-bold flex items-center gap-3 animate-slide-up">
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-sm font-black uppercase mb-2">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full p-4 border-2 border-art-black bg-gray-50 focus:bg-white focus:outline-none focus:shadow-[4px_4px_0px_0px_black] transition-all font-bold"
                                placeholder="name@example.com"
                                required
                            />
                        </div>

                        <div>
                            <div className="flex justify-between mb-2">
                                <label className="block text-sm font-black uppercase">Password</label>
                                <a href="#" className="text-sm font-bold text-gray-500 hover:text-black decoration-2 hover:underline">Forgot?</a>
                            </div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full p-4 border-2 border-art-black bg-gray-50 focus:bg-white focus:outline-none focus:shadow-[4px_4px_0px_0px_black] transition-all font-bold"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-brutal w-full group py-5 text-lg"
                        >
                            {loading ? (
                                <Loader className="w-6 h-6 animate-spin mx-auto" />
                            ) : (
                                <span className="flex items-center justify-center gap-2">
                                    SIGN IN ACCOUNT
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </span>
                            )}
                        </button>
                    </form>

                    <div className="mt-10 pt-10 border-t-2 border-gray-100 text-center">
                        <p className="font-bold text-gray-600">
                            Don't have an account?{' '}
                            <Link to="/signup" className="text-black underline decoration-2 decoration-acid-yellow underline-offset-4 hover:bg-acid-yellow transition-colors">
                                Create one for free
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
