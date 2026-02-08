import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FileUploader from '../components/FileUploader';
import { Layers, ArrowLeft, AlertCircle, Loader, CheckCircle, FilePlus, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import api from '../api';
import SEO from '../components/SEO';

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
        <div className="min-h-screen flex flex-col bg-secondary font-body">
            <SEO
                title="Merge PDF Files Online"
                description="Combine multiple PDFs into one file for free. Easy drag and drop PDF merger."
                keywords="merge pdf, combine pdf, join pdf, free pdf merger"
            />
            <Navbar />

            <main className="flex-grow pt-32 pb-20 px-4">
                <div className="max-w-3xl mx-auto">
                    {/* Header */}
                    <div className="mb-8 flex items-center justify-between">
                        <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-primary transition-colors group px-4 py-2 rounded-full hover:bg-white">
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            Back to Dashboard
                        </Link>
                    </div>

                    <div className="text-center mb-10">
                        <div className="w-20 h-20 bg-blue-50 text-primary rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-soft transform rotate-3">
                            <Layers className="w-10 h-10" />
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-bold mb-4 text-text-main">Merge PDFs</h1>
                        <p className="text-lg text-text-body font-medium">Combine multiple documents into one master file.</p>
                    </div>

                    {/* Tool Interface */}
                    <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-soft border border-gray-100 relative overflow-hidden">

                        {/* Decorative blob */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                        <FileUploader
                            onFilesSelected={handleFilesSelected as any}
                            multiple={true}
                            maxFiles={10}
                            maxSizeInMB={100}
                        />

                        {mutation.isError && (
                            <div className="mt-6 p-4 bg-red-50 border border-red-100 text-red-600 font-bold flex items-center gap-3 rounded-2xl animate-fade-in-up">
                                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                {mutation.error instanceof Error ? mutation.error.message : 'An error occurred while merging files.'}
                            </div>
                        )}

                        {files.length > 0 && files.length < 2 && !mutation.isError && (
                            <div className="mt-4 p-3 bg-blue-50 text-primary font-bold text-sm flex items-center gap-2 rounded-xl justify-center animate-fade-in-up">
                                <FilePlus className="w-4 h-4" />
                                Please select at least 2 PDF files to merge.
                            </div>
                        )}

                        {downloadUrl && (
                            <div className="mt-8 p-8 bg-green-50 rounded-[2rem] border border-green-100 text-center animate-fade-in-up">
                                <div className="w-16 h-16 bg-white text-green-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                                    <CheckCircle className="w-8 h-8" />
                                </div>
                                <h3 className="text-2xl font-bold text-green-700 mb-2">Merge Successful!</h3>
                                <p className="text-green-600 font-medium mb-6">Your new document is ready.</p>

                                <a
                                    href={downloadUrl}
                                    download={`merged-${Date.now()}.pdf`}
                                    className="btn-primary bg-green-500 hover:bg-green-600 shadow-green-200 w-full md:w-auto"
                                >
                                    Download Merged PDF
                                </a>
                            </div>
                        )}

                        {!downloadUrl && (
                            <div className="mt-8">
                                <button
                                    onClick={handleMerge}
                                    disabled={mutation.isPending || files.length < 2}
                                    className={`w-full py-4 rounded-full font-bold text-lg transition-all transform flex items-center justify-center gap-2
                                        ${mutation.isPending || files.length < 2
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            : 'bg-primary text-white hover:bg-primary-dark hover:-translate-y-1 shadow-lg shadow-primary/30'}
                                    `}
                                >
                                    {mutation.isPending ? (
                                        <>
                                            <Loader className="w-6 h-6 animate-spin" />
                                            Merging Files...
                                        </>
                                    ) : (
                                        <>
                                            Merge PDFs Now
                                            <ArrowRight className="w-6 h-6" />
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Merge;
