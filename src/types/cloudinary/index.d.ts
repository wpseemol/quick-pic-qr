// Cloudinary Image type

export interface CloudinaryUploadResult {
    public_id: string;
    secure_url: string;
    format: string;
    width: number;
    height: number;
    bytes: number;
    original_filename: string;
    created_at: string;
}

// types/cloudinary.ts
export interface CloudinaryImage {
    asset_id: string;
    public_id: string;
    format: string;
    version: number;
    resource_type: string;
    type: string;
    created_at: string;
    bytes: number;
    width: number;
    height: number;
    url: string;
    secure_url: string;
    folder: string;
    original_filename?: string;
    tags?: string[];
}

export interface CloudinaryListResponse {
    resources: CloudinaryImage[];
    next_cursor?: string;
    total_count?: number;
    rate_limit_allowed?: number;
    rate_limit_reset_at?: string;
    rate_limit_remaining?: number;
}

export interface PaginatedCloudinaryImages {
    images: CloudinaryImage[];
    pagination: {
        nextCursor?: string;
        prevCursor?: string;
        hasMore: boolean;
        total?: number;
        currentPage: number;
        pageSize: number;
    };
}

export interface CloudinaryListOptions {
    maxResults?: number;
    nextCursor?: string;
    prevCursor?: string;
    folder?: string;
    resourceType?: string;
    tags?: string[];
    prefix?: string;
    context?: boolean;
}

// types/cloudinary.ts
export interface CloudinaryAsset {
    asset_id: string;
    public_id: string;
    format: string;
    version: number;
    resource_type: "image" | "video" | "raw";
    type: string;
    created_at: string;
    bytes: number;
    width: number;
    height: number;
    url: string;
    secure_url: string;
    folder: string;
    original_filename?: string;
    tags?: string[];
    context?: Record<string, string>;
    metadata?: Record<string, unknown>;
}

export interface CloudinaryListResponse {
    resources: CloudinaryAsset[];
    next_cursor?: string;
    total_count?: number;
    rate_limit_allowed?: number;
    rate_limit_reset_at?: string;
    rate_limit_remaining?: number;
}

export interface CloudinaryApiError {
    message: string;
    http_code: number;
    name: string;
}

export interface CloudinarySuccessResponse {
    result: "ok" | "not found";
}

export interface CloudinaryExplicitResponse {
    public_id: string;
    version: number;
    width: number;
    height: number;
    format: string;
    resource_type: string;
    created_at: string;
    tags: string[];
    bytes: number;
    type: string;
    etag: string;
    placeholder: boolean;
    url: string;
    secure_url: string;
    signature: string;
    original_filename: string;
    [key: string]: unknown;
}

export interface CloudinaryUploadResult {
    public_id: string;
    version: number;
    signature: string;
    width: number;
    height: number;
    format: string;
    resource_type: string;
    created_at: string;
    tags: string[];
    bytes: number;
    type: string;
    etag: string;
    placeholder: boolean;
    url: string;
    secure_url: string;
    original_filename: string;
    [key: string]: unknown;
}

export interface PaginatedCloudinaryImages {
    images: CloudinaryAsset[];
    pagination: {
        nextCursor?: string;
        prevCursor?: string;
        hasMore: boolean;
        total?: number;
        currentPage: number;
        pageSize: number;
    };
}

export interface CloudinaryListOptions {
    maxResults?: number;
    nextCursor?: string;
    folder?: string;
    resourceType?: "image" | "video" | "raw";
    tags?: string[];
    prefix?: string;
    context?: boolean;
}

// types/cloudinary.ts - Add these interfaces
export interface CloudinaryImageDetails {
    asset_id: string;
    public_id: string;
    format: string;
    version: number;
    resource_type: "image" | "video" | "raw";
    type: "upload" | "private" | "authenticated";
    created_at: string;
    uploaded_at: string;
    bytes: number;
    width: number;
    height: number;
    url: string;
    secure_url: string;
    original_filename: string;
    folder: string;
    tags?: string[];
    context?: Record<string, string>;
    metadata?: Record<string, unknown>;
    colors?: Array<[string, number]>;
    faces?: Array<number[]>;
    quality_analysis?: {
        focus: number;
        quality: number;
    };
    pages?: number;
    exif?: Record<string, unknown>;
    image_metadata?: Record<string, unknown>;
    phash?: string;
    predominant?: {
        google: Array<[string, number]>;
    };
    placeholder?: boolean;
    access_mode: "public" | "authenticated";
    access_control?: Array<{
        access_type: string;
        start: string;
        end: string;
    }>;
    etag: string;
    error?: {
        message: string;
    };
}

export interface CloudinaryTransformationOptions {
    width?: number;
    height?: number;
    crop?: string;
    gravity?: string;
    quality?: string | number;
    format?: string;
    [key: string]: unknown;
}
