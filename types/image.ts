// Supported image formats
export type ClientInputFormat =
  | "jpeg"
  | "jpg"
  | "png"
  | "webp"
  | "gif"
  | "bmp"
  | "avif"
  | "heic"
  | "heif"
  | "svg"
  | "ico";

export type ClientOutputFormat =
  | "jpeg"
  | "jpg"
  | "png"
  | "webp"
  | "gif"
  | "bmp"
  | "avif"
  | "ico";

export type ServerInputFormat =
  | "raf"
  | "arw"
  | "cr2"
  | "cr3"
  | "nef"
  | "dng"
  | "orf"
  | "rw2"
  | "pef"
  | "srw"
  | "tiff"
  | "tif"
  | "psd";

export type ServerOutputFormat = "jpeg" | "png" | "webp" | "tiff";

export type ImageFormat =
  | ClientInputFormat
  | ClientOutputFormat
  | ServerInputFormat
  | ServerOutputFormat;

// RAW formats that need server-side processing
export const RAW_FORMATS: string[] = [
  "raf",
  "arw",
  "cr2",
  "cr3",
  "nef",
  "dng",
  "orf",
  "rw2",
  "pef",
  "srw",
];

// Formats that need special handling
export const HEIC_FORMATS: string[] = ["heic", "heif"];

// Filter types
export interface FilterSettings {
  grayscale: boolean;
  blur: number; // 0-100
  brightness: number; // -100 to 100
  contrast: number; // -100 to 100
  saturation: number; // -100 to 100
  sepia: number; // 0-100
  rotate: number; // 0, 90, 180, 270
  flipHorizontal: boolean;
  flipVertical: boolean;
}

export const DEFAULT_FILTER_SETTINGS: FilterSettings = {
  grayscale: false,
  blur: 0,
  brightness: 0,
  contrast: 0,
  saturation: 0,
  sepia: 0,
  rotate: 0,
  flipHorizontal: false,
  flipVertical: false,
};

// Image file with metadata and individual settings
export interface ImageFile {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  format: string;
  originalUrl: string;
  processedUrl: string | null;
  needsServerProcessing: boolean;
  isProcessing: boolean;
  error: string | null;
  // Individual settings per image
  outputFormat: ClientOutputFormat | ServerOutputFormat;
  filterSettings: FilterSettings;
  quality: number;
}

// Maximum number of images allowed
export const MAX_IMAGES = 10;

// Editor state
export interface EditorState {
  images: ImageFile[];
  currentIndex: number;
  outputFormat: ClientOutputFormat | ServerOutputFormat;
  filterSettings: FilterSettings;
  quality: number; // 1-100
}

// Processing result
export interface ProcessingResult {
  success: boolean;
  blob?: Blob;
  url?: string;
  error?: string;
}

// API response types
export interface ConvertApiResponse {
  success: boolean;
  data?: string; // base64 encoded image
  mimeType?: string;
  error?: string;
}

// Format info for UI
export interface FormatInfo {
  value: string;
  label: string;
  description: string;
  supportsTransparency: boolean;
  supportsAnimation: boolean;
}

export const OUTPUT_FORMATS: FormatInfo[] = [
  {
    value: "jpeg",
    label: "JPEG",
    description: "Best for photos, smaller file size",
    supportsTransparency: false,
    supportsAnimation: false,
  },
  {
    value: "png",
    label: "PNG",
    description: "Lossless, supports transparency",
    supportsTransparency: true,
    supportsAnimation: false,
  },
  {
    value: "webp",
    label: "WebP",
    description: "Modern format, good compression",
    supportsTransparency: true,
    supportsAnimation: true,
  },
  {
    value: "avif",
    label: "AVIF",
    description: "Best compression, newer browsers",
    supportsTransparency: true,
    supportsAnimation: true,
  },
  {
    value: "gif",
    label: "GIF",
    description: "Limited colors, supports animation",
    supportsTransparency: true,
    supportsAnimation: true,
  },
  {
    value: "bmp",
    label: "BMP",
    description: "Uncompressed, large file size",
    supportsTransparency: false,
    supportsAnimation: false,
  },
];

// Helper functions
export function getFormatFromMimeType(mimeType: string): string {
  const mimeMap: Record<string, string> = {
    "image/jpeg": "jpeg",
    "image/jpg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
    "image/bmp": "bmp",
    "image/avif": "avif",
    "image/heic": "heic",
    "image/heif": "heif",
    "image/svg+xml": "svg",
    "image/x-icon": "ico",
    "image/tiff": "tiff",
  };
  return mimeMap[mimeType] || "unknown";
}

export function getFormatFromExtension(filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase() || "";
  return ext;
}

export function getMimeTypeFromFormat(format: string): string {
  const formatMap: Record<string, string> = {
    jpeg: "image/jpeg",
    jpg: "image/jpeg",
    png: "image/png",
    webp: "image/webp",
    gif: "image/gif",
    bmp: "image/bmp",
    avif: "image/avif",
    heic: "image/heic",
    heif: "image/heif",
    svg: "image/svg+xml",
    ico: "image/x-icon",
    tiff: "image/tiff",
    tif: "image/tiff",
  };
  return formatMap[format] || "application/octet-stream";
}

export function isRawFormat(format: string): boolean {
  return RAW_FORMATS.includes(format.toLowerCase());
}

export function isHeicFormat(format: string): boolean {
  return HEIC_FORMATS.includes(format.toLowerCase());
}

export function needsServerProcessing(format: string): boolean {
  const ext = format.toLowerCase();
  return isRawFormat(ext) || ext === "psd" || ext === "tiff" || ext === "tif";
}

export function generateImageId(): string {
  return `img_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}
