export type CompressionFormat = "webp" | "jpeg" | "png";
export type CompressionOptions = {
    maxWidth?: number;
    quality?: number;
    format?: CompressionFormat;
};
export type CompressionResult = {
    blob: Blob;
    width: number;
    height: number;
    format: CompressionFormat;
};
export declare function compressImage(file: File, options?: CompressionOptions): Promise<CompressionResult>;
