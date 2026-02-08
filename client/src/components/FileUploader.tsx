import React, { useState, useRef } from 'react';
import { UploadCloud, File as FileIcon, X, AlertCircle, GripVertical } from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { toast } from 'sonner';

interface SortableItemProps {
    id: string;
    file: File;
    onRemove: () => void;
}

const SortableItem = ({ id, file, onRemove }: SortableItemProps) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="group flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all"
        >
            <div className="flex items-center gap-4 overflow-hidden flex-1">
                <div {...attributes} {...listeners} className="cursor-grab touch-none text-gray-300 hover:text-primary transition-colors">
                    <GripVertical className="w-5 h-5" />
                </div>
                <div className="w-10 h-10 bg-blue-50 text-primary rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                    <FileIcon className="w-5 h-5" />
                </div>
                <div className="flex flex-col overflow-hidden">
                    <span className="text-sm font-bold text-text-main truncate">{file.name}</span>
                    <span className="text-xs font-semibold text-gray-400">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                </div>
            </div>
            <button
                onClick={(e) => { e.stopPropagation(); onRemove(); }}
                className="p-2 hover:bg-red-50 rounded-full text-gray-300 hover:text-red-500 transition-colors"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    );
};

interface File {
    id: string;
    name: string;
    size: number;
    type: string;
}

interface FileUploaderProps {
    onFilesSelected: (files: File[]) => void;
    multiple?: boolean;
    maxFiles?: number;
    maxSizeInMB?: number;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFilesSelected, multiple = false, maxFiles = 1, maxSizeInMB = 100 }) => {
    const [dragActive, setDragActive] = useState(false);
    const [files, setFiles] = useState<File[]>([]);
    const [error, setError] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const validateFiles = (newFiles: any[]) => {
        const validFiles: File[] = [];
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
            // Add ID to file object
            (file as any).id = `${file.name}-${Date.now()}-${Math.random()}`;
            validFiles.push(file as File);
        }

        if (errorMessage && validFiles.length === 0) return errorMessage;

        const uniqueFiles = validFiles.filter(nf => !files.some(f => f.name === nf.name));
        const updatedFiles = [...files, ...uniqueFiles];
        setFiles(updatedFiles);
        onFilesSelected(updatedFiles);

        return errorMessage;
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        setError('');

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const droppedFiles = Array.from(e.dataTransfer.files);
            const err = validateFiles(droppedFiles);
            if (err) {
                setError(err);
                toast.error(err);
            } else {
                toast.success("Files added successfully");
            }
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setError('');
        if (e.target.files && e.target.files.length > 0) {
            const selectedFiles = Array.from(e.target.files);
            const err = validateFiles(selectedFiles);
            if (err) {
                setError(err);
                toast.error(err);
            } else {
                toast.success("Files added successfully");
            }
        }
    };

    const removeFile = (id: string) => {
        const updated = files.filter((f) => f.id !== id);
        setFiles(updated);
        onFilesSelected(updated);
        toast.info("File removed");
    };

    const handleDragEnd = (event: any) => {
        const { active, over } = event;
        if (active.id !== over.id) {
            setFiles((items) => {
                const oldIndex = items.findIndex((f) => f.id === active.id);
                const newIndex = items.findIndex((f) => f.id === over.id);
                const newOrder = arrayMove(items, oldIndex, newIndex);
                onFilesSelected(newOrder);
                return newOrder;
            });
        }
    };

    return (
        <div className="w-full">
            <div
                className={`relative border-2 border-dashed rounded-3xl p-10 text-center transition-all cursor-pointer overflow-hidden group
          ${dragActive ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-primary hover:bg-gray-50'}
          ${error ? 'border-red-300 bg-red-50' : ''}
        `}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => inputRef.current?.click()}
            >
                <input
                    ref={inputRef}
                    type="file"
                    className="hidden"
                    multiple={multiple}
                    accept=".pdf"
                    onChange={handleChange}
                />

                {/* Background Decoration */}
                <div className="absolute top-0 right-0 p-20 bg-gradient-to-br from-primary/5 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-700 pointer-events-none"></div>

                <div className="relative z-10 flex flex-col items-center justify-center gap-4">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-soft transition-transform group-hover:scale-110 group-hover:-rotate-3 ${dragActive ? 'bg-primary text-white' : 'bg-white text-primary'}`}>
                        <UploadCloud className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-xl font-bold text-text-main mb-1">
                            Click to upload or drag and drop
                        </p>
                        <p className="text-sm font-medium text-gray-400">
                            PDF files only (max {maxSizeInMB}MB)
                        </p>
                    </div>
                </div>
            </div>

            {error && (
                <div className="mt-4 flex items-center gap-2 text-sm font-bold text-red-600 bg-red-50 px-4 py-3 rounded-xl border border-red-100 animate-fade-in-up">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    {error}
                </div>
            )}

            {files.length > 0 && (
                <div className="mt-8 space-y-4 animate-fade-in-up">
                    <div className="flex items-center justify-between px-2">
                        <h4 className="text-sm font-bold uppercase text-gray-400 tracking-wider">
                            Selected Files ({files.length})
                        </h4>
                        {files.length > 1 && (
                            <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded-lg">
                                Drag to reorder
                            </span>
                        )}
                    </div>

                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={files.map(f => f.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            <div className="space-y-3">
                                {files.map((file) => (
                                    <div key={file.id} className="transform transition-all">
                                        <SortableItem id={file.id} file={file} onRemove={() => removeFile(file.id)} />
                                    </div>
                                ))}
                            </div>
                        </SortableContext>
                    </DndContext>
                </div>
            )}
        </div>
    );
};

export default FileUploader;
