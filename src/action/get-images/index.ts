"use server";

import cloudinary from "@/cloudinary";
import {
    CloudinaryAsset,
    CloudinaryListResponse,
    PaginatedCloudinaryImages,
    CloudinaryListOptions,
    CloudinaryApiError,
} from "@/types/cloudinary";
import {
    CloudinaryResourcesOptions,
    CloudinaryInstance,
} from "@/types/cloudinary-sdk";

// Type assertion for Cloudinary instance
const cloudinaryInstance = cloudinary as CloudinaryInstance;

export async function getCloudinaryImages(
    options: CloudinaryListOptions = {}
): Promise<{
    success: boolean;
    data?: PaginatedCloudinaryImages;
    error?: string;
    message?: string;
}> {
    try {
        const {
            maxResults = 12,
            nextCursor,
            folder = "uploads",
            resourceType = "image",
            tags,
            prefix,
            context = false,
        } = options;

        // Prepare options for Cloudinary API with proper typing
        const cloudinaryOptions: CloudinaryResourcesOptions = {
            type: "upload",
            max_results: maxResults,
            resource_type: resourceType as
                | "image"
                | "video"
                | "raw"
                | undefined,
            context: context,
        };

        // Add folder if specified
        if (folder) {
            cloudinaryOptions.prefix = folder;
        }

        // Add next_cursor for pagination
        if (nextCursor) {
            cloudinaryOptions.next_cursor = nextCursor;
        }

        // Add tags if specified
        if (tags && tags.length > 0) {
            cloudinaryOptions.tags = tags.join(",");
        }

        // Add prefix if specified (for filtering within folder)
        if (prefix) {
            cloudinaryOptions.prefix = `${folder}/${prefix}`;
        }

        console.log(`Fetching images from Cloudinary with options:`, {
            folder,
            maxResults,
            hasNextCursor: !!nextCursor,
            tags,
            prefix,
        });

        // Fetch images from Cloudinary with proper error handling
        const result: CloudinaryListResponse = await new Promise(
            (resolve, reject) => {
                cloudinaryInstance.api.resources(
                    cloudinaryOptions,
                    (
                        error: CloudinaryApiError | null,
                        result: CloudinaryListResponse | undefined
                    ) => {
                        if (error) {
                            console.error(
                                "Error fetching Cloudinary images:",
                                error
                            );
                            reject(
                                new Error(
                                    error.message || "Failed to fetch images"
                                )
                            );
                        } else if (!result) {
                            reject(
                                new Error(
                                    "No response received from Cloudinary"
                                )
                            );
                        } else {
                            resolve(result);
                        }
                    }
                );
            }
        );

        // Calculate current page based on cursor
        let currentPage = 1;
        if (nextCursor) {
            currentPage = 2;
        }

        // Ensure resources is always an array
        const images = Array.isArray(result.resources) ? result.resources : [];

        // Prepare pagination data
        const paginationData: PaginatedCloudinaryImages = {
            images: images,
            pagination: {
                nextCursor: result.next_cursor,
                prevCursor: undefined,
                hasMore: !!result.next_cursor,
                total: result.total_count,
                currentPage,
                pageSize: maxResults,
            },
        };

        console.log(
            `Fetched ${images.length} images, has more: ${!!result.next_cursor}`
        );

        return {
            success: true,
            data: paginationData,
            message: `Found ${images.length} images`,
        };
    } catch (error) {
        console.error("Error in getCloudinaryImages:", error);

        const errorMessage =
            error instanceof Error
                ? error.message
                : "Failed to fetch images from Cloudinary";

        return {
            success: false,
            error: errorMessage,
            message: "Failed to fetch images",
        };
    }
}

