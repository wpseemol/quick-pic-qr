"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Upload as UploadIcon, Cloud } from "lucide-react";

interface HeroTopLeftInputProps {
    onImageUpload?: (file: File) => void;
    maxSizeMB?: number;
}

export default function HeroTopLeftInput({
    onImageUpload,
    maxSizeMB = 20,
}: HeroTopLeftInputProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);

    const validateFile = (file: File): boolean => {
        // Check file type
        const validTypes = [
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/webp",
        ];
        if (!validTypes.includes(file.type)) {
            setUploadError(
                "Invalid file type. Please upload JPG, PNG, or WEBP images."
            );
            return false;
        }

        // Check file size (converted to bytes)
        const maxSizeBytes = maxSizeMB * 1024 * 1024;
        if (file.size > maxSizeBytes) {
            setUploadError(`File size exceeds ${maxSizeMB}MB limit.`);
            return false;
        }

        setUploadError(null);
        return true;
    };

    const processFile = (file: File) => {
        if (!validateFile(file)) return;

        setIsUploading(true);
        setUploadError(null);

        // Simulate upload process
        setTimeout(() => {
            setIsUploading(false);

            // Call the callback if provided
            if (onImageUpload) {
                onImageUpload(file);
            }

            // Optional: You can add actual upload logic here
            // console.log("File uploaded:", file.name, file.size);
        }, 1500);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            processFile(files[0]);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            processFile(files[0]);
        }
        // Reset input to allow selecting same file again
        e.target.value = "";
    };

    return (
        <>
            {/* Right Column - Upload Area */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="relative"
            >
                <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`group relative flex min-h-100 flex-col items-center justify-center bg-white p-8 transition-all rounded-3xl border-2 border-dashed ${
                        isDragging
                            ? "border-[#607AFB] bg-[#607AFB]/5"
                            : "border-[#e8f3f3] hover:bg-[#607AFB]/5"
                    } ${uploadError ? "border-red-300" : ""}`}
                    style={{
                        boxShadow:
                            "0 10px 25px -5px rgba(0, 0, 0, 0.04), 0 8px 10px -6px rgba(0, 0, 0, 0.04)",
                    }}
                >
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        disabled={isUploading}
                    />

                    <div className="flex flex-col items-center gap-6 text-center pointer-events-none">
                        <div
                            className={`flex h-20 w-20 items-center justify-center rounded-full bg-[#607AFB]/20 text-[#607AFB] transition-transform ${
                                isDragging || isUploading
                                    ? "scale-110"
                                    : "group-hover:scale-110"
                            }`}
                        >
                            {isUploading ? (
                                <Cloud className="w-10 h-10 animate-pulse" />
                            ) : (
                                <UploadIcon className="w-10 h-10" />
                            )}
                        </div>
                        <div className="flex flex-col gap-2">
                            <p className="text-xl font-bold">
                                {isUploading
                                    ? "Uploading..."
                                    : uploadError
                                    ? "Upload Error"
                                    : "Drag and drop your images here"}
                            </p>
                            <p className="text-sm text-[#4e6b6b]">
                                {uploadError
                                    ? uploadError
                                    : `Support for JPG, PNG, WEBP (Max ${maxSizeMB}MB)`}
                            </p>
                        </div>

                        {!isUploading && (
                            <div className="mt-4 flex min-w-40 items-center justify-center gap-2 rounded-xl bg-font-color px-6 py-4 text-white font-bold pointer-events-auto cursor-pointer">
                                <UploadIcon className="w-5 h-5" />
                                Upload Image
                            </div>
                        )}

                        {/* Progress indicator */}
                        {isUploading && (
                            <div className="w-full max-w-xs mt-4">
                                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-[#607AFB] rounded-full"
                                        initial={{ width: "0%" }}
                                        animate={{ width: "100%" }}
                                        transition={{
                                            duration: 1.5,
                                            ease: "easeInOut",
                                        }}
                                    />
                                </div>
                                <p className="text-xs text-gray-500 mt-2">
                                    Processing your image...
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Decorative element */}
                <div className="absolute -bottom-6 -right-6 -z-10 h-32 w-32 rounded-full bg-[#607AFB]/20 blur-3xl"></div>
            </motion.div>
        </>
    );
}
