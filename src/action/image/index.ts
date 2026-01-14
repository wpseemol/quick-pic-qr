"use server";

import cloudinary from "@/cloudinary";
import { CloudinaryUploadResult } from "@/types/cloudinary";
import { createPublicId } from "@/utils/file-name";
import { revalidatePath } from "next/cache";

/**
 * Upload images to Cloudinary with metadata preservation and quality optimization
 * @param formData Images array all images
 * @param pathName path for revalidate
 * @param folderName upload folder name
 * @param preserveQuality Preserve original image quality (default: true)
 * @param addTags Array of additional tags to add
 * @returns Upload result with metadata
 */
export async function uploadImagesCloudinary(
    formData: FormData,
    pathName: string = "",
    folderName: string = "uploads",
    preserveQuality: boolean = true,
    additionalTags: string[] = []
): Promise<{
    success: boolean;
    message: string;
    data?: CloudinaryUploadResult[];
    error?: string;
}> {
    try {
        // Validate environment variables
        if (
            !process.env.CLOUDINARY_CLOUD_NAME ||
            !process.env.CLOUDINARY_API_KEY ||
            !process.env.CLOUDINARY_API_SECRET
        ) {
            console.error("Missing Cloudinary environment variables");
            return {
                success: false,
                message: "Server configuration error",
                error: "Cloudinary credentials not configured",
            };
        }

        // Get files from FormData
        const files = formData.getAll("images") as File[];

        if (!files || files.length === 0) {
            console.error("No files found in FormData");
            return {
                success: false,
                message: "No images to upload",
                error: "Please select at least one image",
            };
        }

        const uploadPromises = files.map(async (file) => {
            try {
                // Convert File to Buffer
                const bytes = await file.arrayBuffer();
                const buffer = Buffer.from(bytes);

                // Convert buffer to data URI
                const base64String = buffer.toString("base64");
                const dataURI = `data:${file.type};base64,${base64String}`;

                // Extract file info for metadata
                const originalFileName = file.name.replace(/\.[^/.]+$/, ""); // Remove extension
                const fileExtension =
                    file.name.split(".").pop()?.toLowerCase() || "";
                const fileSizeKB = Math.round(file.size / 1024);
                const uploadDate = new Date().toISOString().split("T")[0];

                // Generate tags from filename
                const filenameTags = originalFileName
                    .toLowerCase()
                    .split(/[_\-\s]+/)
                    .filter((tag) => tag.length > 2)
                    .slice(0, 5);

                // Combine all tags
                const allTags = [
                    ...new Set([...filenameTags, ...additionalTags]),
                ];

                // Prepare context metadata
                const contextMetadata = {
                    original_filename: file.name,
                    upload_date: uploadDate,
                    file_size_kb: fileSizeKB.toString(),
                    file_type: file.type,
                    file_extension: fileExtension,
                    quality_preserved: preserveQuality.toString(),
                    uploaded_via: "web_uploader",
                };

                // Determine quality settings based on preserveQuality flag
                const transformation = preserveQuality
                    ? [
                          // Lossless or minimal compression for quality preservation
                          { quality: "auto:best" }, // Use best quality auto setting
                          { fetch_format: "auto" }, // Auto format, but preserve quality
                          { dpr: "auto" }, // Auto device pixel ratio
                          { secure: true },
                      ]
                    : [
                          // Balanced quality and size optimization
                          { quality: "auto:good" },
                          { fetch_format: "auto" },
                          { secure: true },
                      ];

                // Upload to Cloudinary with quality preservation
                const result = await new Promise<CloudinaryUploadResult>(
                    (resolve, reject) => {
                        cloudinary.uploader.upload(
                            dataURI,
                            {
                                // File organization
                                folder: folderName,
                                public_id: createPublicId(originalFileName),
                                use_filename: true,
                                unique_filename: true,

                                // Image processing with quality focus
                                resource_type: "image",
                                transformation: transformation,

                                // Metadata and tags
                                tags: allTags,
                                context: contextMetadata,

                                // Quality preservation features
                                colors: true, // Extract colors without quality loss
                                image_metadata: true, // Preserve EXIF and other metadata

                                // Upload settings
                                overwrite: false,
                                invalidate: true,

                                // Quality-specific settings
                                quality_analysis: true, // Analyze but don't modify
                                ...(preserveQuality && {
                                    // Additional settings for quality preservation
                                    format: fileExtension || "jpg", // Keep original format if possible
                                    flags: "lossy", // Use lossy only if needed
                                    transformation: [
                                        // Progressive loading for JPG
                                        ...(fileExtension === "jpg" ||
                                        fileExtension === "jpeg"
                                            ? [{ flags: "progressive" }]
                                            : []),
                                        // PNG optimization if applicable
                                        ...(fileExtension === "png"
                                            ? [{ flags: "png8" }]
                                            : []),
                                    ],
                                }),
                            },
                            (error, result) => {
                                if (error) {
                                    console.error(
                                        `Error uploading ${file.name}:`,
                                        error
                                    );
                                    reject(error);
                                } else {
                                    // Update with additional quality metadata
                                    if (result) {
                                        cloudinary.uploader.explicit(
                                            result.public_id,
                                            {
                                                type: "upload",
                                                context: {
                                                    ...contextMetadata,
                                                    quality_score:
                                                        result.quality_analysis?.quality_score?.toString() ||
                                                        "unknown",
                                                    format_preserved:
                                                        fileExtension,
                                                    original_size_kb:
                                                        fileSizeKB.toString(),
                                                    final_size_kb: Math.round(
                                                        (result.bytes || 0) /
                                                            1024
                                                    ).toString(),
                                                    compression_ratio:
                                                        result.bytes
                                                            ? (
                                                                  file.size /
                                                                  result.bytes
                                                              ).toFixed(2)
                                                            : "unknown",
                                                },
                                                tags: allTags,
                                                colors: true,
                                                image_metadata: true,
                                            },
                                            (updateError, updatedResult) => {
                                                if (updateError) {
                                                    console.warn(
                                                        `Metadata update warning for ${file.name}:`,
                                                        updateError
                                                    );
                                                    resolve(
                                                        result as CloudinaryUploadResult
                                                    );
                                                } else {
                                                    resolve(
                                                        updatedResult as CloudinaryUploadResult
                                                    );
                                                }
                                            }
                                        );
                                    } else {
                                        reject(error);
                                    }
                                }
                            }
                        );
                    }
                );

                return {
                    success: true,
                    data: result,
                };
            } catch (error) {
                console.error(`Failed to upload ${file.name}:`, error);
                return {
                    success: false,
                    error:
                        error instanceof Error
                            ? error.message
                            : "Upload failed",
                    fileName: file.name,
                };
            }
        });

        // Wait for all uploads to complete
        const results = await Promise.all(uploadPromises);

        // Separate successful and failed uploads
        const successfulUploads = results.filter((r) => r.success);
        const failedUploads = results.filter((r) => !r.success);

        // Prepare response
        if (successfulUploads.length === 0) {
            return {
                success: false,
                message: "All uploads failed",
                error: failedUploads.map((f) => f.error).join(", "),
            };
        }

        const uploadedData = successfulUploads.map((r) => r.data!);

        if (pathName) {
            revalidatePath(pathName);
        }

        return {
            success: true,
            message:
                failedUploads.length > 0
                    ? `${successfulUploads.length} uploaded successfully, ${failedUploads.length} failed`
                    : `Successfully uploaded ${successfulUploads.length} image(s)`,
            data: uploadedData,
        };
    } catch (error) {
        console.error("Upload process error:", error);
        return {
            success: false,
            message: "Upload failed",
            error:
                error instanceof Error
                    ? error.message
                    : "Unknown error occurred",
        };
    }
}

