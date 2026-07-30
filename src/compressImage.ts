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

export async function compressImage(file: File, options: CompressionOptions = {}): Promise<CompressionResult> {
  const format = options.format || "webp";
  const maxWidth = Math.min(Math.max(options.maxWidth || 1200, 240), 2400);
  const quality = Math.min(Math.max(options.quality || 82, 40), 100) / 100;
  const sourceUrl = URL.createObjectURL(file);

  try {
    const image = new Image();
    image.decoding = "async";
    image.src = sourceUrl;
    await image.decode();
    const width = Math.min(image.naturalWidth, maxWidth);
    const height = Math.round((image.naturalHeight / image.naturalWidth) * width);
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Canvas is unavailable in this browser");
    context.drawImage(image, 0, 0, width, height);
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, `image/${format}`, format === "png" ? undefined : quality));
    if (!blob) throw new Error("The browser could not encode this image");
    return { blob, width, height, format };
  } finally {
    URL.revokeObjectURL(sourceUrl);
  }
}
