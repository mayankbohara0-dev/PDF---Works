
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FileText, Menu, X, Search, Layers, Scissors, Minimize2, Wrench, Image as ImageIcon, Shield, FileText as WordIcon, Table } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';

const tools = [
    { icon: Layers, title: 'Merge PDFs', path: '/merge' },
    { icon: Scissors, title: 'Split PDF', path: '/split' },
    { icon: Minimize2, title: 'Compress PDF', path: '/compress' },
    { icon: Wrench, title: 'Repair PDF', path: '/repair' },
    { icon: ImageIcon, title: 'PDF to Image', path: '/to-image' },
    { icon: Shield, title: 'Protect PDF', path: '/protect' },
    { icon: WordIcon, title: 'PDF to Word', path: '/to-word' },
    { icon: Table, title: 'PDF to Excel', path: '/to-excel' },
];

const Navbar: React.FC = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const { user, signOut } = useAuth();
    const navigate = useNavigate();

    const filteredTools = tools.filter(t =>
        t.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Shrink navbar on scroll
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 60);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleSignOut = async () => {
        await signOut();
        navigate('/');
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 py-4 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className={`bg-white/80 backdrop-blur-md border border-white shadow-soft rounded-full px-6 flex justify-between items-center transition-all duration-300 ${scrolled ? 'h-14 shadow-lg shadow-primary/10' : 'h-20'}`}>

                    {/* Brand */}
                    <div className="flex items-center">
                        <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-3 group">
                            <div className={`bg-primary text-white rounded-xl shadow-lg shadow-primary/30 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-[-6deg] ${scrolled ? 'p-1.5' : 'p-2'}`}>
                                <FileText className={`transition-all duration-300 ${scrolled ? 'h-5 w-5' : 'h-6 w-6'}`} />
                            </div>
                            <span className={`font-bold tracking-tight text-text-main group-hover:text-primary transition-all duration-300 ${scrolled ? 'text-xl' : 'text-2xl'}`}>SwiftPDF</span>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-8">
                        {user ? (
                            <>
                                <Link to="/dashboard" className="font-bold text-text-body hover:text-primary transition-colors relative group">
                                    Dashboard
                                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary rounded-full transition-all duration-300 group-hover:w-full"></span>
                                </Link>
                                <Link to="/merge" className="font-bold text-text-body hover:text-primary transition-colors relative group">
                                    Merge
                                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary rounded-full transition-all duration-300 group-hover:w-full"></span>
                                </Link>
                                <Link to="/split" className="font-bold text-text-body hover:text-primary transition-colors relative group">
                                    Split
                                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary rounded-full transition-all duration-300 group-hover:w-full"></span>
                                </Link>

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
                                <a href="#features" className="font-bold text-text-body hover:text-primary transition-colors relative group">
                                    Features
                                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary rounded-full transition-all duration-300 group-hover:w-full"></span>
                                </a>
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
                        <button
                            onClick={() => setSearchOpen(!searchOpen)}
                            className="p-2 text-text-main hover:bg-secondary rounded-full"
                        >
                            <Search className="w-5 h-5" />
                        </button>
                        <ThemeToggle />
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="p-2 text-text-main hover:bg-secondary rounded-full transition-all hover:rotate-90 duration-300"
                        >
                            {mobileMenuOpen ? <X className="transition-transform" /> : <Menu className="transition-transform" />}
                        </button>
                    </div>
                </div>

                {/* Search Overlay */}
                {searchOpen && (
                    <div className="mt-4 animate-fade-in-up">
                        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-4">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Search tools (e.g. compress, merge)..."
                                    className="w-full bg-secondary border-none rounded-2xl py-3 pl-12 pr-4 font-bold text-text-main focus:ring-2 focus:ring-primary/20"
                                    autoFocus
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            {searchQuery && (
                                <div className="mt-4 grid grid-cols-1 gap-2 max-h-[300px] overflow-y-auto">
                                    {filteredTools.map((tool, idx) => (
                                        <Link
                                            key={idx}
                                            to={tool.path}
                                            onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                                            className="flex items-center gap-4 p-3 hover:bg-primary/5 rounded-2xl transition-colors group"
                                        >
                                            <div className="w-10 h-10 bg-secondary group-hover:bg-white rounded-xl flex items-center justify-center transition-colors">
                                                <tool.icon className="w-5 h-5 text-primary" />
                                            </div>
                                            <span className="font-bold text-text-main">{tool.title}</span>
                                        </Link>
                                    ))}
                                    {filteredTools.length === 0 && (
                                        <p className="text-center py-4 text-gray-400 font-medium">No tools found matching "{searchQuery}"</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="absolute top-24 left-4 right-4 bg-white rounded-3xl shadow-xl border border-gray-100 p-6 space-y-4 animate-fade-in-up md:hidden z-50">
                    {user ? (
                        <>
                            <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="block text-xl font-bold text-text-main py-2 hover:text-primary transition-colors">Dashboard</Link>
                            <Link to="/merge" onClick={() => setMobileMenuOpen(false)} className="block text-xl font-bold text-text-main py-2 hover:text-primary transition-colors">Merge</Link>
                            <Link to="/split" onClick={() => setMobileMenuOpen(false)} className="block text-xl font-bold text-text-main py-2 hover:text-primary transition-colors">Split</Link>
                            <div className="pt-4 border-t border-gray-100">
                                <button onClick={() => { handleSignOut(); setMobileMenuOpen(false); }} className="w-full btn-accent py-3">Sign Out</button>
                            </div>
                        </>
                    ) : (
                        <>
                            <a href="#features" onClick={() => setMobileMenuOpen(false)} className="block text-xl font-bold text-text-main py-2 hover:text-primary transition-colors">Features</a>
                            <div className="pt-4 border-t border-gray-100 space-y-3">
                                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="block w-full text-center font-bold text-text-main py-3 border-2 border-transparent hover:bg-secondary rounded-2xl transition-colors">Sign in</Link>
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