/**
 * Upload images with maximum quality preservation
 * @param formData Images to upload
 * @param pathName Path to revalidate
 * @param folderName Folder name in Cloudinary
 */
export async function uploadImagesWithMaximumQuality(
    formData: FormData,
    pathName: string = "",
    folderName: string = "uploads"
): Promise<{
    success: boolean;
    message: string;
    data?: CloudinaryUploadResult[];
    error?: string;
}> {
    try {
        const files = formData.getAll("images") as File[];

        if (!files || files.length === 0) {
            return {
                success: false,
                message: "No images to upload",
                error: "Please select at least one image",
            };
        }

        const uploadPromises = files.map(async (file) => {
            try {
                const bytes = await file.arrayBuffer();
                const buffer = Buffer.from(bytes);
                const base64String = buffer.toString("base64");
                const dataURI = `data:${file.type};base64,${base64String}`;

                const originalFileName = file.name.replace(/\.[^/.]+$/, "");
                const fileExtension =
                    file.name.split(".").pop()?.toLowerCase() || "";

                // Preserve original format if it's a common lossless format
                const format = ["png", "bmp", "tiff", "tif"].includes(
                    fileExtension
                )
                    ? fileExtension
                    : "jpg";

                const result = await new Promise<CloudinaryUploadResult>(
                    (resolve, reject) => {
                        cloudinary.uploader.upload(
                            dataURI,
                            {
                                folder: folderName,
                                public_id: `${originalFileName}_maxq_${Date.now()}`,
                                use_filename: true,
                                unique_filename: true,

                                // Maximum quality preservation
                                resource_type: "image",
                                format: format,

                                // Minimal compression
                                transformation: [
                                    { quality: 100 }, // Maximum quality
                                    { fetch_format: format }, // Preserve original format
                                    { dpr: "1.0" }, // No DPR scaling
                                    { flags: "lossless" }, // Use lossless compression if available
                                ],

                                // Metadata preservation
                                image_metadata: true,
                                exif: true,
                                colors: true,

                                // Context
                                context: {
                                    original_filename: file.name,
                                    upload_date: new Date().toISOString(),
                                    quality_preset: "maximum",
                                    original_format: fileExtension,
                                    preserved_format: format,
                                    file_size_kb: Math.round(
                                        file.size / 1024
                                    ).toString(),
                                },

                                // Upload settings
                                overwrite: false,
                                invalidate: true,
                                type: "upload",
                            },
                            (error, result) => {
                                if (error) {
                                    reject(error);
                                } else {
                                    resolve(result as CloudinaryUploadResult);
                                }
                            }
                        );
                    }
                );

                return { success: true, data: result };
            } catch (error) {
                console.error(`Failed to upload ${file.name}:`, error);
                return {
                    success: false,
                    error:
                        error instanceof Error
                            ? error.message
                            : "Upload failed",
                    fileName: file.name,
                };
            }
        });

        const results = await Promise.all(uploadPromises);
        const successfulUploads = results.filter((r) => r.success);
        const failedUploads = results.filter((r) => !r.success);

        if (successfulUploads.length === 0) {
            return {
                success: false,
                message: "All uploads failed",
                error: failedUploads.map((f) => f.error).join(", "),
            };
        }

        const uploadedData = successfulUploads.map((r) => r.data!);

        if (pathName) {
            revalidatePath(pathName);
        }

        return {
            success: true,
            message: `Uploaded ${successfulUploads.length} image(s) with maximum quality preservation`,
            data: uploadedData,
        };
    } catch (error) {
        console.error("Maximum quality upload error:", error);
        return {
            success: false,
            message: "Upload failed",
            error: error instanceof Error ? error.message : "Unknown error",
        };
    }
}

