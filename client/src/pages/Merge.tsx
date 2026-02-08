import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FileUploader from '../components/FileUploader';
import { Layers, ArrowLeft, Download, AlertCircle, Loader, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import api from '../api';

const Merge = () => {
    const [files, setFiles] = useState<File[]>([]);
    const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

    // Cleanup object URL on unmount or when url changes
    useEffect(() => {
        return () => {
            if (downloadUrl) {
                window.URL.revokeObjectURL(downloadUrl);
            }
        };
    }, [downloadUrl]);

    const mutation = useMutation({
        mutationFn: async (filesToMerge: File[]) => {
            const formData = new FormData();
            filesToMerge.forEach((file) => {
                formData.append('pdfs', file);
            });

            const response = await api.post('/pdf/merge', formData, {
                responseType: 'blob',
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        },
        onSuccess: (data) => {
            // Create a new blob object URL
            const url = window.URL.createObjectURL(new Blob([data], { type: 'application/pdf' }));
            setDownloadUrl(url);

            // Save to History
            const history = JSON.parse(localStorage.getItem('pdfHistory') || '[]');
            const newEntry = {
                type: 'MERGE',
                fileName: `merged-${Date.now()}.pdf`,
                date: new Date().toISOString()
            };
            localStorage.setItem('pdfHistory', JSON.stringify([newEntry, ...history].slice(0, 10)));
        },
    });

    const handleFilesSelected = (selectedFiles: File[]) => {
        setFiles(selectedFiles);
        setDownloadUrl(null);
        mutation.reset();
    };

    const handleMerge = () => {
        if (files.length < 2) return;
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

                        {mutation.isError && (
                            <div className="mt-8 p-4 bg-red-100 border-2 border-red-500 text-red-600 font-bold flex items-center gap-3 animate-slide-up">
                                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                {mutation.error instanceof Error ? mutation.error.message : 'An error occurred while merging files.'}
                            </div>
                        )}

                        {files.length > 0 && files.length < 2 && !mutation.isError && (
                            <div className="mt-4 p-2 text-orange-600 font-medium text-sm flex items-center gap-2">
                                <AlertCircle className="w-4 h-4" />
                                Please select at least 2 files to merge.
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
                                disabled={mutation.isPending || files.length < 2}
                                className={`btn-brutal ${mutation.isPending || files.length < 2 ? 'opacity-50 cursor-not-allowed filter grayscale' : ''}`}
                            >
                                {mutation.isPending ? (
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
