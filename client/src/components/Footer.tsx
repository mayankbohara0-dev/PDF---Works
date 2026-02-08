import React from 'react';
import { FileText, Github, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
    return (
        <footer className="bg-art-black text-white pt-20 pb-10 border-t-2 border-art-black">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    <div className="col-span-1 md:col-span-1">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="bg-acid-yellow p-2 border-2 border-white">
                                <FileText className="h-6 w-6 text-black" />
                            </div>
                            <span className="text-3xl font-black uppercase italic tracking-tighter">PDFWorks</span>
                        </div>
                        <p className="text-gray-400 font-medium max-w-xs">
                            Brutally efficient PDF tools for the modern web.
                            <span className="block mt-4 text-white">No fluff. Just power.</span>
                        </p>
                    </div>

                    <div>
                        <h3 className="font-black text-xl uppercase mb-6 text-acid-yellow">Tools</h3>
                        <ul className="space-y-4 font-bold tracking-wide">
                            <li><Link to="/merge" className="hover:text-acid-yellow hover:underline decoration-2 underline-offset-4 transition-all">MERGE PDF</Link></li>
                            <li><Link to="/split" className="hover:text-electric-cyan hover:underline decoration-2 underline-offset-4 transition-all">SPLIT PDF</Link></li>
                            <li><Link to="/compress" className="hover:text-hot-pink hover:underline decoration-2 underline-offset-4 transition-all">COMPRESS PDF</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-black text-xl uppercase mb-6 text-electric-cyan">Support</h3>
                        <ul className="space-y-4 font-bold tracking-wide">
                            <li><a href="#" className="hover:text-electric-cyan transition-colors">HELP CENTER</a></li>
                            <li><a href="#" className="hover:text-electric-cyan transition-colors">PRIVACY</a></li>
                            <li><a href="#" className="hover:text-electric-cyan transition-colors">TERMS</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-black text-xl uppercase mb-6 text-hot-pink">Social</h3>
                        <div className="flex gap-4">
                            <a href="#" className="p-3 bg-white text-black border-2 border-transparent hover:bg-black hover:text-white hover:border-white transition-all">
                                <Github className="w-6 h-6" />
                            </a>
                            <a href="#" className="p-3 bg-white text-black border-2 border-transparent hover:bg-black hover:text-white hover:border-white transition-all">
                                <Twitter className="w-6 h-6" />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="border-t-2 border-white/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="font-bold text-gray-500 uppercase tracking-wider">© 2026 PDFWorks Inc.</p>
                    <p className="font-bold uppercase tracking-wider">
                        Designed with <span className="text-hot-pink">VOLTAGE</span>
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