export async function getCloudinaryImagesByPage(
    page: number = 1,
    pageSize: number = 12,
    folder: string = "uploads"
): Promise<{
    success: boolean;
    data?: PaginatedCloudinaryImages;
    error?: string;
}> {
    try {
        // For page 1, no cursor needed
        if (page === 1) {
            return await getCloudinaryImages({
                maxResults: pageSize,
                folder,
            });
        }

        // For pages > 1, we need to fetch sequentially
        // This is a limitation of Cloudinary's cursor-based pagination
        let currentCursor: string | undefined;
        let currentPage = 1;

        // Fetch pages sequentially until we reach the desired page
        while (currentPage < page) {
            const result = await getCloudinaryImages({
                maxResults: pageSize,
                nextCursor: currentCursor,
                folder,
            });

            if (!result.success || !result.data) {
                return {
                    success: false,
                    error: result.error || "Failed to fetch images",
                };
            }

            currentCursor = result.data.pagination.nextCursor;
            currentPage++;

            // If there's no more data, return empty
            if (!currentCursor && currentPage < page) {
                return {
                    success: true,
                    data: {
                        images: [],
                        pagination: {
                            nextCursor: undefined,
                            prevCursor: undefined,
                            hasMore: false,
                            total: result.data.pagination.total,
                            currentPage: page,
                            pageSize: pageSize,
                        },
                    },
                };
            }
        }

        // Now fetch the actual page we want
        const finalResult = await getCloudinaryImages({
            maxResults: pageSize,
            nextCursor: currentCursor,
            folder,
        });

        if (!finalResult.success || !finalResult.data) {
            return finalResult;
        }

        // Update the current page number
        return {
            success: true,
            data: {
                images: finalResult.data.images,
                pagination: {
                    ...finalResult.data.pagination,
                    currentPage: page,
                },
            },
        };
    } catch (error) {
        console.error("Error in getCloudinaryImagesByPage:", error);

        const errorMessage =
            error instanceof Error
                ? error.message
                : "Failed to fetch images by page";

        return {
            success: false,
            error: errorMessage,
        };
    }
}

// Session-based pagination using async functions only
export interface PaginationSession {
    cursors: Record<number, string>; // Using Record instead of Map
    currentPage: number;
    folder: string;
    pageSize: number;
}

export async function createPaginationSession(
    folder: string = "uploads",
    pageSize: number = 12
): Promise<PaginationSession> {
    return {
        cursors: {},
        currentPage: 1,
        folder,
        pageSize,
    };
}

export async function getPageWithSession(
    session: PaginationSession,
    page: number
): Promise<{
    success: boolean;
    data?: PaginatedCloudinaryImages & { session: PaginationSession };
    error?: string;
}> {
    try {
        let cursor: string | undefined;

        if (page > 1) {
            cursor = session.cursors[page - 1];

            if (!cursor) {
                return {
                    success: false,
                    error: `Cannot navigate to page ${page}. Please navigate sequentially from page ${session.currentPage}.`,
                };
            }
        }

        const result = await getCloudinaryImages({
            maxResults: session.pageSize,
            nextCursor: cursor,
            folder: session.folder,
        });

        if (!result.success || !result.data) {
            return {
                success: false,
                error: result.error || "Failed to fetch images",
            };
        }

        // Update session with new cursor if available
        if (result.data.pagination.nextCursor) {
            session.cursors[page] = result.data.pagination.nextCursor;
        }

        session.currentPage = page;

        // Clean up old cursors to prevent memory issues
        const maxCursorsToKeep = 10;
        const cursorKeys = Object.keys(session.cursors)
            .map(Number)
            .sort((a, b) => a - b);
        if (cursorKeys.length > maxCursorsToKeep) {
            const keysToRemove = cursorKeys.slice(
                0,
                cursorKeys.length - maxCursorsToKeep
            );
            keysToRemove.forEach((key) => {
                delete session.cursors[key];
            });
        }

        const responseData = {
            images: result.data.images,
            pagination: {
                ...result.data.pagination,
                currentPage: page,
            },
            session: session,
        };

        return {
            success: true,
            data: responseData,
        };
    } catch (error) {
        console.error("Error in getPageWithSession:", error);

        const errorMessage =
            error instanceof Error
                ? error.message
                : "Failed to fetch images with session";

        return {
            success: false,
            error: errorMessage,
        };
    }
}

export async function getNextPageWithSession(
    session: PaginationSession
): Promise<{
    success: boolean;
    data?: PaginatedCloudinaryImages & { session: PaginationSession };
    error?: string;
}> {
    return await getPageWithSession(session, session.currentPage + 1);
}

