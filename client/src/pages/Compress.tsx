import { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FileUploader from '../components/FileUploader';
import { Minimize2, ArrowLeft, Download, AlertCircle, Loader, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import ViralLoop from '../components/ViralLoop';
import { useMutation } from '@tanstack/react-query';
import api from '../api';
import SEO from '../components/SEO';

interface SuccessStats {
    original: string;
    compressed: string;
    percent: number | string;
}

const Compress = () => {
    const [files, setFiles] = useState<(File & { id: string })[]>([]);
    const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
    const [successStats, setSuccessStats] = useState<SuccessStats | null>(null);
    const [mount, setMount] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);

    // Entrance animation
    useEffect(() => { const t = setTimeout(() => setMount(true), 50); return () => clearTimeout(t); }, []);

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

    const handleFilesSelected = (selectedFiles: (File & { id: string })[]) => {
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
        <div className="min-h-screen flex flex-col bg-secondary font-body">
            <SEO
                title="Compress PDF Online for Free - Reduce PDF File Size | SwiftPDF"
                description="Shrink your PDF file size while maintaining maximum quality. Fast, free, and secure online PDF compressor. No installation required."
                keywords="compress pdf, reduce pdf size, optimize pdf, shrink pdf, online pdf compressor"
                canonical="https://swiftpdf.app/compress"
                schema={{
                    "@context": "https://schema.org",
                    "@type": "SoftwareApplication",
                    "name": "SwiftPDF Compress",
                    "operatingSystem": "All",
                    "applicationCategory": "BusinessApplication",
                    "offers": {
                        "@type": "Offer",
                        "price": "0",
                        "priceCurrency": "USD"
                    },
                    "featureList": "High quality compression, multiple files support, totally free",
                    "step": [
                        {
                            "@type": "HowToStep",
                            "name": "Upload PDF",
                            "text": "Select the PDF file you want to compress."
                        },
                        {
                            "@type": "HowToStep",
                            "name": "Process",
                            "text": "Click 'Compress Now' to start the optimization."
                        },
                        {
                            "@type": "HowToStep",
                            "name": "Download",
                            "text": "Download your compressed PDF file instantly."
                        }
                    ]
                }}
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
                        <div className={`w-20 h-20 bg-pink-50 text-pink-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-soft transition-all duration-700 ${mount ? 'opacity-100 scale-100 rotate-3' : 'opacity-0 scale-50 rotate-12'}`}>
                            <Minimize2 className="w-10 h-10" />
                        </div>
                        <h1 className={`text-4xl lg:text-5xl font-bold mb-4 text-text-main transition-all duration-700 delay-100 ${mount ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>Compress PDF</h1>
                        <p className={`text-lg text-text-body font-medium transition-all duration-700 delay-200 ${mount ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>Optimized file reduction using smart algorithm compression.</p>
                    </div>

                    {/* Tool Interface */}
                    <div ref={cardRef} className={`bg-white rounded-[2rem] p-8 md:p-12 shadow-soft border border-gray-100 relative overflow-hidden transition-all duration-700 delay-300 ${mount ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-[0.97] translate-y-4'}`}>

                        {/* Decorative blob */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-pink-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                        <FileUploader
                            onFilesSelected={handleFilesSelected}
                            multiple={false}
                            maxFiles={1}
                            maxSizeInMB={100}
                        />

                        {mutation.isError && (
                            <div className="mt-6 p-4 bg-red-50 border border-red-100 text-red-600 font-bold flex items-center gap-3 rounded-2xl animate-fade-in-up">
                                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                {mutation.error instanceof Error ? mutation.error.message : 'An error occurred while compressing the file.'}
                            </div>
                        )}

                        {successStats && downloadUrl && (
                            <div className="mt-8 p-6 bg-green-50 rounded-[2rem] border border-green-100 animate-fade-in-up">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 bg-white text-green-500 rounded-full flex items-center justify-center shadow-sm">
                                        <CheckCircle className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-green-700">Compression Successful!</h3>
                                        <p className="text-sm font-medium text-green-600">Your file is much lighter now.</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-4 border-t border-green-100 pt-6 mb-6">
                                    <div className="text-center">
                                        <p className="text-xs font-bold uppercase text-gray-400 mb-1">Original</p>
                                        <p className="text-xl font-black text-text-main">{successStats.original} MB</p>
                                    </div>
                                    <div className="text-center border-l border-green-200">
                                        <p className="text-xs font-bold uppercase text-gray-400 mb-1">New Size</p>
                                        <p className="text-xl font-black text-text-main">{successStats.compressed} MB</p>
                                    </div>
                                    <div className="text-center border-l border-green-200">
                                        <p className="text-xs font-bold uppercase text-gray-400 mb-1">Saved</p>
                                        <p className="text-xl font-black text-green-600">-{successStats.percent}%</p>
                                    </div>
                                </div>
                                <a
                                    href={downloadUrl}
                                    download={`compressed-${Date.now()}.pdf`}
                                    className="btn-primary bg-green-500 hover:bg-green-600 shadow-green-200 w-full text-center block"
                                >
                                    Download Compressed PDF
                                </a>
                                <ViralLoop />
                            </div>
                        )}

                        {!downloadUrl && (
                            <div className="mt-8 flex justify-end">
                                <button
                                    onClick={handleCompress}
                                    disabled={mutation.isPending || files.length === 0}
                                    className={`w-full py-4 rounded-full font-bold text-lg transition-all transform flex items-center justify-center gap-2
                                        ${mutation.isPending || files.length === 0
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            : 'bg-pink-600 text-white hover:bg-pink-700 hover:-translate-y-1 shadow-lg shadow-pink-200'}
                                    `}
                                >
                                    {mutation.isPending ? (
                                        <>
                                            <Loader className="w-6 h-6 animate-spin" />
                                            Optimizing...
                                        </>
                                    ) : (
                                        <>
                                            Compress Now
                                            <Download className="w-6 h-6" />
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>

                    {/* SEO Content Enrichment */}
                    <div className="mt-16 space-y-12 animate-fade-in-up delay-500">
                        <section>
                            <h2 className="text-3xl font-bold text-text-main mb-6">How to Compress PDF Online?</h2>
                            <div className="grid md:grid-cols-3 gap-8">
                                <div className="bg-white p-6 rounded-3xl shadow-sm">
                                    <div className="w-10 h-10 bg-pink-50 text-pink-600 rounded-xl flex items-center justify-center mb-4 font-bold">1</div>
                                    <h3 className="font-bold mb-2">Upload Files</h3>
                                    <p className="text-sm text-text-body">Select the PDF document you want to optimize from your device.</p>
                                </div>
                                <div className="bg-white p-6 rounded-3xl shadow-sm">
                                    <div className="w-10 h-10 bg-pink-50 text-pink-600 rounded-xl flex items-center justify-center mb-4 font-bold">2</div>
                                    <h3 className="font-bold mb-2">Compress</h3>
                                    <p className="text-sm text-text-body">Click the compress button. Our smart algorithm reduces size while keeping quality.</p>
                                </div>
                                <div className="bg-white p-6 rounded-3xl shadow-sm">
                                    <div className="w-10 h-10 bg-pink-50 text-pink-600 rounded-xl flex items-center justify-center mb-4 font-bold">3</div>
                                    <h3 className="font-bold mb-2">Download</h3>
                                    <p className="text-sm text-text-body">Download your lightweight PDF instantly. No registration required!</p>
                                </div>
                            </div>
                        </section>

                        <section className="bg-white rounded-[2rem] p-8 md:p-12 shadow-soft">
                            <h2 className="text-3xl font-bold text-text-main mb-8">Frequently Asked Questions</h2>
                            <div className="space-y-6">
                                <div>
                                    <h3 className="font-bold text-lg mb-2 text-text-main">Will I lose quality after compression?</h3>
                                    <p className="text-text-body">Our algorithm is designed to find the perfect balance between file size and visual fidelity. Most users won't notice any difference in quality.</p>
                                </div>
                                <div className="pt-6 border-t border-gray-100">
                                    <h3 className="font-bold text-lg mb-2 text-text-main">Is it safe to upload my files?</h3>
                                    <p className="text-text-body">Yes. All files are encrypted during transfer and automatically deleted from our servers after processing. We do not store your data.</p>
                                </div>
                                <div className="pt-6 border-t border-gray-100">
                                    <h3 className="font-bold text-lg mb-2 text-text-main">Is there a limit on file size?</h3>
                                    <p className="text-text-body">Currently, you can upload files up to 100MB for free. For larger files, please sign up for a premium account.</p>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Compress;
