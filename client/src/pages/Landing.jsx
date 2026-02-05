import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Layers, Scissors, Minimize2, ArrowRight, Zap, Shield, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

const Landing = () => {
    const [mount, setMount] = useState(false);

    useEffect(() => {
        setMount(true);
    }, []);

    return (
        <div className="min-h-screen bg-art-white text-art-black font-body">
            <Navbar />

            <main className="pt-20">
                {/* Hero Section */}
                <section className="border-b-2 border-art-black bg-acid-yellow/10">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-x-2 border-art-black py-24 md:py-32 relative overflow-hidden">

                        {/* Decorative Background Text */}
                        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-5">
                            <div className="text-[20vw] font-black leading-none whitespace-nowrap animate-marquee">
                                PDF TOOLS REIMAGINED THE FUTURE OF DOCUMENTS
                            </div>
                        </div>

                        <div className={`relative z-10 transition-all duration-1000 ${mount ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                            <div className="inline-block bg-art-black text-white px-4 py-1 font-bold uppercase tracking-wider text-xs mb-6 rotate-[-2deg]">
                                Total Control Over Your Files
                            </div>

                            <h1 className="text-mega mb-8 uppercase">
                                Master Your <br />
                                <span className="text-stroke">Documents.</span>
                            </h1>

                            <p className="text-xl md:text-2xl font-bold max-w-2xl mb-12 leading-tight">
                                High-performance PDF manipulation tools for the modern creative.
                                <span className="bg-acid-yellow px-2 ml-2">Fast. Secure. Brutally efficient.</span>
                            </p>

                            <div className="flex flex-col sm:flex-row gap-6">
                                <Link to="/signup" className="btn-brutal group">
                                    Start Creating
                                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <a href="#features" className="btn-brutal-secondary">
                                    Explore Tools
                                </a>
                            </div>
                        </div>

                        {/* Abstract Hero Art */}
                        <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/4 w-[600px] h-[600px] bg-electric-cyan rounded-full mix-blend-multiply filter blur-3xl opacity-20 pointer-events-none animate-pulse-fast"></div>
                        <div className="absolute bottom-0 right-1/4 translate-y-1/4 w-[500px] h-[500px] bg-hot-pink rounded-full mix-blend-multiply filter blur-3xl opacity-20 pointer-events-none"></div>
                    </div>
                </section>

                {/* Marquee Separator */}
                <div className="bg-art-black text-acid-yellow py-4 overflow-hidden border-y-2 border-art-black">
                    <div className="animate-marquee whitespace-nowrap font-display font-black text-2xl uppercase tracking-widest">
                        Values • Speed • Security • Precision • PDFWorks • Values • Speed • Security • Precision • PDFWorks • Values • Speed • Security • Precision • PDFWorks
                    </div>
                </div>

                {/* Features Grid */}
                <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-x-2 border-art-black bg-white">
                    <div className="grid-brutal">
                        {/* Feature 1 */}
                        <div className="col-span-1 md:col-span-4 group hover:bg-art-gray transition-colors">
                            <Layers className="w-12 h-12 mb-6 group-hover:scale-110 transition-transform" />
                            <h3 className="text-3xl font-black mb-4 uppercase">Merge</h3>
                            <p className="text-lg font-medium leading-relaxed mb-8">
                                Combine multiple files into a single master document. Drag, drop, and reorganize with precision.
                            </p>
                            <Link to="/merge" className="text-sm font-bold uppercase underline decoration-2 decoration-acid-yellow underline-offset-4 hover:bg-acid-yellow transition-colors">
                                Try Merge ->
                            </Link>
                        </div>

                        {/* Feature 2 */}
                        <div className="col-span-1 md:col-span-4 group hover:bg-art-gray transition-colors border-l-2 border-art-black md:border-l-0">
                            <Scissors className="w-12 h-12 mb-6 group-hover:scale-110 transition-transform" />
                            <h3 className="text-3xl font-black mb-4 uppercase">Split</h3>
                            <p className="text-lg font-medium leading-relaxed mb-8">
                                Extract specific pages or divide documents. Precision tools for exact requirements.
                            </p>
                            <Link to="/split" className="text-sm font-bold uppercase underline decoration-2 decoration-electric-cyan underline-offset-4 hover:bg-electric-cyan transition-colors">
                                Try Split ->
                            </Link>
                        </div>

                        {/* Feature 3 */}
                        <div className="col-span-1 md:col-span-4 group hover:bg-art-gray transition-colors border-l-2 border-art-black md:border-l-0">
                            <Minimize2 className="w-12 h-12 mb-6 group-hover:scale-110 transition-transform" />
                            <h3 className="text-3xl font-black mb-4 uppercase">Compress</h3>
                            <p className="text-lg font-medium leading-relaxed mb-8">
                                Optimize file size without losing quality. AI-driven compression algorithms.
                            </p>
                            <Link to="/compress" className="text-sm font-bold uppercase underline decoration-2 decoration-hot-pink underline-offset-4 hover:bg-hot-pink transition-colors">
                                Try Compress ->
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Stats Section with Brutalist Grid */}
                <section className="bg-art-black text-white border-y-2 border-art-black">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-x-2 border-white/20">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                            <div className="p-16 border-b md:border-b-0 md:border-r border-white/20 flex flex-col justify-center">
                                <h2 className="text-5xl md:text-7xl font-black mb-6">
                                    BUILT FOR <br />
                                    <span className="text-acid-yellow">SPEED</span>
                                </h2>
                                <p className="text-xl text-gray-400 max-w-md">
                                    Our infrastructure handles millions of operations daily with zero downtime.
                                </p>
                            </div>
                            <div className="grid grid-cols-2">
                                <div className="p-8 border-r border-b border-white/20 flex flex-col justify-center items-center text-center">
                                    <Zap className="w-8 h-8 mb-4 text-electric-cyan" />
                                    <div className="text-4xl font-black">0.2s</div>
                                    <div className="text-sm font-bold text-gray-400 uppercase tracking-wider">Processing</div>
                                </div>
                                <div className="p-8 border-b border-white/20 flex flex-col justify-center items-center text-center">
                                    <Shield className="w-8 h-8 mb-4 text-hot-pink" />
                                    <div className="text-4xl font-black">256</div>
                                    <div className="text-sm font-bold text-gray-400 uppercase tracking-wider">Bit Security</div>
                                </div>
                                <div className="p-8 border-r border-white/20 flex flex-col justify-center items-center text-center">
                                    <Globe className="w-8 h-8 mb-4 text-acid-yellow" />
                                    <div className="text-4xl font-black">1M+</div>
                                    <div className="text-sm font-bold text-gray-400 uppercase tracking-wider">Users</div>
                                </div>
                                <div className="p-8 flex flex-col justify-center items-center text-center">
                                    <Layers className="w-8 h-8 mb-4 text-white" />
                                    <div className="text-4xl font-black">∞</div>
                                    <div className="text-sm font-bold text-gray-400 uppercase tracking-wider">Possibilities</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="py-32 bg-acid-yellow border-b-2 border-art-black">
                    <div className="max-w-4xl mx-auto px-4 text-center">
                        <h2 className="text-6xl md:text-8xl font-black mb-8 uppercase tracking-tighter">
                            Ready to <br />Start?
                        </h2>
                        <Link to="/signup" className="inline-block bg-art-black text-white px-12 py-6 text-xl font-bold uppercase tracking-widest hover:scale-105 hover:-rotate-2 transition-transform shadow-[8px_8px_0px_0px_white]">
                            Create Free Account
                        </Link>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default Landing;
