import React, { useState } from 'react';
import { supabase } from '../supabase';
import { Link, useNavigate } from 'react-router-dom';
import { FileText, ArrowRight, AlertCircle, Loader } from 'lucide-react';

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const { error } = await supabase.auth.signUp({
                email,
                password,
            });
            if (error) throw error;
            navigate('/dashboard'); // Or show check email message
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-stretch bg-art-white font-body">
            {/* Left Side - Art / Branding */}
            <div className="hidden lg:flex w-1/2 bg-acid-yellow flex-col justify-between p-12 relative overflow-hidden border-r-2 border-art-black">
                {/* Geometric Pattern */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
                <div className="absolute top-20 right-20 w-32 h-32 bg-black rounded-full mix-blend-multiply opacity-10"></div>
                <div className="absolute bottom-40 left-20 w-64 h-64 border-4 border-black rounded-full opacity-10"></div>

                <div className="relative z-10">
                    <Link to="/" className="inline-flex items-center gap-3 group mb-8">
                        <div className="bg-black text-white p-2 border-2 border-black group-hover:bg-white group-hover:text-black transition-colors">
                            <FileText className="h-6 w-6" />
                        </div>
                        <span className="text-3xl font-black uppercase text-black italic tracking-tighter">PDFWorks</span>
                    </Link>
                    <h1 className="text-8xl font-black text-black uppercase leading-none mb-8">
                        Join The <br />
                        Revolution.
                    </h1>
                </div>

                <div className="relative z-10 text-black/80">
                    <p className="text-sm font-bold uppercase tracking-widest border-l-2 border-black pl-4">
                        Start Creating Today • No Credit Card Required
                    </p>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-12 relative bg-white">
                <Link to="/" className="absolute top-8 left-8 lg:hidden flex items-center gap-2">
                    <FileText className="w-6 h-6" />
                    <span className="font-black uppercase">PDFWorks</span>
                </Link>

                <div className="w-full max-w-md">
                    <div className="mb-10">
                        <div className="inline-block px-3 py-1 bg-black text-white text-xs font-bold uppercase tracking-wider mb-4">Free Account</div>
                        <h2 className="text-5xl font-black uppercase mb-4">Sign Up</h2>
                        <p className="text-lg text-gray-500 font-medium">Create your account to unlock full power.</p>
                    </div>

                    {error && (
                        <div className="mb-8 p-4 bg-red-100 border-2 border-red-500 text-red-600 font-bold flex items-center gap-3 animate-slide-up">
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSignup} className="space-y-6">
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
                            <label className="block text-sm font-black uppercase mb-2">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full p-4 border-2 border-art-black bg-gray-50 focus:bg-white focus:outline-none focus:shadow-[4px_4px_0px_0px_black] transition-all font-bold"
                                placeholder="Create a strong password"
                                required
                            />
                            <p className="text-xs font-bold text-gray-400 mt-2 uppercase tracking-wide">Must be at least 6 characters</p>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-brutal w-full group py-5 text-lg bg-acid-yellow hover:bg-black hover:text-white"
                        >
                            {loading ? (
                                <Loader className="w-6 h-6 animate-spin mx-auto" />
                            ) : (
                                <span className="flex items-center justify-center gap-2">
                                    CREATE ACCOUNT
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </span>
                            )}
                        </button>
                    </form>

                    <div className="mt-10 pt-10 border-t-2 border-gray-100 text-center">
                        <p className="font-bold text-gray-600">
                            Already have an account?{' '}
                            <Link to="/login" className="text-black underline decoration-2 decoration-electric-cyan underline-offset-4 hover:bg-electric-cyan transition-colors">
                                Sign in here
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
