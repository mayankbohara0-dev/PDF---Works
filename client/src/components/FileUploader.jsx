import React, { useState, useRef } from 'react';
import { UploadCloud, File, X, AlertCircle } from 'lucide-react';

const FileUploader = ({ onFilesSelected, multiple = false, maxFiles = 1, maxSizeInMB = 100 }) => {
    const [dragActive, setDragActive] = useState(false);
    const [files, setFiles] = useState([]);
    const [error, setError] = useState('');
    const inputRef = useRef(null);

    const validateFiles = (newFiles) => {
        const validFiles = [];
        let errorMessage = '';

        if (!multiple && newFiles.length + files.length > 1) {
            return "Only one file is allowed for this operation.";
        }

        if (multiple && maxFiles && newFiles.length + files.length > maxFiles) {
            return `Maximum ${maxFiles} files allowed.`;
        }

        for (const file of newFiles) {
            if (file.type !== 'application/pdf') {
                errorMessage = "Only PDF files are allowed.";
                continue;
            }
            if (file.size > maxSizeInMB * 1024 * 1024) {
                errorMessage = `File size exceeds ${maxSizeInMB}MB limit.`;
                continue;
            }
            validFiles.push(file);
        }

        if (errorMessage && validFiles.length === 0) return errorMessage;

        // De-duplicate based on name (simple check)
        const uniqueFiles = validFiles.filter(nf => !files.some(f => f.name === nf.name));

        setFiles(prev => {
            const updated = [...prev, ...uniqueFiles];
            onFilesSelected(updated);
            return updated;
        });

        return errorMessage; // Return last error if any mixed results
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        setError('');

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const droppedFiles = Array.from(e.dataTransfer.files);
            const err = validateFiles(droppedFiles);
            if (err) setError(err);
        }
    };

    const handleChange = (e) => {
        e.preventDefault();
        setError('');
        if (e.target.files && e.target.files.length > 0) {
            const selectedFiles = Array.from(e.target.files);
            const err = validateFiles(selectedFiles);
            if (err) setError(err);
        }
    };

    const removeFile = (index) => {
        setFiles(prev => {
            const updated = prev.filter((_, i) => i !== index);
            onFilesSelected(updated);
            return updated;
        });
    };

    return (
        <div className="w-full">
            <div
                className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer bg-gray-50
          ${dragActive ? 'border-electric-cyan bg-blue-50' : 'border-art-black hover:border-electric-cyan hover:bg-white'}
          ${error ? 'border-red-500 bg-red-50' : ''}
        `}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => inputRef.current.click()}
            >
                <input
                    ref={inputRef}
                    type="file"
                    className="hidden"
                    multiple={multiple}
                    accept=".pdf"
                    onChange={handleChange}
                />

                <div className="flex flex-col items-center justify-center gap-3">
                    <div className={`p-3 rounded-full border-2 border-black ${dragActive ? 'bg-electric-cyan text-black' : 'bg-white text-black'}`}>
                        <UploadCloud className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-lg font-black uppercase text-black">
                            Click to upload or drag and drop
                        </p>
                        <p className="text-sm font-bold text-gray-400 mt-1">
                            PDF files only (max {maxSizeInMB}MB)
                        </p>
                    </div>
                </div>
            </div>

            {error && (
                <div className="mt-3 flex items-center gap-2 text-sm font-bold text-red-600 bg-red-100 p-2 border-2 border-red-500">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                </div>
            )}

            {files.length > 0 && (
                <div className="mt-6 space-y-3">
                    <h4 className="text-sm font-black uppercase text-black">Selected Files ({files.length})</h4>
                    <div className="space-y-2">
                        {files.map((file, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 bg-white border-2 border-art-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <File className="w-5 h-5 text-black flex-shrink-0" />
                                    <span className="text-sm font-bold text-black truncate">{file.name}</span>
                                    <span className="text-xs font-bold text-gray-400 flex-shrink-0">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                                </div>
                                <button
                                    onClick={(e) => { e.stopPropagation(); removeFile(idx); }}
                                    className="p-1 hover:bg-red-100 rounded-full text-gray-400 hover:text-red-500 transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default FileUploader;
