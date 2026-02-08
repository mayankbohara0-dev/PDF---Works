import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FileUploader from '../components/FileUploader';
import { Scissors, ArrowLeft, Download, AlertCircle, Loader, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import api from '../api';

const Split = () => {
    const [files, setFiles] = useState<File[]>([]);
    const [ranges, setRanges] = useState('');
    const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

    // Cleanup
    useEffect(() => {
        return () => {
            if (downloadUrl) window.URL.revokeObjectURL(downloadUrl);
        };
    }, [downloadUrl]);

    const mutation = useMutation({
        mutationFn: async ({ file, ranges }: { file: File; ranges: string }) => {
            const formData = new FormData();
            // Server expects 'pdf' field as per routes/pdf.routes.js
            formData.append('pdf', file);
            formData.append('ranges', ranges);

            const response = await api.post('/pdf/split', formData, {
                responseType: 'blob',
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        },
        onSuccess: (data) => {
            const url = window.URL.createObjectURL(new Blob([data], { type: 'application/pdf' }));
            setDownloadUrl(url);

            // Save to History
            const history = JSON.parse(localStorage.getItem('pdfHistory') || '[]');
            const newEntry = {
                type: 'SPLIT',
                fileName: `split-${Date.now()}.pdf`,
                date: new Date().toISOString()
            };
            localStorage.setItem('pdfHistory', JSON.stringify([newEntry, ...history].slice(0, 10)));
        },
    });

    const handleFilesSelected = (selectedFiles: File[]) => {
        setFiles(selectedFiles);
        setDownloadUrl(null); // Clear previous result
        mutation.reset();
    };

    const handleSplit = () => {
        if (files.length === 0) return;
        if (!ranges.trim()) return;

        mutation.mutate({ file: files[0], ranges });
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

                        {mutation.isError && (
                            <div className="mt-8 p-4 bg-red-100 border-2 border-red-500 text-red-600 font-bold flex items-center gap-3 animate-slide-up">
                                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                {mutation.error instanceof Error ? mutation.error.message : 'An error occurred while splitting the file.'}
                            </div>
                        )}

                        {!ranges.trim() && files.length > 0 && !mutation.isError && (
                            <div className="mt-4 p-2 text-blue-600 font-medium text-sm flex items-center gap-2">
                                <AlertCircle className="w-4 h-4" />
                                Please specify the pages you want to extract.
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
                                disabled={mutation.isPending || files.length === 0 || !ranges.trim()}
                                className={`btn-brutal ${mutation.isPending || files.length === 0 || !ranges.trim() ? 'opacity-50 cursor-not-allowed filter grayscale' : ''} bg-electric-cyan text-black hover:bg-black hover:text-electric-cyan`}
                            >
                                {mutation.isPending ? (
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
