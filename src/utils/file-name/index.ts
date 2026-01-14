/**
 * Sanitize filename for URLs & Cloudinary
 */
export function sanitizeFileName(name: string): string {
    return name
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-_]/g, "");
}

/**
 * Create Cloudinary public_id
 */
export function createPublicId(originalFileName: string): string {
    const cleanName = sanitizeFileName(originalFileName);
    return `${cleanName}_${Date.now()}`;
}

/**
 * Decode original filename from public_id
 */
export function decodeOriginalName(publicId: string): string {
    // remove path if exists (uploads/)
    const file = publicId.split("/").pop() ?? publicId;

    // remove timestamp
    const parts = file.split("_");
    parts.pop();

    return parts.join("_");
}
