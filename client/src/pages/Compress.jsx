import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FileUploader from '../components/FileUploader';
import { Minimize2, ArrowLeft, Download, AlertCircle, Loader, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Compress = () => {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successStats, setSuccessStats] = useState(null);
    const [downloadUrl, setDownloadUrl] = useState(null);
    const { user } = useAuth();
    const token = user?.session?.access_token || 'mock-token';

    const handleFilesSelected = (selectedFiles) => {
        setFiles(selectedFiles);
        setError('');
        setSuccessStats(null);
        setDownloadUrl(null);
    };

    const handleCompress = async () => {
        if (files.length === 0) {
            setError('Please select a PDF file.');
            return;
        }

        setLoading(true);
        setError('');
        setSuccessStats(null);

        const formData = new FormData();
        formData.append('files', files[0]);

        try {
            const response = await fetch('http://localhost:5000/api/pdf/compress', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData,
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.message || 'Compression failed');
            }

            // Get compressed size header if available
            const compressedSize = response.headers.get('X-Compressed-Size');

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            setDownloadUrl(url);

            // Save to History
            const history = JSON.parse(localStorage.getItem('pdfHistory') || '[]');
            const newEntry = {
                type: 'COMPRESS',
                fileName: `compressed-${Date.now()}.pdf`,
                date: new Date().toISOString()
            };
            localStorage.setItem('pdfHistory', JSON.stringify([newEntry, ...history].slice(0, 10)));

            if (compressedSize) {
                const originalSize = files[0].size;
                const saved = originalSize - compressedSize;
                const percent = Math.round((saved / originalSize) * 100);
                setSuccessStats({
                    original: (originalSize / 1024 / 1024).toFixed(2),
                    compressed: (compressedSize / 1024 / 1024).toFixed(2),
                    percent: percent > 0 ? percent : 0
                });
            } else {
                setSuccessStats({
                    original: (files[0].size / 1024 / 1024).toFixed(2),
                    compressed: "?",
                    percent: "?"
                });
            }

        } catch (err) {
            console.error(err);
            setError(err.message || 'An error occurred while compressing the file.');
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
                        <div className="bg-hot-pink border-2 border-art-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                            <Minimize2 className="w-10 h-10 text-white" />
                        </div>
                        <div>
                            <h1 className="text-4xl md:text-6xl font-black uppercase leading-none mb-2">Compress PDF</h1>
                            <p className="text-gray-500 font-bold text-lg">Optimized file reduction using smart algorithm compression.</p>
                        </div>
                    </div>

                    {/* Tool Interface */}
                    <div className="bg-white border-2 border-art-black p-8 md:p-12 shadow-[8px_8px_0px_0px_#ff00ff]">
                        <FileUploader
                            onFilesSelected={handleFilesSelected}
                            multiple={false}
                            maxFiles={1}
                            maxSizeInMB={100}
                        />

                        {error && (
                            <div className="mt-8 p-4 bg-red-100 border-2 border-red-500 text-red-600 font-bold flex items-center gap-3 animate-slide-up">
                                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                {error}
                            </div>
                        )}

                        {successStats && downloadUrl && (
                            <div className="mt-8 p-6 bg-green-50 border-2 border-green-500 animate-slide-up">
                                <div className="flex items-center gap-4 mb-4">
                                    <CheckCircle className="w-8 h-8 text-green-600" />
                                    <div>
                                        <h3 className="text-xl font-black uppercase text-green-700">Compression Successful!</h3>
                                        <p className="text-sm font-bold text-green-600">Your file is ready.</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-4 border-t-2 border-green-200 pt-4 mb-6">
                                    <div>
                                        <p className="text-xs font-bold uppercase text-gray-400">Original</p>
                                        <p className="text-lg font-black">{successStats.original} MB</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold uppercase text-gray-400">New Size</p>
                                        <p className="text-lg font-black">{successStats.compressed} MB</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold uppercase text-gray-400">Saved</p>
                                        <p className="text-lg font-black text-green-600">-{successStats.percent}%</p>
                                    </div>
                                </div>
                                <a
                                    href={downloadUrl}
                                    download={`compressed-${Date.now()}.pdf`}
                                    className="btn-brutal text-xs py-3 px-6 bg-hot-pink text-white w-full text-center block border-2 border-black shadow-[4px_4px_0px_0px_black] hover:translate-y-1 hover:shadow-none transition-all"
                                >
                                    Download Compressed PDF
                                </a>
                            </div>
                        )}

                        <div className="mt-8 flex justify-end">
                            <button
                                onClick={handleCompress}
                                disabled={loading || files.length === 0}
                                className={`btn-brutal ${loading || files.length === 0 ? 'opacity-50 cursor-not-allowed filter grayscale' : ''} bg-hot-pink text-white hover:bg-black hover:text-hot-pink`}
                            >
                                {loading ? (
                                    <span className="flex items-center gap-2">
                                        <Loader className="w-5 h-5 animate-spin" />
                                        OPTIMIZING...
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        COMPRESS NOW
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

export default Compress;
