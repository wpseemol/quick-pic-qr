// components/ImageCard.tsx
"use client";

import { CloudinaryImage } from "@/types/cloudinary";

import Image from "next/image";

interface ImageCardProps {
    image: CloudinaryImage;
}

export default function ImageCard({ image }: ImageCardProps) {
    const handleFavorite = () => {
        // Add favorite functionality here
        console.log("Favorite clicked for:", image.asset_id);
    };

    const handleViewImage = () => {
        // Add view image functionality here
        console.log("View image:", image.asset_id);
    };

    const handleGenerateQR = () => {
        // Add QR generation functionality here
        console.log("Generate QR for:", image.asset_id);
    };

    return (
        <div className="bg-white rounded-xl overflow-hidden custom-shadow card-hover transition-all duration-300 flex flex-col border border-custom-primary/20">
            <div className="relative group aspect-3/4 overflow-hidden">
                {/* Using next/image for better performance */}
                <div className="w-full h-full relative overflow-hidden">
                    <Image
                        src={image.secure_url}
                        alt={image.original_filename || "quick image qr"}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        // Prioritize first couple images
                    />
                </div>
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-between">
                    <div className="flex justify-end">
                        <button
                            onClick={handleFavorite}
                            className="bg-white/90 backdrop-blur p-2 rounded-full text-font-color hover:bg-custom-primary transition-colors"
                            aria-label="Add to favorites"
                        >
                            <span className="material-symbols-outlined text-[20px]">
                                favorite
                            </span>
                        </button>
                    </div>
                </div>
            </div>
            <div className="p-5 space-y-3">
                <div>
                    <h4 className="font-bold text-font-color truncate">
                        {image.original_filename}
                    </h4>
                    <p className="text-custom-primary text-xs font-medium">
                        {image.original_filename}
                    </p>
                    {/* <p className="text-[#509595] text-[11px] uppercase tracking-wider mt-1">
                        Uploaded {image.} • {image.size}
                    </p> */}
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleViewImage}
                        className="flex-1 bg-custom-primary text-font-color text-sm font-bold py-2.5 rounded-lg hover:bg-custom-primary/90 transition-colors"
                    >
                        View Image
                    </button>
                    <button
                        onClick={handleGenerateQR}
                        className="p-2.5 bg-[#e8f3f3] text-font-color rounded-lg hover:bg-custom-primary/20 transition-colors"
                        title="Generate QR"
                        aria-label="Generate QR code"
                    >
                        <span className="material-symbols-outlined text-[20px]">
                            qr_code_2
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
}
