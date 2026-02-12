import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FileUploader from '../components/FileUploader';
import { Wrench, ArrowLeft, AlertCircle, Loader, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import api from '../api';
import SEO from '../components/SEO';

const Repair = () => {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

    const mutation = useMutation({
        mutationFn: async (fileToRepair: File) => {
            const formData = new FormData();
            formData.append('pdf', fileToRepair);

            const response = await api.post('/api/pdf/repair', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                responseType: 'blob',
            });

            return response.data;
        },
        onSuccess: (data) => {
            const url = window.URL.createObjectURL(new Blob([data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `repaired-${Date.now()}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.parentNode?.removeChild(link);
            window.URL.revokeObjectURL(url);
        }
    });

    const handleFilesSelected = (files: File[]) => {
        setSelectedFiles(files);
    };

    const handleRepair = () => {
        if (selectedFiles.length > 0) {
            mutation.mutate(selectedFiles[0]);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-secondary font-body">
            <SEO
                title="Repair PDF - Fix Corrupted PDFs"
                description="Repair and fix corrupted or damaged PDF files online for free. Restore your important PDFs quickly."
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
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-orange-50 text-orange-600 rounded-3xl mb-6 shadow-lg">
                            <Wrench className="w-10 h-10" />
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-bold mb-4 text-text-main">
                            Repair PDF
                        </h1>
                        <p className="text-lg text-text-body max-w-2xl mx-auto">
                            Fix corrupted or damaged PDF files. We'll attempt to repair common PDF issues and restore your document.
                        </p>
                    </div>

                    <div className="card-base">
                        <FileUploader
                            onFilesSelected={handleFilesSelected}
                            multiple={false}
                            maxFiles={1}
                            maxSizeInMB={100}
                        />

                        {selectedFiles.length > 0 && (
                            <div className="mt-8">
                                <button
                                    onClick={handleRepair}
                                    disabled={mutation.isPending}
                                    className="btn-primary w-full text-lg py-5 disabled:opacity-50 disabled:cursor-not-allowed group"
                                >
                                    {mutation.isPending ? (
                                        <>
                                            <Loader className="w-6 h-6 mr-2 animate-spin" />
                                            Repairing PDF...
                                        </>
                                    ) : (
                                        <>
                                            <Wrench className="w-6 h-6 mr-2" />
                                            Repair PDF
                                        </>
                                    )}
                                </button>
                            </div>
                        )}

                        {mutation.isError && (
                            <div className="mt-6 flex items-start gap-3 text-sm font-bold text-red-600 bg-red-50 px-5 py-4 rounded-2xl border border-red-100 animate-fade-in-up">
                                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-bold mb-1">Repair failed</p>
                                    <p className="font-normal">The PDF may be too damaged to repair, or it might not be a valid PDF file.</p>
                                </div>
                            </div>
                        )}

                        {mutation.isSuccess && (
                            <div className="mt-6 flex items-center gap-3 text-sm font-bold text-green-600 bg-green-50 px-5 py-4 rounded-2xl border border-green-100 animate-fade-in-up">
                                <CheckCircle className="w-5 h-5 flex-shrink-0" />
                                PDF repaired successfully! Your download should start automatically.
                            </div>
                        )}
                    </div>

                    <div className="mt-12 bg-white rounded-3xl p-8 shadow-sm">
                        <h2 className="text-2xl font-bold mb-6 text-text-main">How PDF Repair Works</h2>
                        <div className="space-y-4 text-text-body">
                            <div className="flex gap-4">
                                <div className="flex-shrink-0 w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-bold">1</div>
                                <div>
                                    <h3 className="font-bold text-text-main mb-1">Upload Your PDF</h3>
                                    <p>Select the corrupted or damaged PDF file you want to repair.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="flex-shrink-0 w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-bold">2</div>
                                <div>
                                    <h3 className="font-bold text-text-main mb-1">Automatic Diagnosis</h3>
                                    <p>Our tool analyzes the PDF structure and identifies common issues like broken references, invalid objects, or missing data.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="flex-shrink-0 w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-bold">3</div>
                                <div>
                                    <h3 className="font-bold text-text-main mb-1">Download Repaired File</h3>
                                    <p>If repair is successful, download your fixed PDF. Note: Some severely damaged files may not be recoverable.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Repair;