/**
 * Smart upload that analyzes image and applies optimal quality settings
 */
export async function smartUploadImages(
    formData: FormData,
    pathName: string = "",
    folderName: string = "uploads"
): Promise<{
    success: boolean;
    message: string;
    data?: CloudinaryUploadResult[];
    error?: string;
}> {
    try {
        const files = formData.getAll("images") as File[];

        if (!files || files.length === 0) {
            return {
                success: false,
                message: "No images to upload",
                error: "Please select at least one image",
            };
        }

        const uploadPromises = files.map(async (file) => {
            try {
                const bytes = await file.arrayBuffer();
                const buffer = Buffer.from(bytes);
                const base64String = buffer.toString("base64");
                const dataURI = `data:${file.type};base64,${base64String}`;

                const originalFileName = file.name.replace(/\.[^/.]+$/, "");
                const fileExtension =
                    file.name.split(".").pop()?.toLowerCase() || "";
                const fileSizeMB = file.size / (1024 * 1024);

                // Smart quality determination
                let qualitySetting = "auto:good";
                let format = "auto";

                if (fileSizeMB > 5) {
                    // Large files get more compression
                    qualitySetting = "auto:eco";
                } else if (fileSizeMB < 1) {
                    // Small files can have better quality
                    qualitySetting = "auto:best";
                }

                // Determine format based on file type
                if (fileExtension === "png" || fileExtension === "svg") {
                    format = fileExtension; // Preserve PNG/SVG format
                }

                const result = await new Promise<CloudinaryUploadResult>(
                    (resolve, reject) => {
                        cloudinary.uploader.upload(
                            dataURI,
                            {
                                folder: folderName,
                                public_id: `${originalFileName}_smart_${Date.now()}`,
                                use_filename: true,
                                unique_filename: true,

                                resource_type: "image",
                                transformation: [
                                    { quality: qualitySetting },
                                    { fetch_format: format },
                                    { dpr: "auto" },
                                ],

                                // Smart features
                                quality_analysis: true,
                                colors: true,
                                faces: true,
                                image_metadata: true,

                                context: {
                                    original_filename: file.name,
                                    upload_strategy: "smart",
                                    detected_quality: qualitySetting,
                                    original_size_mb: fileSizeMB.toFixed(2),
                                    recommended_format: format,
                                    processed_by: "smart_uploader",
                                },

                                tags: ["smart_upload", "optimized"],

                                overwrite: false,
                                invalidate: true,
                            },
                            (error, result) => {
                                if (error) {
                                    reject(error);
                                } else {
                                    resolve(result as CloudinaryUploadResult);
                                }
                            }
                        );
                    }
                );

                return { success: true, data: result };
            } catch (error) {
                console.error(`Failed to upload ${file.name}:`, error);
                return {
                    success: false,
                    error:
                        error instanceof Error
                            ? error.message
                            : "Upload failed",
                    fileName: file.name,
                };
            }
        });

        const results = await Promise.all(uploadPromises);
        const successfulUploads = results.filter((r) => r.success);
        const failedUploads = results.filter((r) => !r.success);

        if (successfulUploads.length === 0) {
            return {
                success: false,
                message: "All uploads failed",
                error: failedUploads.map((f) => f.error).join(", "),
            };
        }

        const uploadedData = successfulUploads.map((r) => r.data!);

        if (pathName) {
            revalidatePath(pathName);
        }

        return {
            success: true,
            message: `Smart uploaded ${successfulUploads.length} image(s) with optimized quality`,
            data: uploadedData,
        };
    } catch (error) {
        console.error("Smart upload error:", error);
        return {
            success: false,
            message: "Upload failed",
            error: error instanceof Error ? error.message : "Unknown error",
        };
    }
}
