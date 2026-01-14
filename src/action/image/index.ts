"use server";

"use server";

import cloudinary from "@/cloudinary";
import { CloudinaryUploadResult } from "@/types/cloudinary";
import { revalidatePath } from "next/cache";

/**
 *
 * @param formData Images array all images
 * @param pathName path for revalidate
 * @param folderName upload folder name
 * @returns
 */
export async function uploadImagesCloudinary(
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
        // console.log("Starting Cloudinary upload...");

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

        // console.log(`Processing ${files.length} file(s)`);

        const uploadPromises = files.map(async (file) => {
            try {
                // Convert File to Buffer
                const bytes = await file.arrayBuffer();
                const buffer = Buffer.from(bytes);

                // Convert buffer to data URI
                const base64String = buffer.toString("base64");
                const dataURI = `data:${file.type};base64,${base64String}`;

                // console.log(
                //     `Uploading: ${file.name} (${Math.round(
                //         file.size / 1024
                //     )} KB)`
                // );

                // Upload to Cloudinary
                const result = await new Promise<CloudinaryUploadResult>(
                    (resolve, reject) => {
                        cloudinary.uploader.upload(
                            dataURI,
                            {
                                folder: folderName, // Optional: organize in folder
                                public_id: `image_${Date.now()}_${Math.random()
                                    .toString(36)
                                    .substring(7)}`,

                                resource_type: "auto", // Automatically detect type
                                transformation: [
                                    { quality: "auto:good" }, // Optimize quality
                                    { fetch_format: "auto" }, // Auto format (webp for browsers)
                                ],
                                overwrite: false, // Don't overwrite existing
                                unique_filename: true, // Generate unique names
                            },
                            (error, result) => {
                                if (error) {
                                    console.error(
                                        `Error uploading ${file.name}:`,
                                        error
                                    );
                                    reject(error);
                                } else {
                                    resolve(result as CloudinaryUploadResult);
                                }
                            }
                        );
                    }
                );

                if (pathName) {
                    revalidatePath(pathName);
                }

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

        // // Log summary
        // console.log(
        //     `Upload completed: ${successfulUploads.length} successful, ${failedUploads.length} failed`
        // );

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
