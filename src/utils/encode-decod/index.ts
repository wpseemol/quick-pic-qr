export function encodePath(value: string): string {
    return encodeURIComponent(value);
}

export function decodePath(encoded: string): string {
    return decodeURIComponent(encoded);
}
