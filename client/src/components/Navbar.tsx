
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FileText, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';

const Navbar: React.FC = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { user, signOut } = useAuth();
    const navigate = useNavigate();

    const handleSignOut = async () => {
        await signOut();
        navigate('/');
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 py-4 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white/80 backdrop-blur-md border border-white shadow-soft rounded-full px-6 h-20 flex justify-between items-center">

                    {/* Brand */}
                    <div className="flex items-center">
                        <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-3 group">
                            <div className="bg-primary text-white p-2 rounded-xl shadow-lg shadow-primary/30 group-hover:scale-110 transition-transform">
                                <FileText className="h-6 w-6" />
                            </div>
                            <span className="text-2xl font-bold tracking-tight text-text-main group-hover:text-primary transition-colors">SwiftPDF</span>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-8">
                        {user ? (
                            <>
                                <Link to="/dashboard" className="font-bold text-text-body hover:text-primary transition-colors">Dashboard</Link>
                                <Link to="/merge" className="font-bold text-text-body hover:text-primary transition-colors">Merge</Link>
                                <Link to="/split" className="font-bold text-text-body hover:text-primary transition-colors">Split</Link>

                                <div className="flex items-center gap-4 ml-4 pl-8 border-l border-gray-200">
                                    <ThemeToggle />
                                    <div className="flex items-center gap-2 bg-secondary px-4 py-2 rounded-full">
                                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                        <span className="font-bold text-xs text-text-main truncate max-w-[100px]">
                                            {user.email?.split('@')[0]}
                                        </span>
                                    </div>
                                    <button
                                        onClick={handleSignOut}
                                        className="btn-accent px-6 py-2 text-xs"
                                    >
                                        Sign Out
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <a href="#features" className="font-bold text-text-body hover:text-primary transition-colors">Features</a>
                                <div className="flex items-center gap-4 ml-4 pl-8 border-l border-gray-200">
                                    <ThemeToggle />
                                    <Link to="/login" className="font-bold text-text-main hover:text-primary transition-colors">Sign in</Link>
                                    <Link to="/signup" className="btn-primary px-6 py-2 text-sm shadow-glow hover:shadow-primary/50">
                                        Start Free
                                    </Link>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Mobile Toggle */}
                    <div className="md:hidden flex items-center gap-4">
                        <ThemeToggle />
                        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-text-main hover:bg-secondary rounded-full transition-colors">
                            {mobileMenuOpen ? <X /> : <Menu />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="absolute top-24 left-4 right-4 bg-white rounded-3xl shadow-xl border border-gray-100 p-6 space-y-4 animate-fade-in-up md:hidden z-50">
                    {user ? (
                        <>
                            <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="block text-xl font-bold text-text-main py-2 hover:text-primary">Dashboard</Link>
                            <Link to="/merge" onClick={() => setMobileMenuOpen(false)} className="block text-xl font-bold text-text-main py-2 hover:text-primary">Merge</Link>
                            <Link to="/split" onClick={() => setMobileMenuOpen(false)} className="block text-xl font-bold text-text-main py-2 hover:text-primary">Split</Link>
                            <div className="pt-4 border-t border-gray-100">
                                <button onClick={() => { handleSignOut(); setMobileMenuOpen(false); }} className="w-full btn-accent py-3">Sign Out</button>
                            </div>
                        </>
                    ) : (
                        <>
                            <a href="#features" onClick={() => setMobileMenuOpen(false)} className="block text-xl font-bold text-text-main py-2 hover:text-primary">Features</a>
                            <div className="pt-4 border-t border-gray-100 space-y-3">
                                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="block w-full text-center font-bold text-text-main py-3 border-2 border-transparent hover:bg-secondary rounded-2xl">Sign in</Link>
                                <Link to="/signup" onClick={() => setMobileMenuOpen(false)} className="block w-full btn-primary py-3 text-center">Start Free</Link>
                            </div>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
