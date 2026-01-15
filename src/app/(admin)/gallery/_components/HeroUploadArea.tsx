"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
    Upload,
    X,
    Check,
    Image as ImageIcon,
    AlertCircle,
    Loader2,
    Cloud,
    BarChart3,
    Shield,
    Zap,
} from "lucide-react";
import Image from "next/image";
import { uploadImagesCloudinary } from "@/action/image";
import { usePathname } from "next/navigation";

interface UploadedFile {
    id: string;
    file: File;
    preview: string;
    size: number;
    name: string;
    status: "uploading" | "success" | "error";
    progress?: number;
    message?: string;
}

interface CloudinaryResult {
    public_id: string;
    secure_url: string;
    format: string;
    bytes: number;
}

export default function HeroUploadArea() {
    const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [uploadResults, setUploadResults] = useState<CloudinaryResult[]>([]);
    const [showResults, setShowResults] = useState(false);
    const [buttonProgress, setButtonProgress] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const MAX_FILES = 5;
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes
    const ACCEPTED_TYPES = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/webp",
    ];

    const handleFileSelect = (files: FileList | null) => {
        if (!files) return;

        setError(null);
        setShowResults(false);

        // Check if adding these files would exceed max limit
        if (uploadedFiles.length + files.length > MAX_FILES) {
            setError(
                `Maximum ${MAX_FILES} images allowed. You already have ${uploadedFiles.length} images.`
            );
            return;
        }

        const newFiles: UploadedFile[] = [];

        Array.from(files).forEach((file) => {
            // Validate file type
            if (!ACCEPTED_TYPES.includes(file.type)) {
                setError(`File "${file.name}" is not a supported image type.`);
                return;
            }

            // Validate file size
            if (file.size > MAX_FILE_SIZE) {
                setError(`File "${file.name}" exceeds 5MB size limit.`);
                return;
            }

            const preview = URL.createObjectURL(file);
            const newFile: UploadedFile = {
                id: Math.random().toString(36).substr(2, 9),
                file,
                preview,
                size: file.size,
                name:
                    file.name.length > 20
                        ? file.name.substring(0, 17) + "..."
                        : file.name,
                status: "uploading",
                progress: 0,
                message: "Ready to upload",
            };
            newFiles.push(newFile);
        });

        if (newFiles.length > 0) {
            setUploadedFiles((prev) => [...prev, ...newFiles]);
        }
    };

    const updateFileProgress = (
        fileId: string,
        progress: number,
        message?: string
    ) => {
        setUploadedFiles((prev) =>
            prev.map((file) =>
                file.id === fileId
                    ? {
                          ...file,
                          progress,
                          message,
                          status:
                              progress === 100
                                  ? "success"
                                  : progress > 0
                                  ? "uploading"
                                  : file.status,
                      }
                    : file
            )
        );
    };

    const simulateProgress = (fileId: string) => {
        const steps = [
            { progress: 10, message: "Preparing upload..." },
            { progress: 25, message: "Converting to base64..." },
            { progress: 40, message: "Connecting to Cloudinary..." },
            { progress: 60, message: "Uploading image data..." },
            { progress: 80, message: "Processing on Cloudinary..." },
            { progress: 95, message: "Finalizing..." },
            { progress: 100, message: "Upload complete!" },
        ];

        steps.forEach((step, index) => {
            setTimeout(() => {
                updateFileProgress(fileId, step.progress, step.message);
            }, index * 500 + Math.random() * 300);
        });
    };

    // Update button progress based on overall file progress
    useEffect(() => {
        if (isUploading && uploadedFiles.length > 0) {
            const totalProgress = uploadedFiles.reduce(
                (sum, file) => sum + (file.progress || 0),
                0
            );
            const avgProgress = totalProgress / uploadedFiles.length;
            setButtonProgress(avgProgress);
        } else {
            setButtonProgress(0);
        }
    }, [uploadedFiles, isUploading]);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        handleFileSelect(e.dataTransfer.files);
    };

    const removeFile = (id: string) => {
        setUploadedFiles((prev) => {
            const fileToRemove = prev.find((f) => f.id === id);
            if (fileToRemove) {
                URL.revokeObjectURL(fileToRemove.preview);
            }
            return prev.filter((f) => f.id !== id);
        });

        setError(null);
    };

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return bytes + " B";
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
        return (bytes / (1024 * 1024)).toFixed(1) + " MB";
    };

    const pathName = usePathname();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (uploadedFiles.length === 0) {
            setError("Please select at least one image to upload");
            return;
        }

        setIsUploading(true);
        setError(null);
        setShowResults(false);
        setUploadResults([]);
        setButtonProgress(0);

        // Start simulated progress for each file
        uploadedFiles.forEach((file) => {
            if (file.status !== "success") {
                simulateProgress(file.id);
            }
        });

        try {
            const formData = new FormData();
            uploadedFiles.forEach((file) => {
                formData.append("images", file.file);
            });

            // Call server action
            const result = await uploadImagesCloudinary(formData, pathName);

            if (result.success && result.data) {
                setUploadResults(result.data);
                setShowResults(true);

                // Mark all files as success
                setUploadedFiles((prev) =>
                    prev.map((file) => ({
                        ...file,
                        status: "success",
                        progress: 100,
                        message: "Upload complete!",
                    }))
                );

                setButtonProgress(100);

                // Clear files after delay
                setTimeout(() => {
                    uploadedFiles.forEach((file) =>
                        URL.revokeObjectURL(file.preview)
                    );
                    setUploadedFiles([]);
                }, 2000);
            } else {
                setError(result.error || "Upload failed");
                // Update files to error state
                setUploadedFiles((prev) =>
                    prev.map((file) => ({
                        ...file,
                        status: "error",
                        message: "Upload failed",
                    }))
                );
                setButtonProgress(0);
            }
        } catch (err) {
            setError("Upload failed. Please try again.");
            console.error(err);
            setButtonProgress(0);
        } finally {
            setIsUploading(false);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    const clearAllFiles = () => {
        uploadedFiles.forEach((file) => URL.revokeObjectURL(file.preview));
        setUploadedFiles([]);
        setShowResults(false);
        setUploadResults([]);
        setButtonProgress(0);
        setError(null);
    };

    const ProgressBar = ({
        progress,
        status,
    }: {
        progress: number;
        status: string;
    }) => (
        <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
                className={`h-full rounded-full ${
                    status === "error"
                        ? "bg-red-500"
                        : status === "success"
                        ? "bg-green-500"
                        : "bg-linear-to-r from-custom-primary to-custom-primary-light"
                }`}
                initial={{ width: "0%" }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
            />
            {status === "uploading" && (
                <motion.div
                    className="absolute inset-0 bg-linear-to-r from-transparent via-white/30 to-transparent"
                    animate={{
                        x: ["-100%", "100%"],
                    }}
                    transition={{
                        repeat: Infinity,
                        duration: 1.5,
                        ease: "linear",
                    }}
                />
            )}
        </div>
    );

    return (
        <section className="mb-12">
            <form onSubmit={handleSubmit}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className={`relative bg-linear-to-br from-custom-primary/5 via-white to-custom-primary/5 border-2 border-dashed rounded-3xl p-6 lg:p-10 transition-all duration-300 overflow-hidden ${
                        isDragging
                            ? "border-custom-primary bg-custom-primary/10 scale-[1.01]"
                            : "border-custom-primary/20 hover:border-custom-primary/40"
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-5">
                        <div className="absolute inset-0 bg-[radial-gradient(#607afb_1px,transparent_1px)] bg-size-[20px_20px]"></div>
                    </div>

                    <div className="relative flex flex-col lg:flex-row items-center gap-10">
                        {/* Left Column - Upload Area */}
                        <div className="w-full lg:w-1/2">
                            <div className="space-y-6">
                                <div className="text-center lg:text-left">
                                    <h1 className="text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight bg-linear-to-r from-custom-primary to-custom-primary/50 bg-clip-text text-transparent">
                                        Upload Images in{" "}
                                        <span className="text-gray-900">
                                            Seconds
                                        </span>
                                    </h1>
                                    <p className="text-gray-600 text-lg mt-3">
                                        Drag & drop or click to upload. Supports
                                        JPG, PNG, GIF, WEBP up to 5MB each.
                                    </p>
                                </div>

                                <div
                                    className={`relative min-h-75 bg-inner-to-br from-white to-gray-50 rounded-2xl shadow-xl overflow-hidden transition-all duration-300 cursor-pointer group border-2 ${
                                        isDragging
                                            ? "border-custom-primary bg-custom-primary/5"
                                            : "border-transparent hover:border-custom-primary/30"
                                    }`}
                                    onClick={triggerFileInput}
                                >
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={(e) =>
                                            handleFileSelect(e.target.files)
                                        }
                                        className="hidden"
                                        disabled={isUploading}
                                    />

                                    <AnimatePresence>
                                        {uploadedFiles.length === 0 ? (
                                            <motion.div
                                                initial={{
                                                    opacity: 0,
                                                    scale: 0.9,
                                                }}
                                                animate={{
                                                    opacity: 1,
                                                    scale: 1,
                                                }}
                                                exit={{
                                                    opacity: 0,
                                                    scale: 0.9,
                                                }}
                                                className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center"
                                            >
                                                <div className="relative">
                                                    <motion.div
                                                        animate={{
                                                            y: [0, -10, 0],
                                                        }}
                                                        transition={{
                                                            repeat: Infinity,
                                                            duration: 2,
                                                            ease: "easeInOut",
                                                        }}
                                                        className="mb-6 flex justify-center items-center"
                                                    >
                                                        <div className="relative">
                                                            <div className="w-24 h-24 rounded-full bg-custom-primary/20  flex items-center justify-center">
                                                                {isDragging ? (
                                                                    <ImageIcon className="w-12 h-12 text-custom-primary animate-pulse" />
                                                                ) : (
                                                                    <Upload className="w-12 h-12 text-custom-primary" />
                                                                )}
                                                            </div>
                                                            {isDragging && (
                                                                <motion.div
                                                                    className="absolute -inset-4 rounded-full border-4 border-custom-primary/30"
                                                                    animate={{
                                                                        scale: [
                                                                            1,
                                                                            1.2,
                                                                            1,
                                                                        ],
                                                                        opacity:
                                                                            [
                                                                                0.5,
                                                                                0.2,
                                                                                0.5,
                                                                            ],
                                                                    }}
                                                                    transition={{
                                                                        repeat: Infinity,
                                                                        duration: 1.5,
                                                                    }}
                                                                />
                                                            )}
                                                        </div>
                                                    </motion.div>
                                                    <h3 className="text-2xl font-bold mb-2">
                                                        {isDragging
                                                            ? "Drop to upload!"
                                                            : "Drag & drop images"}
                                                    </h3>
                                                    <p className="text-gray-600 mb-6">
                                                        or click to browse files
                                                    </p>
                                                    <motion.button
                                                        type="button"
                                                        whileHover={{
                                                            scale: 1.05,
                                                        }}
                                                        whileTap={{
                                                            scale: 0.95,
                                                        }}
                                                        className="px-8 py-3 bg-custom-primary text-white font-bold rounded-xl shadow-lg shadow-custom-primary/30 hover:shadow-custom-primary/50 transition-shadow"
                                                    >
                                                        <Upload
                                                            className="inline mr-2"
                                                            size={20}
                                                        />
                                                        Select Images
                                                    </motion.button>
                                                </div>
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className="p-6"
                                            >
                                                <div className="flex justify-between items-center mb-6">
                                                    <h3 className="text-xl font-bold">
                                                        Selected Files (
                                                        {uploadedFiles.length}/
                                                        {MAX_FILES})
                                                    </h3>
                                                    {!isUploading &&
                                                        uploadedFiles.length >
                                                            0 && (
                                                            <button
                                                                type="button"
                                                                onClick={(
                                                                    e
                                                                ) => {
                                                                    e.stopPropagation(); // Add this line
                                                                    clearAllFiles(); // Call your function
                                                                }}
                                                                className="text-sm text-red-500 hover:text-red-700 flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
                                                            >
                                                                <X size={16} />
                                                                Clear All
                                                            </button>
                                                        )}
                                                </div>

                                                <div className="space-y-4 max-h-75 overflow-y-auto pr-2">
                                                    {uploadedFiles.map(
                                                        (file) => (
                                                            <motion.div
                                                                key={file.id}
                                                                initial={{
                                                                    opacity: 0,
                                                                    y: 10,
                                                                }}
                                                                animate={{
                                                                    opacity: 1,
                                                                    y: 0,
                                                                }}
                                                                className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:border-custom-primary/30 transition-colors group/file"
                                                            >
                                                                <div className="flex items-center gap-4">
                                                                    <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                                                                        <Image
                                                                            src={
                                                                                file.preview
                                                                            }
                                                                            alt={
                                                                                file.name
                                                                            }
                                                                            fill
                                                                            className="object-cover"
                                                                            sizes="64px"
                                                                        />
                                                                        {file.status ===
                                                                            "success" && (
                                                                            <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                                                                                <Check className="w-6 h-6 text-green-600" />
                                                                            </div>
                                                                        )}
                                                                        {file.status ===
                                                                            "error" && (
                                                                            <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center">
                                                                                <X className="w-6 h-6 text-red-600" />
                                                                            </div>
                                                                        )}
                                                                    </div>

                                                                    <div className="flex-1 min-w-0">
                                                                        <div className="flex justify-between items-start mb-2">
                                                                            <div>
                                                                                <h4 className="font-medium text-gray-900 truncate">
                                                                                    {
                                                                                        file.name
                                                                                    }
                                                                                </h4>
                                                                                <p className="text-sm text-gray-500">
                                                                                    {formatFileSize(
                                                                                        file.size
                                                                                    )}
                                                                                </p>
                                                                            </div>
                                                                            <div className="flex items-center gap-2">
                                                                                {file.status ===
                                                                                    "uploading" && (
                                                                                    <Loader2 className="w-4 h-4 text-custom-primary animate-spin" />
                                                                                )}
                                                                                <button
                                                                                    type="button"
                                                                                    onClick={(
                                                                                        e
                                                                                    ) => {
                                                                                        e.stopPropagation();
                                                                                        removeFile(
                                                                                            file.id
                                                                                        );
                                                                                    }}
                                                                                    className="opacity-0 group-hover/file:opacity-100 text-gray-400 hover:text-red-500 transition-all p-1 "
                                                                                >
                                                                                    <X
                                                                                        size={
                                                                                            18
                                                                                        }
                                                                                    />
                                                                                </button>
                                                                            </div>
                                                                        </div>

                                                                        <div className="space-y-2">
                                                                            <ProgressBar
                                                                                progress={
                                                                                    file.progress ||
                                                                                    0
                                                                                }
                                                                                status={
                                                                                    file.status
                                                                                }
                                                                            />
                                                                            <div className="flex justify-between text-xs">
                                                                                <span
                                                                                    className={`font-medium ${
                                                                                        file.status ===
                                                                                        "error"
                                                                                            ? "text-red-500"
                                                                                            : file.status ===
                                                                                              "success"
                                                                                            ? "text-green-500"
                                                                                            : "text-custom-primary"
                                                                                    }`}
                                                                                >
                                                                                    {file.message ||
                                                                                        "Ready to upload"}
                                                                                </span>
                                                                                <span className="text-gray-500">
                                                                                    {Math.round(
                                                                                        file.progress ||
                                                                                            0
                                                                                    )}

                                                                                    %
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </motion.div>
                                                        )
                                                    )}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Quick Stats */}
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="bg-white p-4 rounded-xl border border-gray-200 text-center">
                                        <div className="text-2xl font-bold text-custom-primary">
                                            {MAX_FILES}
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            Max Files
                                        </div>
                                    </div>
                                    <div className="bg-white p-4 rounded-xl border border-gray-200 text-center">
                                        <div className="text-2xl font-bold text-custom-primary">
                                            5MB
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            Per File
                                        </div>
                                    </div>
                                    <div className="bg-white p-4 rounded-xl border border-gray-200 text-center">
                                        <div className="text-2xl font-bold text-custom-primary">
                                            {uploadedFiles.length}
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            Selected
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Info & Actions */}
                        <div className="w-full lg:w-1/2 space-y-8">
                            {/* Features with Icons */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-linear-to-br from-custom-primary/20 to-custom-primary-light/20 flex items-center justify-center">
                                        <Zap className="w-6 h-6 text-custom-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg">
                                            Lightning Fast
                                        </h3>
                                        <p className="text-gray-600">
                                            Upload and process images in seconds
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-linear-to-br from-custom-primary/20 to-custom-primary-light/20 flex items-center justify-center">
                                        <Shield className="w-6 h-6 text-custom-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg">
                                            Secure Cloud Storage
                                        </h3>
                                        <p className="text-gray-600">
                                            Your images are safe with Cloudinary
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-linear-to-br from-custom-primary/20 to-custom-primary-light/20 flex items-center justify-center">
                                        <BarChart3 className="w-6 h-6 text-custom-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg">
                                            Real-time Progress
                                        </h3>
                                        <p className="text-gray-600">
                                            Track your uploads with live updates
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Upload Results */}
                            <AnimatePresence>
                                {showResults && uploadResults.length > 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="bg-linear-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6"
                                    >
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                                                <Check className="w-6 h-6 text-green-600" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-lg">
                                                    Upload Successful!
                                                </h3>
                                                <p className="text-green-700 text-sm">
                                                    {uploadResults.length}{" "}
                                                    image(s) uploaded to
                                                    Cloudinary
                                                </p>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            {uploadResults
                                                .slice(0, 3)
                                                .map((result, index) => (
                                                    <div
                                                        key={result.public_id}
                                                        className="flex items-center gap-3 p-3 bg-white/50 rounded-lg"
                                                    >
                                                        <div className="w-8 h-8 rounded bg-green-100 flex items-center justify-center">
                                                            <span className="text-sm font-bold text-green-600">
                                                                {index + 1}
                                                            </span>
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-medium truncate">
                                                                {
                                                                    result.public_id
                                                                }
                                                            </p>
                                                            <p className="text-xs text-gray-500">
                                                                {formatFileSize(
                                                                    result.bytes
                                                                )}{" "}
                                                                •{" "}
                                                                {result.format}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}
                                            {uploadResults.length > 3 && (
                                                <p className="text-sm text-green-700 text-center">
                                                    +{uploadResults.length - 3}{" "}
                                                    more images
                                                </p>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Error Display */}
                            <AnimatePresence>
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="bg-linear-to-br from-red-50 to-pink-50 border border-red-200 rounded-2xl p-6"
                                    >
                                        <div className="flex items-center gap-3">
                                            <AlertCircle className="w-6 h-6 text-red-500 shrink-0" />
                                            <p className="text-red-700 font-medium">
                                                {error}
                                            </p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Action Buttons */}
                            <div className="space-y-4">
                                {/* Submit Button with Progress Fill */}
                                <div className="relative">
                                    <motion.button
                                        type="submit"
                                        disabled={
                                            isUploading ||
                                            uploadedFiles.length === 0
                                        }
                                        whileHover={
                                            isUploading ||
                                            uploadedFiles.length === 0
                                                ? {}
                                                : { scale: 1.02 }
                                        }
                                        whileTap={
                                            isUploading ||
                                            uploadedFiles.length === 0
                                                ? {}
                                                : { scale: 0.98 }
                                        }
                                        className={`w-full py-5 rounded-2xl font-bold text-lg transition-all relative overflow-hidden ${
                                            isUploading ||
                                            uploadedFiles.length === 0
                                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                                : "text-white bg-custom-primary shadow"
                                        }`}
                                    >
                                        {/* Background static layer */}
                                        <div
                                            className={`absolute inset-0 bg-linear-to-r bg-custom-primary rounded-2xl opacity-30`}
                                        />

                                        {/* Progress fill layer */}
                                        {isUploading && (
                                            <motion.div
                                                className={`absolute inset-0 bg-linear-to-r bg-custom-primary rounded-2xl origin-left`}
                                                initial={{ scaleX: 0 }}
                                                animate={{
                                                    scaleX:
                                                        buttonProgress / 100,
                                                }}
                                                transition={{ duration: 0.3 }}
                                            />
                                        )}

                                        {/* Content */}
                                        <div className="relative z-10 flex items-center justify-center gap-3">
                                            {isUploading ? (
                                                <>
                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                    <span>
                                                        Uploading{" "}
                                                        {Math.round(
                                                            buttonProgress
                                                        )}
                                                        %
                                                    </span>
                                                </>
                                            ) : (
                                                <>
                                                    <Cloud className="w-5 h-5" />
                                                    <span>
                                                        Upload{" "}
                                                        {uploadedFiles.length}{" "}
                                                        Image
                                                        {uploadedFiles.length !==
                                                        1
                                                            ? "s"
                                                            : ""}
                                                    </span>
                                                </>
                                            )}
                                        </div>

                                        {/* Progress text overlay */}
                                        {isUploading && (
                                            <div className="absolute inset-0 flex items-center justify-center z-20">
                                                <div className="bg-black/20 backdrop-blur-sm px-4 py-1 rounded-full">
                                                    <span className="text-white font-bold text-sm">
                                                        {Math.round(
                                                            buttonProgress
                                                        )}
                                                        % Complete
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    </motion.button>

                                    {/* Progress indicator above button */}
                                    {isUploading && (
                                        <div className="absolute -top-6 left-0 right-0">
                                            <div className="flex justify-between text-xs text-gray-600 mb-1">
                                                <span>Overall Progress</span>
                                                <span>
                                                    {Math.round(buttonProgress)}
                                                    %
                                                </span>
                                            </div>
                                            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                                <motion.div
                                                    className="h-full bg-linear-to-br from-custom-primary to-custom-primary-light"
                                                    initial={{ width: "0%" }}
                                                    animate={{
                                                        width: `${buttonProgress}%`,
                                                    }}
                                                    transition={{
                                                        duration: 0.3,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {!isUploading && (
                                    <div className="grid grid-cols-2 gap-4">
                                        <motion.button
                                            type="button"
                                            onClick={triggerFileInput}
                                            disabled={
                                                uploadedFiles.length >=
                                                MAX_FILES
                                            }
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className={`py-4 rounded-xl font-bold transition-colors border-2 flex items-center justify-center gap-3 ${
                                                uploadedFiles.length >=
                                                MAX_FILES
                                                    ? "border-gray-300 text-gray-400 cursor-not-allowed"
                                                    : "border-custom-primary text-custom-primary hover:bg-custom-primary/5"
                                            }`}
                                        >
                                            <Upload size={20} />
                                            Add More
                                        </motion.button>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                window.open(
                                                    "https://cloudinary.com",
                                                    "_blank"
                                                )
                                            }
                                            className="py-4 rounded-xl font-bold border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-3"
                                        >
                                            <ImageIcon size={20} />
                                            View Gallery
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Upload Progress Details */}
                            {isUploading && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200"
                                >
                                    <div className="flex justify-between items-center mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-linear-to-br from-custom-primary/20 to-custom-primary-light/20 flex items-center justify-center">
                                                <Cloud className="w-5 h-5 text-custom-primary" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold">
                                                    Uploading to Cloudinary
                                                </h4>
                                                <p className="text-sm text-gray-500">
                                                    Processing your images
                                                </p>
                                            </div>
                                        </div>
                                        <span className="text-2xl font-bold text-custom-primary">
                                            {Math.round(buttonProgress)}%
                                        </span>
                                    </div>
                                    <ProgressBar
                                        progress={buttonProgress}
                                        status="uploading"
                                    />
                                    <div className="flex justify-between text-sm text-gray-600 mt-3">
                                        <span>
                                            {
                                                uploadedFiles.filter(
                                                    (f) =>
                                                        f.status === "success"
                                                ).length
                                            }{" "}
                                            of {uploadedFiles.length} complete
                                        </span>
                                        <span className="font-medium">
                                            {
                                                uploadedFiles.filter(
                                                    (f) =>
                                                        f.status === "uploading"
                                                ).length
                                            }{" "}
                                            active
                                        </span>
                                    </div>
                                    {/* Status color indicator */}
                                    <div className="flex gap-2 mt-4">
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-3 h-3 rounded-full bg-custom-primary"></div>
                                            <span className="text-xs text-gray-600">
                                                Pending
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                            <span className="text-xs text-gray-600">
                                                Uploading
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                            <span className="text-xs text-gray-600">
                                                Completed
                                            </span>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </div>
                </motion.div>
            </form>
        </section>
    );
}
