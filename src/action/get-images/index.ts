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
            currentPage = 2; // Simplified - you might want to track this differently
        }

        // Ensure resources is always an array
        const imagesArray = Array.isArray(result.resources)
            ? result.resources
            : [];

        // Prepare pagination data
        const paginationData: PaginatedCloudinaryImages = {
            images: imagesArray,
            pagination: {
                nextCursor: result.next_cursor,
                prevCursor: undefined, // Cloudinary doesn't provide previous cursor
                hasMore: !!result.next_cursor,
                total: result.total_count,
                currentPage,
                pageSize: maxResults,
            },
        };

        console.log(
            `Fetched ${
                imagesArray.length
            } images, has more: ${!!result.next_cursor}`
        );

        return {
            success: true,
            data: paginationData,
            message: `Found ${imagesArray.length} images`,
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
    folder: string = "uploads",
    cursorHistory: string[] = []
): Promise<{
    success: boolean;
    data?: PaginatedCloudinaryImages;
    error?: string;
}> {
    try {
        // If page is 1, start from beginning
        let currentCursor: string | undefined;

        // For pages > 1, we need the cursor from previous page
        if (page > 1 && cursorHistory.length >= page - 1) {
            currentCursor = cursorHistory[page - 2];
        }

        const result = await getCloudinaryImages({
            maxResults: pageSize,
            nextCursor: currentCursor,
            folder,
        });

        if (!result.success) {
            return {
                success: false,
                error: result.error || "Failed to fetch images",
            };
        }

        if (!result.data) {
            return {
                success: false,
                error: "No data received from Cloudinary",
            };
        }

        // Update cursor history (in a real app, this would be stored in session or database)
        const updatedCursorHistory = [...cursorHistory];
        if (
            result.data.pagination.nextCursor &&
            page === updatedCursorHistory.length + 1
        ) {
            updatedCursorHistory.push(result.data.pagination.nextCursor);
        }

        // Return with updated cursor history
        const responseData: PaginatedCloudinaryImages = {
            images: result.data.images,
            pagination: {
                ...result.data.pagination,
                currentPage: page,
            },
        };

        return {
            success: true,
            data: responseData,
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

// Helper function to create a more robust pagination system
interface PaginationSession {
    cursors: Map<number, string>; // Map page number to cursor
    currentPage: number;
}

export async function getCloudinaryImagesWithSession(
    session: PaginationSession,
    page: number = 1,
    pageSize: number = 12,
    folder: string = "uploads"
): Promise<{
    success: boolean;
    data?: PaginatedCloudinaryImages & { session: PaginationSession };
    error?: string;
}> {
    try {
        let cursor: string | undefined;

        // Get cursor for requested page from session
        if (page > 1) {
            cursor = session.cursors.get(page - 1);

            // If we don't have a cursor for this page, we can't navigate directly
            if (!cursor) {
                return {
                    success: false,
                    error: `Cannot navigate to page ${page}. Please navigate sequentially.`,
                };
            }
        }

        const result = await getCloudinaryImages({
            maxResults: pageSize,
            nextCursor: cursor,
            folder,
        });

        if (!result.success || !result.data) {
            return {
                success: false,
                error: result.error || "Failed to fetch images",
            };
        }

        // Update session with new cursor if available
        if (result.data.pagination.nextCursor) {
            session.cursors.set(page, result.data.pagination.nextCursor);
        }

        session.currentPage = page;

        // Clean up old cursors to prevent memory issues
        const maxCursorsToKeep = 10;
        if (session.cursors.size > maxCursorsToKeep) {
            const pageNumbers = Array.from(session.cursors.keys()).sort(
                (a, b) => a - b
            );
            const pagesToRemove = pageNumbers.slice(
                0,
                session.cursors.size - maxCursorsToKeep
            );
            pagesToRemove.forEach((pageNum) => session.cursors.delete(pageNum));
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
        console.error("Error in getCloudinaryImagesWithSession:", error);

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

// Function to get images with simple page-based navigation
export async function getCloudinaryImagesSimple(
    page: number = 1,
    pageSize: number = 12,
    folder: string = "uploads"
): Promise<{
    success: boolean;
    data?: {
        images: CloudinaryAsset[];
        pagination: {
            currentPage: number;
            pageSize: number;
            hasMore: boolean;
            total?: number;
        };
    };
    error?: string;
}> {
    try {
        // For simple pagination, we need to fetch sequentially from the beginning
        // This is less efficient but simpler to implement

        let currentCursor: string | undefined;
        let images: CloudinaryAsset[] = [];
        let hasMore = true;
        let totalCount: number | undefined;

        // We need to fetch from the beginning and count to the desired page
        for (let currentPage = 1; currentPage <= page; currentPage++) {
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

            // Store total count from first request
            if (currentPage === 1) {
                totalCount = result.data.pagination.total;
            }

            // If this is the page we want, store the images
            if (currentPage === page) {
                images = result.data.images as CloudinaryAsset[];
            }

            // Update cursor for next iteration
            currentCursor = result.data.pagination.nextCursor;
            hasMore = result.data.pagination.hasMore;

            // If there's no more data and we haven't reached our page, return empty
            if (!hasMore && currentPage < page) {
                return {
                    success: true,
                    data: {
                        images: [],
                        pagination: {
                            currentPage: page,
                            pageSize: pageSize,
                            hasMore: false,
                            total: totalCount,
                        },
                    },
                };
            }
        }

        return {
            success: true,
            data: {
                images: images,
                pagination: {
                    currentPage: page,
                    pageSize: pageSize,
                    hasMore: hasMore,
                    total: totalCount,
                },
            },
        };
    } catch (error) {
        console.error("Error in getCloudinaryImagesSimple:", error);

        const errorMessage =
            error instanceof Error ? error.message : "Failed to fetch images";

        return {
            success: false,
            error: errorMessage,
        };
    }
}

// Create a session manager for multi-page navigation
export class CloudinaryPaginationManager {
    private cursors: Map<number, string> = new Map();
    private currentPage: number = 1;
    private folder: string;
    private pageSize: number;

    constructor(folder: string = "uploads", pageSize: number = 12) {
        this.folder = folder;
        this.pageSize = pageSize;
    }

    async getPage(page: number): Promise<{
        success: boolean;
        data?: PaginatedCloudinaryImages;
        error?: string;
    }> {
        try {
            let cursor: string | undefined;

            if (page > 1) {
                cursor = this.cursors.get(page - 1);

                if (!cursor) {
                    return {
                        success: false,
                        error: `Cannot navigate to page ${page}. Please navigate sequentially from page ${this.currentPage}.`,
                    };
                }
            }

            const result = await getCloudinaryImages({
                maxResults: this.pageSize,
                nextCursor: cursor,
                folder: this.folder,
            });

            if (!result.success || !result.data) {
                return {
                    success: false,
                    error: result.error || "Failed to fetch images",
                };
            }

            // Store cursor for next page
            if (result.data.pagination.nextCursor) {
                this.cursors.set(page, result.data.pagination.nextCursor);
            }

            this.currentPage = page;

            return {
                success: true,
                data: {
                    images: result.data.images,
                    pagination: {
                        ...result.data.pagination,
                        currentPage: page,
                    },
                },
            };
        } catch (error) {
            const errorMessage =
                error instanceof Error ? error.message : "Failed to fetch page";

            return {
                success: false,
                error: errorMessage,
            };
        }
    }

    async next(): Promise<{
        success: boolean;
        data?: PaginatedCloudinaryImages;
        error?: string;
    }> {
        return this.getPage(this.currentPage + 1);
    }

    async prev(): Promise<{
        success: boolean;
        data?: PaginatedCloudinaryImages;
        error?: string;
    }> {
        if (this.currentPage <= 1) {
            return {
                success: false,
                error: "Already on first page",
            };
        }
        return this.getPage(this.currentPage - 1);
    }

    getCurrentPage(): number {
        return this.currentPage;
    }

    reset(): void {
        this.cursors.clear();
        this.currentPage = 1;
    }
}

// Function to initialize pagination
export function createCloudinaryPagination(
    folder: string = "uploads",
    pageSize: number = 12
): CloudinaryPaginationManager {
    return new CloudinaryPaginationManager(folder, pageSize);
}
