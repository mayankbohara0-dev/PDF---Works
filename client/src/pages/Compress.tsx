import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FileUploader from '../components/FileUploader';
import { Minimize2, ArrowLeft, Download, AlertCircle, Loader, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import api from '../api';

interface SuccessStats {
    original: string;
    compressed: string;
    percent: number | string;
}

const Compress = () => {
    const [files, setFiles] = useState<File[]>([]);
    const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
    const [successStats, setSuccessStats] = useState<SuccessStats | null>(null);

    // Cleanup object URL
    useEffect(() => {
        return () => {
            if (downloadUrl) {
                window.URL.revokeObjectURL(downloadUrl);
            }
        };
    }, [downloadUrl]);

    const mutation = useMutation({
        mutationFn: async (filesToCompress: File[]) => {
            const formData = new FormData();
            // Server expects 'pdf' field as per routes/pdf.routes.js
            formData.append('pdf', filesToCompress[0]);

            const response = await api.post('/pdf/compress', formData, {
                responseType: 'blob',
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            const compressedSize = response.headers['x-compressed-size'];
            return { blob: response.data, compressedSize };
        },
        onSuccess: ({ blob, compressedSize }, variables) => {
            const url = window.URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }));
            setDownloadUrl(url);

            const file = variables[0];
            if (compressedSize) {
                const originalSize = file.size;
                const saved = originalSize - Number(compressedSize);
                const percent = Math.round((saved / originalSize) * 100);
                setSuccessStats({
                    original: (originalSize / 1024 / 1024).toFixed(2),
                    compressed: (Number(compressedSize) / 1024 / 1024).toFixed(2),
                    percent: percent > 0 ? percent : 0
                });
            } else {
                setSuccessStats({
                    original: (file.size / 1024 / 1024).toFixed(2),
                    compressed: "?",
                    percent: "?"
                });
            }

            // Save to History
            const history = JSON.parse(localStorage.getItem('pdfHistory') || '[]');
            const newEntry = {
                type: 'COMPRESS',
                fileName: `compressed-${Date.now()}.pdf`,
                date: new Date().toISOString()
            };
            localStorage.setItem('pdfHistory', JSON.stringify([newEntry, ...history].slice(0, 10)));
        },
    });

    const handleFilesSelected = (selectedFiles: File[]) => {
        setFiles(selectedFiles);
        setDownloadUrl(null);
        setSuccessStats(null);
        mutation.reset();
    };

    const handleCompress = () => {
        if (files.length === 0) return;
        mutation.mutate(files);
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

                        {mutation.isError && (
                            <div className="mt-8 p-4 bg-red-100 border-2 border-red-500 text-red-600 font-bold flex items-center gap-3 animate-slide-up">
                                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                {mutation.error instanceof Error ? mutation.error.message : 'An error occurred while compressing the file.'}
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
                                disabled={mutation.isPending || files.length === 0}
                                className={`btn-brutal ${mutation.isPending || files.length === 0 ? 'opacity-50 cursor-not-allowed filter grayscale' : ''} bg-hot-pink text-white hover:bg-black hover:text-hot-pink`}
                            >
                                {mutation.isPending ? (
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