export async function getPrevPageWithSession(
    session: PaginationSession
): Promise<{
    success: boolean;
    data?: PaginatedCloudinaryImages & { session: PaginationSession };
    error?: string;
}> {
    if (session.currentPage <= 1) {
        return {
            success: false,
            error: "Already on first page",
        };
    }
    return await getPageWithSession(session, session.currentPage - 1);
}

export async function resetPaginationSession(
    session: PaginationSession
): Promise<PaginationSession> {
    session.cursors = {};
    session.currentPage = 1;
    return session;
}

// Simple pagination function for most use cases
export async function getPaginatedCloudinaryImages(
    page: number = 1,
    pageSize: number = 12,
    folder: string = "uploads"
): Promise<{
    success: boolean;
    data?: PaginatedCloudinaryImages;
    error?: string;
    message?: string;
}> {
    try {
        // For page 1, fetch directly
        if (page === 1) {
            return await getCloudinaryImages({
                maxResults: pageSize,
                folder,
            });
        }

        // For subsequent pages, we need to navigate using cursors
        // This requires storing cursor history on the client side
        return {
            success: false,
            error: "For pages beyond 1, please use cursor-based pagination. Use getCloudinaryImages() with the nextCursor from the previous response.",
            message:
                "Cloudinary uses cursor-based pagination. Store the nextCursor from each response to fetch subsequent pages.",
        };
    } catch (error) {
        console.error("Error in getPaginatedCloudinaryImages:", error);

        const errorMessage =
            error instanceof Error
                ? error.message
                : "Failed to fetch paginated images";

        return {
            success: false,
            error: errorMessage,
            message: "Failed to fetch images",
        };
    }
}

// Function to get all images (for small collections)
export async function getAllCloudinaryImages(
    folder: string = "uploads",
    maxImages: number = 100
): Promise<{
    success: boolean;
    data?: CloudinaryAsset[];
    error?: string;
    message?: string;
}> {
    try {
        const allImages: CloudinaryAsset[] = [];
        let nextCursor: string | undefined;
        let hasMore = true;
        let iteration = 0;
        const maxIterations = Math.ceil(maxImages / 100); // Cloudinary max per request is 500

        while (hasMore && iteration < maxIterations) {
            const result = await getCloudinaryImages({
                maxResults: 100, // Fetch in batches of 100
                nextCursor,
                folder,
            });

            if (!result.success || !result.data) {
                return {
                    success: false,
                    error: result.error || "Failed to fetch images",
                    message: "Failed during batch fetch",
                };
            }
            if (result.data) {
                allImages.push(...(result.data.images as CloudinaryAsset[]));
            }
            nextCursor = result.data.pagination.nextCursor;
            hasMore = result.data.pagination.hasMore;
            iteration++;

            // Break if we've reached the max
            if (allImages.length >= maxImages) {
                break;
            }
        }

        return {
            success: true,
            data: allImages.slice(0, maxImages),
            message: `Fetched ${allImages.length} images from Cloudinary`,
        };
    } catch (error) {
        console.error("Error in getAllCloudinaryImages:", error);

        const errorMessage =
            error instanceof Error
                ? error.message
                : "Failed to fetch all images";

        return {
            success: false,
            error: errorMessage,
            message: "Failed to fetch images",
        };
    }
}

// Helper function to get images by tag
export async function getCloudinaryImagesByTag(
    tag: string,
    options: Omit<CloudinaryListOptions, "tags"> = {}
): Promise<{
    success: boolean;
    data?: PaginatedCloudinaryImages;
    error?: string;
    message?: string;
}> {
    return await getCloudinaryImages({
        ...options,
        tags: [tag],
    });
}

// Helper function to search images by prefix (filename starts with)
export async function searchCloudinaryImages(
    searchTerm: string,
    options: CloudinaryListOptions = {}
): Promise<{
    success: boolean;
    data?: PaginatedCloudinaryImages;
    error?: string;
    message?: string;
}> {
    return await getCloudinaryImages({
        ...options,
        prefix: searchTerm,
    });
}
