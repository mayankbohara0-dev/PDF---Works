import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Table, ArrowLeft, Construction } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

const ToExcel = () => {

    return (
        <div className="min-h-screen flex flex-col bg-secondary font-body">
            <SEO
                title="PDF to Excel Converter - Coming Soon"
                description="Convert PDF tables to Excel spreadsheets. Feature coming soon with intelligent table detection and data extraction."
            />
            <Navbar />

            <main className="flex-grow pt-32 pb-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <Link
                        to="/dashboard"
                        className="inline-flex items-center text-gray-400 hover:text-primary mb-8 font-bold transition-colors group"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                        Back to Dashboard
                    </Link>

                    <div className="text-center mb-12">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-teal-50 text-teal-600 rounded-3xl mb-6 shadow-lg">
                            <Table className="w-10 h-10" />
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-bold mb-4 text-text-main">
                            PDF to Excel
                        </h1>
                        <p className="text-lg text-text-body max-w-2xl mx-auto">
                            Extract tables and data from PDFs into editable Excel spreadsheets (.xlsx).
                        </p>
                    </div>

                    <div className="card-base">
                        <div className="text-center py-12">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-50 text-yellow-600 rounded-2xl mb-6">
                                <Construction className="w-8 h-8" />
                            </div>
                            <h2 className="text-2xl font-bold text-text-main mb-4">Feature Coming Soon!</h2>
                            <p className="text-text-body max-w-md mx-auto mb-8">
                                We're developing a powerful PDF to Excel converter with AI-powered table detection and accurate data extraction. Stay tuned!
                            </p>

                            <div className="bg-teal-50 border-2 border-teal-100 rounded-2xl p-6 max-w-md mx-auto text-left">
                                <h3 className="font-bold text-text-main mb-3">What We're Working On</h3>
                                <ul className="space-y-2 text-sm text-text-body">
                                    <li className="flex items-start gap-2">
                                        <span className="text-teal-600 mt-1">•</span>
                                        <span>AI-powered table detection and recognition</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-teal-600 mt-1">•</span>
                                        <span>Preserving cell formatting, formulas, and data types</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-teal-600 mt-1">•</span>
                                        <span>Multi-page table handling and merging</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-teal-600 mt-1">•</span>
                                        <span>Support for complex table structures and nested data</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 card-base">
                        <h2 className="text-2xl font-bold mb-6 text-text-main">Available Tools</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Link to="/protect" className="p-4 bg-red-50 rounded-2xl hover:bg-red-100 transition-colors group">
                                <h3 className="font-bold text-red-600 mb-2 group-hover:underline">Protect PDF</h3>
                                <p className="text-sm text-text-body">Add password encryption</p>
                            </Link>
                            <Link to="/repair" className="p-4 bg-orange-50 rounded-2xl hover:bg-orange-100 transition-colors group">
                                <h3 className="font-bold text-orange-600 mb-2 group-hover:underline">Repair PDF</h3>
                                <p className="text-sm text-text-body">Fix corrupted files</p>
                            </Link>
                            <Link to="/compress" className="p-4 bg-pink-50 rounded-2xl hover:bg-pink-100 transition-colors group">
                                <h3 className="font-bold text-pink-600 mb-2 group-hover:underline">Compress PDF</h3>
                                <p className="text-sm text-text-body">Reduce file size</p>
                            </Link>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default ToExcel;
