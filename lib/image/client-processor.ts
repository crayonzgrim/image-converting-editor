import {
  type FilterSettings,
  type ClientOutputFormat,
  type ProcessingResult,
  isHeicFormat,
  getMimeTypeFromFormat,
} from "@/types/image";

// Dynamic import for heic2any (client-side only)
let heic2any: ((options: {
  blob: Blob;
  toType?: string;
  quality?: number;
}) => Promise<Blob | Blob[]>) | null = null;

async function loadHeic2Any() {
  if (typeof window !== "undefined" && !heic2any) {
    const heicModule = await import("heic2any");
    heic2any = heicModule.default;
  }
  return heic2any;
}

export async function processImage(
  file: File,
  outputFormat: ClientOutputFormat,
  filterSettings: FilterSettings,
  quality: number
): Promise<ProcessingResult> {
  try {
    // Convert HEIC/HEIF to JPEG first if needed
    let processableBlob: Blob = file;
    const fileExt = file.name.split(".").pop()?.toLowerCase() || "";

    if (isHeicFormat(fileExt)) {
      const converter = await loadHeic2Any();
      if (!converter) {
        return {
          success: false,
          error: "HEIC conversion not available",
        };
      }

      const result = await converter({
        blob: file,
        toType: "image/jpeg",
        quality: 0.9,
      });

      processableBlob = Array.isArray(result) ? result[0] : result;
    }

    // Create image from blob
    const imageUrl = URL.createObjectURL(processableBlob);
    const img = await loadImage(imageUrl);
    URL.revokeObjectURL(imageUrl);

    // Calculate canvas dimensions based on rotation
    const isRotated90or270 = filterSettings.rotate === 90 || filterSettings.rotate === 270;
    const canvasWidth = isRotated90or270 ? img.height : img.width;
    const canvasHeight = isRotated90or270 ? img.width : img.height;

    // Create canvas and apply filters
    const canvas = document.createElement("canvas");
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return {
        success: false,
        error: "Failed to get canvas context",
      };
    }

    // Apply CSS filters (excluding rotation and flip which are handled separately)
    const filters = buildFilterString(filterSettings);
    ctx.filter = filters;

    // Apply transformations (rotation and flip)
    ctx.save();
    ctx.translate(canvasWidth / 2, canvasHeight / 2);

    // Apply rotation
    if (filterSettings.rotate !== 0) {
      ctx.rotate((filterSettings.rotate * Math.PI) / 180);
    }

    // Apply flip
    const scaleX = filterSettings.flipHorizontal ? -1 : 1;
    const scaleY = filterSettings.flipVertical ? -1 : 1;
    ctx.scale(scaleX, scaleY);

    // Draw image centered
    ctx.drawImage(img, -img.width / 2, -img.height / 2);
    ctx.restore();

    // Convert to output format
    const mimeType = getMimeTypeFromFormat(outputFormat);
    const outputQuality = quality / 100;

    // Use toBlob for better memory handling
    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, mimeType, outputQuality);
    });

    if (!blob) {
      return {
        success: false,
        error: "Failed to create output image",
      };
    }

    const url = URL.createObjectURL(blob);

    return {
      success: true,
      blob,
      url,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

export async function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = src;
  });
}

export function buildFilterString(settings: FilterSettings): string {
  const filters: string[] = [];

  if (settings.grayscale) {
    filters.push("grayscale(100%)");
  }

  if (settings.blur > 0) {
    // Convert 0-100 to 0-20px blur
    const blurPx = (settings.blur / 100) * 20;
    filters.push(`blur(${blurPx}px)`);
  }

  if (settings.brightness !== 0) {
    // Convert -100 to 100 → 0 to 2 (1 is normal)
    const brightnessValue = 1 + settings.brightness / 100;
    filters.push(`brightness(${brightnessValue})`);
  }

  if (settings.contrast !== 0) {
    // Convert -100 to 100 → 0 to 2 (1 is normal)
    const contrastValue = 1 + settings.contrast / 100;
    filters.push(`contrast(${contrastValue})`);
  }

  if (settings.saturation !== 0) {
    // Convert -100 to 100 → 0 to 2 (1 is normal)
    const saturationValue = 1 + settings.saturation / 100;
    filters.push(`saturate(${saturationValue})`);
  }

  if (settings.sepia > 0) {
    // Convert 0-100 to 0%-100%
    filters.push(`sepia(${settings.sepia}%)`);
  }

  return filters.length > 0 ? filters.join(" ") : "none";
}

export function generatePreviewUrl(originalUrl: string): string {
  // For preview, we just need to return the original URL
  // The actual filtering is done via CSS on the image element
  return originalUrl;
}

export async function downloadImage(
  blob: Blob,
  filename: string
): Promise<void> {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function getOutputFilename(
  originalName: string,
  outputFormat: ClientOutputFormat
): string {
  const baseName = originalName.replace(/\.[^/.]+$/, "");
  return `${baseName}.${outputFormat}`;
}

export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}
