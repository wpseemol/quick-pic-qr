// types/cloudinary-sdk.ts
export interface CloudinaryUploader {
    upload: (
        file: string,
        options: CloudinaryUploadOptions,
        callback?: (
            error: CloudinaryApiError | null,
            result: CloudinaryUploadResult
        ) => void
    ) => Promise<CloudinaryUploadResult>;

    destroy: (
        publicId: string,
        options?: { invalidate?: boolean },
        callback?: (
            error: CloudinaryApiError | null,
            result: CloudinarySuccessResponse
        ) => void
    ) => Promise<CloudinarySuccessResponse>;

    explicit: (
        publicId: string,
        options: CloudinaryExplicitOptions,
        callback?: (
            error: CloudinaryApiError | null,
            result: CloudinaryExplicitResponse
        ) => void
    ) => Promise<CloudinaryExplicitResponse>;
}

export interface CloudinaryApi {
    resources: (
        options: CloudinaryResourcesOptions,
        callback?: (
            error: CloudinaryApiError | null,
            result: CloudinaryListResponse
        ) => void
    ) => Promise<CloudinaryListResponse>;

    resource: (
        publicId: string,
        options?: CloudinaryResourceOptions,
        callback?: (
            error: CloudinaryApiError | null,
            result: CloudinaryAsset
        ) => void
    ) => Promise<CloudinaryAsset>;

    sub_folders: (
        prefix: string,
        callback?: (
            error: CloudinaryApiError | null,
            result: { folders: Array<{ name: string; path: string }> }
        ) => void
    ) => Promise<{ folders: Array<{ name: string; path: string }> }>;
}

export interface CloudinaryUploadOptions {
    folder?: string;
    public_id?: string;
    resource_type?: "auto" | "image" | "video" | "raw";
    transformation?: Array<Record<string, unknown>>;
    overwrite?: boolean;
    unique_filename?: boolean;
    tags?: string[];
    context?: Record<string, string>;
    [key: string]: unknown;
}

export interface CloudinaryExplicitOptions {
    type?: string;
    invalidate?: boolean;
    tags?: string;
    context?: string;
    [key: string]: unknown;
}

export interface CloudinaryResourcesOptions {
    type?: "upload" | "private" | "authenticated";
    prefix?: string;
    max_results?: number;
    next_cursor?: string;
    resource_type?: "image" | "video" | "raw";
    tags?: string;
    context?: boolean;
    direction?: "asc" | "desc";
    [key: string]: unknown;
}

export interface CloudinaryResourceOptions {
    context?: boolean;
    colors?: boolean;
    faces?: boolean;
    image_metadata?: boolean;
    pages?: boolean;
    [key: string]: unknown;
}

export interface CloudinaryInstance {
    uploader: CloudinaryUploader;
    api: CloudinaryApi;
    config: (config: {
        cloud_name: string;
        api_key: string;
        api_secret: string;
        secure?: boolean;
    }) => void;
}
