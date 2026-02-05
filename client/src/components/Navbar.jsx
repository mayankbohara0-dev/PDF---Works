import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FileText, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { user, signOut } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 0);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleSignOut = async () => {
        await signOut();
        navigate('/');
    };

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white border-b-2 border-art-black`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-x-2 border-art-black h-20 bg-white z-50 relative">
                <div className="flex justify-between h-full items-center">

                    {/* Brand */}
                    <div className="flex items-center">
                        <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-2 group">
                            <div className="bg-art-black text-white p-2 border-2 border-art-black group-hover:bg-acid-yellow group-hover:text-black transition-colors">
                                <FileText className="h-6 w-6" />
                            </div>
                            <span className="text-2xl font-black uppercase tracking-tighter italic">PDFWorks</span>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-8">
                        {user ? (
                            <>
                                <Link to="/dashboard" className="font-bold uppercase tracking-wider text-sm hover:underline decoration-2 underline-offset-4">Dashboard</Link>
                                <Link to="/merge" className="font-bold uppercase tracking-wider text-sm hover:underline decoration-2 underline-offset-4">Merge</Link>
                                <Link to="/split" className="font-bold uppercase tracking-wider text-sm hover:underline decoration-2 underline-offset-4">Split</Link>

                                <div className="flex items-center gap-4 ml-4 border-l-2 border-art-black pl-8 h-10">
                                    <span className="font-bold text-xs uppercase tracking-wide hidden lg:block text-gray-500">
                                        {user.email?.split('@')[0]}
                                    </span>
                                    <button
                                        onClick={handleSignOut}
                                        className="btn-brutal px-6 py-2 text-xs bg-red-500 text-white hover:bg-black"
                                    >
                                        Sign Out
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <a href="#features" className="font-bold uppercase tracking-wider text-sm hover:underline decoration-2 underline-offset-4">Features</a>
                                <div className="flex items-center gap-4 ml-4 border-l-2 border-art-black pl-8 h-10">
                                    <Link to="/login" className="font-bold uppercase tracking-wider text-sm hover:bg-acid-yellow px-2 py-1 transition-colors">Sign in</Link>
                                    <Link to="/signup" className="btn-brutal px-6 py-2 text-xs">
                                        Start Free
                                    </Link>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Mobile Toggle */}
                    <div className="md:hidden">
                        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 border-2 border-art-black hover:bg-art-black hover:text-white transition-colors">
                            {mobileMenuOpen ? <X /> : <Menu />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-white border-b-2 border-art-black px-4 py-8 space-y-6 animate-slide-up">
                    {user ? (
                        <>
                            <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="block text-2xl font-black uppercase">Dashboard</Link>
                            <Link to="/merge" onClick={() => setMobileMenuOpen(false)} className="block text-2xl font-black uppercase">Merge</Link>
                            <Link to="/split" onClick={() => setMobileMenuOpen(false)} className="block text-2xl font-black uppercase">Split</Link>
                            <div className="pt-6 border-t-2 border-art-black flex flex-col gap-4">
                                <button onClick={() => { handleSignOut(); setMobileMenuOpen(false); }} className="block w-full text-center bg-red-500 text-white py-4 font-bold uppercase border-2 border-art-black hover:bg-black transition-colors">Sign Out</button>
                            </div>
                        </>
                    ) : (
                        <>
                            <a href="#features" onClick={() => setMobileMenuOpen(false)} className="block text-2xl font-black uppercase">Features</a>
                            <div className="pt-6 border-t-2 border-art-black flex flex-col gap-4">
                                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="block text-center font-bold uppercase py-4 border-2 border-art-black hover:bg-gray-100">Sign in</Link>
                                <Link to="/signup" onClick={() => setMobileMenuOpen(false)} className="block text-center bg-art-black text-white py-4 font-bold uppercase border-2 border-art-black hover:bg-acid-yellow hover:text-black transition-colors">Start Free</Link>
                            </div>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
