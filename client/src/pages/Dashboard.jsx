import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Layers, Scissors, Minimize2, ArrowRight, Zap, Shield, Globe } from 'lucide-react';

const Dashboard = () => {
    const { user } = useAuth();

    const tools = [
        {
            icon: Layers,
            title: "Merge PDFs",
            description: "Combine multiple PDF files into one master document.",
            path: "/merge",
            color: "acid-yellow",
            border: "group-hover:border-acid-yellow"
        },
        {
            icon: Scissors,
            title: "Split PDF",
            description: "Extract pages or split into multiple files.",
            path: "/split",
            color: "electric-cyan",
            border: "group-hover:border-electric-cyan"
        },
        {
            icon: Minimize2,
            title: "Compress PDF",
            description: "Reduce file size with AI optimization.",
            path: "/compress",
            color: "hot-pink",
            border: "group-hover:border-hot-pink"
        }
    ];

    return (
        <div className="min-h-screen flex flex-col bg-art-white font-body">
            <Navbar />

            <main className="flex-grow pt-32 pb-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Welcome Section */}
                    <div className="mb-16 border-l-4 border-art-black pl-8 animate-slide-up bg-white py-8 border-y-2 border-r-2 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-art-black text-white text-xs font-bold uppercase tracking-wider mb-4">
                            <Zap className="w-3 h-3 text-acid-yellow" />
                            Dashboard
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black uppercase mb-4 leading-none">
                            HELLO, <br />
                            <span className="text-stroke">{user?.email?.split('@')[0] || 'CREATOR'}</span>
                        </h1>
                        <p className="text-xl font-medium text-gray-500 max-w-2xl border-t-2 border-gray-200 pt-4 mt-4">
                            Select a tool below to begin your document operations.
                        </p>
                    </div>

                    {/* Tools Grid */}
                    <div className="grid md:grid-cols-3 gap-0 border-2 border-art-black bg-white mb-20 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                        {tools.map((tool, idx) => (
                            <Link
                                key={idx}
                                to={tool.path}
                                className={`group relative block p-10 border-b-2 md:border-b-0 md:border-r-2 border-art-black last:border-0 hover:bg-gray-50 transition-colors cursor-pointer overflow-hidden`}
                            >
                                <div className={`absolute top-0 right-0 p-2 bg-${tool.color === 'acid-yellow' ? 'acid-yellow' : tool.color === 'electric-cyan' ? 'electric-cyan' : 'hot-pink'} border-l-2 border-b-2 border-art-black font-bold text-xs uppercase opacity-0 group-hover:opacity-100 transition-opacity`}>
                                    Run Tool
                                </div>

                                <div className="mb-8 relative z-10">
                                    <tool.icon className={`w-12 h-12 text-black mb-6 group-hover:scale-110 transition-transform duration-300`} />
                                    <h3 className="text-3xl font-black uppercase mb-4 decoration-4 underline-offset-4 group-hover:underline">
                                        {tool.title}
                                    </h3>
                                    <p className="text-gray-600 font-medium leading-relaxed mb-8 h-12">
                                        {tool.description}
                                    </p>
                                </div>

                                <div className="flex items-center justify-between mt-auto">
                                    <span className="font-bold text-sm uppercase tracking-wider text-gray-400 group-hover:text-black transition-colors">Start Now</span>
                                    <div className="bg-art-black text-white p-2 group-hover:bg-acid-yellow group-hover:text-black transition-colors border-2 border-transparent group-hover:border-art-black">
                                        <ArrowRight className="w-5 h-5" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* Quick Stats */}
                    <div className="bg-art-black text-white p-12 border-2 border-art-black animate-slide-up shadow-[8px_8px_0px_0px_#CCFF00]" style={{ animationDelay: '0.4s' }}>
                        <div className="grid md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-gray-700">
                            <div className="pb-8 md:pb-0">
                                <Globe className="w-8 h-8 mx-auto mb-4 text-electric-cyan" />
                                <div className="text-5xl font-black mb-2">∞</div>
                                <div className="text-sm font-bold text-gray-400 uppercase tracking-widest">Files Processed</div>
                            </div>
                            <div className="py-8 md:py-0">
                                <Shield className="w-8 h-8 mx-auto mb-4 text-hot-pink" />
                                <div className="text-5xl font-black mb-2">100%</div>
                                <div className="text-sm font-bold text-gray-400 uppercase tracking-widest">Secure & Private</div>
                            </div>
                            <div className="pt-8 md:pt-0">
                                <Zap className="w-8 h-8 mx-auto mb-4 text-acid-yellow" />
                                <div className="text-5xl font-black mb-2">&lt;2s</div>
                                <div className="text-sm font-bold text-gray-400 uppercase tracking-widest">Average Speed</div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Dashboard;
