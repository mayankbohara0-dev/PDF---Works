import React from 'react';
import { FileText, Github, Twitter, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
    return (
        <footer className="bg-white pt-20 pb-10 border-t border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    <div className="col-span-1 md:col-span-1">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="bg-primary/10 p-2 rounded-xl text-primary">
                                <FileText className="h-6 w-6" />
                            </div>
                            <span className="text-2xl font-bold text-text-main tracking-tight">PDFWorks</span>
                        </div>
                        <p className="text-text-body font-medium leading-relaxed">
                            Making PDF tools simple, friendly, and accessible for everyone.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-bold text-lg mb-6 text-text-main">Tools</h3>
                        <ul className="space-y-4 font-medium text-text-body">
                            <li><Link to="/merge" className="hover:text-primary transition-colors">Merge PDF</Link></li>
                            <li><Link to="/split" className="hover:text-primary transition-colors">Split PDF</Link></li>
                            <li><Link to="/compress" className="hover:text-primary transition-colors">Compress PDF</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-bold text-lg mb-6 text-text-main">Support</h3>
                        <ul className="space-y-4 font-medium text-text-body">
                            <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-bold text-lg mb-6 text-text-main">Connect</h3>
                        <div className="flex gap-4">
                            <a href="#" className="p-3 bg-secondary rounded-full text-text-main hover:bg-primary hover:text-white transition-all hover:-translate-y-1 shadow-sm">
                                <Github className="w-5 h-5" />
                            </a>
                            <a href="#" className="p-3 bg-secondary rounded-full text-text-main hover:bg-primary hover:text-white transition-all hover:-translate-y-1 shadow-sm">
                                <Twitter className="w-5 h-5" />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm font-medium text-gray-400">
                    <p>© 2026 PDFWorks Inc. All rights reserved.</p>
                    <p className="flex items-center gap-1">
                        Made with <Heart className="w-4 h-4 text-red-400 fill-current" />
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
