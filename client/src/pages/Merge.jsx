import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FileUploader from '../components/FileUploader';
import { Layers, ArrowLeft, Download, AlertCircle, Loader, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Merge = () => {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [downloadUrl, setDownloadUrl] = useState(null);
    const { user } = useAuth();

    // Use token from session if available, otherwise mock token
    const token = user?.session?.access_token || 'mock-token';

    const handleFilesSelected = (selectedFiles) => {
        setFiles(selectedFiles);
        setError('');
        setDownloadUrl(null);
    };

    const handleMerge = async () => {
        if (files.length < 2) {
            setError('Please select at least 2 PDF files to merge.');
            return;
        }

        setLoading(true);
        setError('');

        const formData = new FormData();
        files.forEach((file) => {
            formData.append('files', file);
        });

        try {
            const response = await fetch('http://localhost:5000/api/pdf/merge', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData,
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.message || 'Merge failed');
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            setDownloadUrl(url);

            // Save to History
            const history = JSON.parse(localStorage.getItem('pdfHistory') || '[]');
            const newEntry = {
                type: 'MERGE',
                fileName: `merged-${Date.now()}.pdf`,
                date: new Date().toISOString()
            };
            localStorage.setItem('pdfHistory', JSON.stringify([newEntry, ...history].slice(0, 10)));

        } catch (err) {
            console.error(err);
            setError(err.message || 'An error occurred while merging files.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-art-white font-body">
            <Navbar />

            <main className="flex-grow pt-32 pb-20 px-4">
                <div className="max-w-5xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-gray-400 hover:text-black transition-colors group">
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            Back to Dashboard
                        </Link>
                    </div>

                    <div className="flex items-center gap-6 mb-12 border-b-2 border-art-black pb-8">
                        <div className="bg-acid-yellow border-2 border-art-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                            <Layers className="w-10 h-10 text-black" />
                        </div>
                        <div>
                            <h1 className="text-4xl md:text-6xl font-black uppercase leading-none mb-2">Merge PDFs</h1>
                            <p className="text-gray-500 font-bold text-lg">Combine multiple documents into one master file.</p>
                        </div>
                    </div>

                    {/* Tool Interface */}
                    <div className="bg-white border-2 border-art-black p-8 md:p-12 shadow-[8px_8px_0px_0px_#CCFF00]">
                        <FileUploader
                            onFilesSelected={handleFilesSelected}
                            multiple={true}
                            maxFiles={10}
                            maxSizeInMB={100}
                        />

                        {error && (
                            <div className="mt-8 p-4 bg-red-100 border-2 border-red-500 text-red-600 font-bold flex items-center gap-3 animate-slide-up">
                                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                {error}
                            </div>
                        )}

                        {downloadUrl && (
                            <div className="mt-8 p-6 bg-acid-lime/20 border-2 border-acid-lime flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <CheckCircle className="w-8 h-8 text-black" />
                                    <div>
                                        <h3 className="font-black uppercase text-lg">Merge Successful!</h3>
                                        <p className="font-medium text-sm">Your file is ready for download.</p>
                                    </div>
                                </div>
                                <a
                                    href={downloadUrl}
                                    download={`merged-${Date.now()}.pdf`}
                                    className="btn-brutal text-xs py-3 px-6 bg-acid-yellow text-black border-2 border-black shadow-[4px_4px_0px_0px_black] hover:translate-y-1 hover:shadow-none transition-all"
                                >
                                    Download PDF
                                </a>
                            </div>
                        )}

                        <div className="mt-8 flex justify-end">
                            <button
                                onClick={handleMerge}
                                disabled={loading || files.length < 2}
                                className={`btn-brutal ${loading || files.length < 2 ? 'opacity-50 cursor-not-allowed filter grayscale' : ''}`}
                            >
                                {loading ? (
                                    <span className="flex items-center gap-2">
                                        <Loader className="w-5 h-5 animate-spin" />
                                        PROCESSING...
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        MERGE FILES
                                        <Download className="w-5 h-5" />
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Merge;
