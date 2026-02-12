import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { FileText, ArrowLeft, Construction } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

const ToWord = () => {

    return (
        <div className="min-h-screen flex flex-col bg-secondary font-body">
            <SEO
                title="PDF to Word Converter - Coming Soon"
                description="Convert PDF to editable Word documents. Feature coming soon with advanced OCR and layout detection."
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
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-50 text-blue-600 rounded-3xl mb-6 shadow-lg">
                            <FileText className="w-10 h-10" />
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-bold mb-4 text-text-main">
                            PDF to Word
                        </h1>
                        <p className="text-lg text-text-body max-w-2xl mx-auto">
                            Convert your PDFs into editable Word documents (.docx) with preserved formatting.
                        </p>
                    </div>

                    <div className="card-base">
                        <div className="text-center py-12">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-50 text-yellow-600 rounded-2xl mb-6">
                                <Construction className="w-8 h-8" />
                            </div>
                            <h2 className="text-2xl font-bold text-text-main mb-4">Feature Coming Soon!</h2>
                            <p className="text-text-body max-w-md mx-auto mb-8">
                                We're working on bringing you high-quality PDF to Word conversion with advanced OCR and intelligent layout detection. This feature will be available soon!
                            </p>

                            <div className="bg-blue-50 border-2 border-blue-100 rounded-2xl p-6 max-w-md mx-auto text-left">
                                <h3 className="font-bold text-text-main mb-3">Why We Need More Time</h3>
                                <ul className="space-y-2 text-sm text-text-body">
                                    <li className="flex items-start gap-2">
                                        <span className="text-blue-600 mt-1">•</span>
                                        <span>Accurate OCR (text recognition) for scanned PDFs</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-blue-600 mt-1">•</span>
                                        <span>Preserving complex layouts, tables, and formatting</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-blue-600 mt-1">•</span>
                                        <span>Handling images, fonts, and embedded content</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-blue-600 mt-1">•</span>
                                        <span>Ensuring the output is fully editable in Microsoft Word</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 card-base">
                        <h2 className="text-2xl font-bold mb-6 text-text-main">Try These Tools Instead</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Link to="/merge" className="p-4 bg-blue-50 rounded-2xl hover:bg-blue-100 transition-colors group">
                                <h3 className="font-bold text-blue-600 mb-2 group-hover:underline">Merge PDFs</h3>
                                <p className="text-sm text-text-body">Combine multiple PDFs</p>
                            </Link>
                            <Link to="/split" className="p-4 bg-purple-50 rounded-2xl hover:bg-purple-100 transition-colors group">
                                <h3 className="font-bold text-purple-600 mb-2 group-hover:underline">Split PDF</h3>
                                <p className="text-sm text-text-body">Extract specific pages</p>
                            </Link>
                            <Link to="/to-image" className="p-4 bg-green-50 rounded-2xl hover:bg-green-100 transition-colors group">
                                <h3 className="font-bold text-green-600 mb-2 group-hover:underline">PDF to Image</h3>
                                <p className="text-sm text-text-body">Convert to PNG/JPG</p>
                            </Link>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default ToWord;
