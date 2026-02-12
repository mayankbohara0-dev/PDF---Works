import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FileUploader from '../components/FileUploader';
import { Shield, ArrowLeft, AlertCircle, Loader, CheckCircle, Lock, Eye, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import api from '../api';
import SEO from '../components/SEO';

const Protect = () => {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [permissions, setPermissions] = useState({
        allowPrint: true,
        allowCopy: false,
        allowModify: false,
        allowAnnotate: true,
    });

    const mutation = useMutation({
        mutationFn: async (params: { file: File; password: string; permissions: typeof permissions }) => {
            const formData = new FormData();
            formData.append('pdf', params.file);
            formData.append('password', params.password);
            formData.append('allowPrint', String(params.permissions.allowPrint));
            formData.append('allowCopy', String(params.permissions.allowCopy));
            formData.append('allowModify', String(params.permissions.allowModify));
            formData.append('allowAnnotate', String(params.permissions.allowAnnotate));

            const response = await api.post('/api/pdf/protect', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                responseType: 'blob',
            });

            return response.data;
        },
        onSuccess: (data) => {
            const url = window.URL.createObjectURL(new Blob([data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `protected-${Date.now()}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.parentNode?.removeChild(link);
            window.URL.revokeObjectURL(url);

            // Reset form
            setPassword('');
            setConfirmPassword('');
        }
    });

    const handleFilesSelected = (files: File[]) => {
        setSelectedFiles(files);
    };

    const handleProtect = () => {
        if (selectedFiles.length > 0 && password) {
            mutation.mutate({ file: selectedFiles[0], password, permissions });
        }
    };

    const isPasswordValid = password.length >= 4;
    const doPasswordsMatch = password === confirmPassword;
    const canSubmit = selectedFiles.length > 0 && isPasswordValid && doPasswordsMatch && password.length > 0;

    return (
        <div className="min-h-screen flex flex-col bg-secondary font-body">
            <SEO
                title="Protect PDF - Add Password Encryption"
                description="Secure your PDF files with password protection. Add encryption and set permissions for printing, copying, and editing."
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
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-red-50 text-red-600 rounded-3xl mb-6 shadow-lg">
                            <Shield className="w-10 h-10" />
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-bold mb-4 text-text-main">
                            Protect PDF
                        </h1>
                        <p className="text-lg text-text-body max-w-2xl mx-auto">
                            Secure your PDF with password encryption and control who can print, copy, or modify your document.
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
                                {/* Password Input */}
                                <div>
                                    <label className="block text-sm font-bold text-text-main mb-3">
                                        Password <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Enter password (min. 4 characters)"
                                            className="w-full pl-12 pr-12 py-4 rounded-2xl border-2 border-gray-200 focus:border-red-600 focus:outline-none font-medium"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-600"
                                        >
                                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                    {password && !isPasswordValid && (
                                        <p className="text-xs text-red-500 mt-2 font-medium">Password must be at least 4 characters</p>
                                    )}
                                </div>

                                {/* Confirm Password Input */}
                                <div>
                                    <label className="block text-sm font-bold text-text-main mb-3">
                                        Confirm Password <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            placeholder="Re-enter password"
                                            className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-200 focus:border-red-600 focus:outline-none font-medium"
                                        />
                                    </div>
                                    {confirmPassword && !doPasswordsMatch && (
                                        <p className="text-xs text-red-500 mt-2 font-medium">Passwords do not match</p>
                                    )}
                                </div>

                                {/* Permissions */}
                                <div>
                                    <label className="block text-sm font-bold text-text-main mb-4">
                                        Document Permissions
                                    </label>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {Object.entries(permissions).map(([key, value]) => (
                                            <label
                                                key={key}
                                                className="flex items-center gap-3 p-4 rounded-2xl border-2 border-gray-200 hover:border-red-300 cursor-pointer transition-colors"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={value}
                                                    onChange={(e) => setPermissions({ ...permissions, [key]: e.target.checked })}
                                                    className="w-5 h-5 rounded border-gray-300 text-red-600 focus:ring-red-600"
                                                />
                                                <span className="font-medium text-text-main capitalize">
                                                    {key.replace('allow', 'Allow ')}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    onClick={handleProtect}
                                    disabled={!canSubmit || mutation.isPending}
                                    className="btn-primary w-full text-lg py-5 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {mutation.isPending ? (
                                        <>
                                            <Loader className="w-6 h-6 mr-2 animate-spin" />
                                            Encrypting PDF...
                                        </>
                                    ) : (
                                        <>
                                            <Shield className="w-6 h-6 mr-2" />
                                            Protect PDF
                                        </>
                                    )}
                                </button>
                            </div>
                        )}

                        {mutation.isError && (
                            <div className="mt-6 flex items-start gap-3 text-sm font-bold text-red-600 bg-red-50 px-5 py-4 rounded-2xl border border-red-100 animate-fade-in-up">
                                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-bold mb-1">Protection failed</p>
                                    <p className="font-normal">Please check your PDF file and try again.</p>
                                </div>
                            </div>
                        )}

                        {mutation.isSuccess && (
                            <div className="mt-6 flex items-center gap-3 text-sm font-bold text-green-600 bg-green-50 px-5 py-4 rounded-2xl border border-green-100 animate-fade-in-up">
                                <CheckCircle className="w-5 h-5 flex-shrink-0" />
                                PDF protected successfully! Keep your password safe.
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Protect;
