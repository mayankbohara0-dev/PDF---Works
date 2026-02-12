import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FileUploader from '../components/FileUploader';
import { Image, ArrowLeft, AlertCircle, Loader, CheckCircle, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import api from '../api';
import SEO from '../components/SEO';

const ToImage = () => {
    const [selectedFiles, setSelectedFiles] = useState<(File & { id: string })[]>([]);
    const [format, setFormat] = useState<'png' | 'jpg' | 'webp'>('png');

    const mutation = useMutation({
        mutationFn: async (params: { file: File; format: string }) => {
            const formData = new FormData();
            formData.append('pdf', params.file);
            formData.append('format', params.format);

            const response = await api.post('/pdf/to-image', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                responseType: 'blob',
            });

            return { data: response.data, format: params.format };
        },
        onSuccess: ({ data, format: fmt }) => {
            const url = window.URL.createObjectURL(new Blob([data]));
            const link = document.createElement('a');
            link.href = url;

            // Check if it's a ZIP file (multiple pages)
            const isZip = data.type === 'application/zip';
            const extension = isZip ? 'zip' : fmt;
            link.setAttribute('download', `converted-${Date.now()}.${extension}`);

            document.body.appendChild(link);
            link.click();
            link.parentNode?.removeChild(link);
            window.URL.revokeObjectURL(url);
        }
    });

    const handleFilesSelected = (files: (File & { id: string })[]) => {
        setSelectedFiles(files);
    };

    const handleConvert = () => {
        if (selectedFiles.length > 0) {
            mutation.mutate({ file: selectedFiles[0], format });
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-secondary font-body">
            <SEO
                title="PDF to Image Converter - Convert PDF to PNG, JPG, WebP"
                description="Convert PDF pages to high-quality images in PNG, JPG, or WebP format. Free online PDF to image converter."
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
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-50 text-green-600 rounded-3xl mb-6 shadow-lg">
                            <Image className="w-10 h-10" />
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-bold mb-4 text-text-main">
                            PDF to Image
                        </h1>
                        <p className="text-lg text-text-body max-w-2xl mx-auto">
                            Convert your PDF pages into high-quality images. Perfect for sharing specific pages or creating thumbnails.
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
                            <div className="mt-8 space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-text-main mb-3">
                                        Output Format
                                    </label>
                                    <div className="grid grid-cols-3 gap-4">
                                        {(['png', 'jpg', 'webp'] as const).map((fmt) => (
                                            <button
                                                key={fmt}
                                                onClick={() => setFormat(fmt)}
                                                className={`p-4 rounded-2xl border-2 font-bold text-sm uppercase transition-all ${format === fmt
                                                    ? 'border-green-600 bg-green-50 text-green-600'
                                                    : 'border-gray-200 bg-white text-gray-400 hover:border-green-300'
                                                    }`}
                                            >
                                                {fmt}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    onClick={handleConvert}
                                    disabled={mutation.isPending}
                                    className="btn-primary w-full text-lg py-5 disabled:opacity-50 disabled:cursor-not-allowed group"
                                >
                                    {mutation.isPending ? (
                                        <>
                                            <Loader className="w-6 h-6 mr-2 animate-spin" />
                                            Converting...
                                        </>
                                    ) : (
                                        <>
                                            <Download className="w-6 h-6 mr-2" />
                                            Convert to Image
                                        </>
                                    )}
                                </button>
                            </div>
                        )}

                        {mutation.isError && (
                            <div className="mt-6 flex items-start gap-3 text-sm font-bold text-red-600 bg-red-50 px-5 py-4 rounded-2xl border border-red-100 animate-fade-in-up">
                                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-bold mb-1">Conversion failed</p>
                                    <p className="font-normal">Please make sure you uploaded a valid PDF file and try again.</p>
                                </div>
                            </div>
                        )}

                        {mutation.isSuccess && (
                            <div className="mt-6 flex items-center gap-3 text-sm font-bold text-green-600 bg-green-50 px-5 py-4 rounded-2xl border border-green-100 animate-fade-in-up">
                                <CheckCircle className="w-5 h-5 flex-shrink-0" />
                                Conversion successful! Your download should start automatically.
                            </div>
                        )}
                    </div>

                    <div className="mt-12 bg-white rounded-3xl p-8 shadow-sm">
                        <h2 className="text-2xl font-bold mb-4 text-text-main">Format Comparison</h2>
                        <div className="space-y-4">
                            <div className="border-l-4 border-green-600 pl-4">
                                <h3 className="font-bold text-text-main mb-1">PNG (Recommended)</h3>
                                <p className="text-sm text-text-body">Lossless quality, transparency support, best for documents with text and graphics.</p>
                            </div>
                            <div className="border-l-4 border-blue-400 pl-4">
                                <h3 className="font-bold text-text-main mb-1">JPG</h3>
                                <p className="text-sm text-text-body">Smaller file size, good for photos, slight compression artifacts.</p>
                            </div>
                            <div className="border-l-4 border-purple-400 pl-4">
                                <h3 className="font-bold text-text-main mb-1">WebP</h3>
                                <p className="text-sm text-text-body">Modern format, excellent compression, smaller than PNG but maintains quality.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default ToImage;
