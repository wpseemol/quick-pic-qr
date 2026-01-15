// components/SimpleImageCard.tsx
"use client";

import { useState } from "react";
import { CloudinaryImage } from "@/types/cloudinary";
import { encodePath } from "@/utils/encode-decod";
// import { deleteCloudinaryImage } from "@/action/image";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { decodeOriginalName } from "@/utils/file-name";

interface SimpleImageCardProps {
    image: CloudinaryImage;
    onDeleteSuccess?: (publicId: string) => void;
}

export default function SimpleImageCard({
    image,
    onDeleteSuccess,
}: SimpleImageCardProps) {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        console.log(image);

        if (
            !confirm(
                `width: ${image.width}, hight: ${image.height}, public id: ${image.public_id}`
            )
        ) {
            return;
        }

        // try {
        //     setIsDeleting(true);
        //     const result = await deleteCloudinaryImage(image.public_id);

        //     if (result.success) {
        //         onDeleteSuccess?.(image.public_id);
        //     } else {
        //         alert(`Delete failed: ${result.error || "Unknown error"}`);
        //     }
        // } catch (error) {
        //     alert(`Delete failed: ${error instanceof Error ? error.message : "Unknown error"}`);
        // } finally {
        //     setIsDeleting(false);
        // }
        setIsDeleting(false);
    };

    const handleQRClick = () => {
        router.push(`/gallery/${encodePath(image.public_id)}`);
    };

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return bytes + " B";
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
        return (bytes / (1024 * 1024)).toFixed(1) + " MB";
    };

    const original_filename = decodeOriginalName(image.public_id);

    return (
        <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 hover:shadow-md transition-shadow relative group">
            {/* Delete Button (Always Visible) */}
            <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="absolute top-2 right-2 z-10 p-2 bg-white/90 backdrop-blur-sm text-red-600 rounded-full hover:bg-red-600 hover:text-white transition-colors shadow-sm disabled:opacity-50"
                title="Delete image"
            >
                {isDeleting ? (
                    <svg
                        className="animate-spin h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        ></circle>
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                    </svg>
                ) : (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M3 6h18" />
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                        <line x1="10" y1="11" x2="10" y2="17" />
                        <line x1="14" y1="11" x2="14" y2="17" />
                    </svg>
                )}
            </button>

            {/* Image */}
            <div
                className="relative aspect-square overflow-hidden cursor-pointer"
                onClick={handleQRClick}
            >
                <Image
                    src={image.secure_url}
                    alt={original_filename || "Image"}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    {/* QR Icon on Hover */}
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <rect x="3" y="3" width="5" height="5" rx="1" />
                        <rect x="16" y="3" width="5" height="5" rx="1" />
                        <rect x="3" y="16" width="5" height="5" rx="1" />
                        <path d="M21 16h-3a2 2 0 0 0-2 2v3" />
                        <path d="M21 21v.01" />
                        <path d="M12 7v3a2 2 0 0 1-2 2H7" />
                        <path d="M3 12h.01" />
                        <path d="M12 3h.01" />
                        <path d="M12 16v.01" />
                        <path d="M16 12h1" />
                        <path d="M21 12v.01" />
                        <path d="M12 21h-1" />
                    </svg>
                </div>
            </div>

            {/* Info */}
            <div className="p-3">
                <h4
                    className="font-medium text-sm text-gray-900 truncate mb-1"
                    title={original_filename}
                >
                    {original_filename}
                </h4>
                <div className="flex justify-between text-xs text-gray-500">
                    <span>{image.format.toUpperCase()}</span>
                    <span>{formatFileSize(image.bytes)}</span>
                </div>
                <div className="text-xs text-gray-400 mt-1">
                    {image.width}×{image.height}
                </div>
            </div>
        </div>
    );
}
