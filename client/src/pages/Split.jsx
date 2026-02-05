import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FileUploader from '../components/FileUploader';
import { Scissors, ArrowLeft, Download, AlertCircle, Loader, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Split = () => {
    const [files, setFiles] = useState([]);
    const [ranges, setRanges] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [downloadUrl, setDownloadUrl] = useState(null);
    const { user } = useAuth();
    const token = user?.session?.access_token || 'mock-token';

    const handleFilesSelected = (selectedFiles) => {
        setFiles(selectedFiles);
        setError('');
        setDownloadUrl(null);
    };

    const handleSplit = async () => {
        if (files.length === 0) {
            setError('Please select a PDF file.');
            return;
        }
        if (!ranges.trim()) {
            setError('Please specify page ranges (e.g., 1-3, 5).');
            return;
        }

        setLoading(true);
        setError('');

        const formData = new FormData();
        formData.append('files', files[0]);
        formData.append('ranges', ranges);

        try {
            const response = await fetch('http://localhost:5000/api/pdf/split', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData,
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.message || 'Split failed');
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            setDownloadUrl(url);

        } catch (err) {
            console.error(err);
            setError(err.message || 'An error occurred while splitting the file.');
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
                        <div className="bg-electric-cyan border-2 border-art-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                            <Scissors className="w-10 h-10 text-black" />
                        </div>
                        <div>
                            <h1 className="text-4xl md:text-6xl font-black uppercase leading-none mb-2">Split PDF</h1>
                            <p className="text-gray-500 font-bold text-lg">Extract specific pages, ranges, or separate documents.</p>
                        </div>
                    </div>

                    {/* Tool Interface */}
                    <div className="bg-white border-2 border-art-black p-8 md:p-12 shadow-[8px_8px_0px_0px_#00FFFF]">
                        <FileUploader
                            onFilesSelected={handleFilesSelected}
                            multiple={false}
                            maxFiles={1}
                            maxSizeInMB={100}
                        />

                        <div className="mt-8">
                            <label className="block text-sm font-black uppercase mb-3 text-art-black">Page Ranges</label>
                            <input
                                type="text"
                                value={ranges}
                                onChange={(e) => setRanges(e.target.value)}
                                placeholder="e.g. 1-3, 5, 7-9"
                                className="w-full p-4 border-2 border-art-black bg-gray-50 focus:bg-white focus:outline-none focus:shadow-[4px_4px_0px_0px_black] transition-all font-bold text-lg placeholder-gray-300"
                            />
                            <p className="text-xs font-bold text-gray-400 mt-2 uppercase tracking-wide">Separate ranges with commas (e.g. 1-5, 8, 11-13)</p>
                        </div>

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
                                        <h3 className="font-black uppercase text-lg">Split Successful!</h3>
                                        <p className="font-medium text-sm">Your file is ready for download.</p>
                                    </div>
                                </div>
                                <a
                                    href={downloadUrl}
                                    download={`split-${Date.now()}.pdf`}
                                    className="btn-brutal text-xs py-3 px-6 bg-electric-cyan text-black border-2 border-black shadow-[4px_4px_0px_0px_black] hover:translate-y-1 hover:shadow-none transition-all"
                                >
                                    Download PDF
                                </a>
                            </div>
                        )}

                        <div className="mt-8 flex justify-end">
                            <button
                                onClick={handleSplit}
                                disabled={loading || files.length === 0}
                                className={`btn-brutal ${loading || files.length === 0 ? 'opacity-50 cursor-not-allowed filter grayscale' : ''} bg-electric-cyan text-black hover:bg-black hover:text-electric-cyan`}
                            >
                                {loading ? (
                                    <span className="flex items-center gap-2">
                                        <Loader className="w-5 h-5 animate-spin" />
                                        PROCESSING...
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        SPLIT PDF
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

export default Split;
