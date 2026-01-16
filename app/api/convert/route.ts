import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import { isRawFormat, type ServerOutputFormat } from "@/types/image";

// Maximum file size: 100MB
const MAX_FILE_SIZE = 100 * 1024 * 1024;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const format = (formData.get("format") as ServerOutputFormat) || "jpeg";
    const quality = parseInt(formData.get("quality") as string) || 90;

    // Validate filter settings
    const grayscale = formData.get("grayscale") === "true";
    const blur = parseInt(formData.get("blur") as string) || 0;
    const brightness = parseInt(formData.get("brightness") as string) || 0;
    const contrast = parseInt(formData.get("contrast") as string) || 0;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file provided" },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, error: "File too large (max 100MB)" },
        { status: 400 }
      );
    }

    // Get file extension
    const fileExt = file.name.split(".").pop()?.toLowerCase() || "";

    // Read file as buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let sharpInstance: sharp.Sharp;

    // Handle RAW formats - note: Sharp doesn't natively support all RAW formats
    // For full RAW support, you'd need to integrate with dcraw or similar
    if (isRawFormat(fileExt)) {
      // For now, return an error for unsupported RAW formats
      // In production, you'd use dcraw-vendored or similar
      return NextResponse.json(
        {
          success: false,
          error: `RAW format .${fileExt} requires additional server-side processing. Please convert using desktop software first, or use a supported format (JPEG, PNG, WebP, TIFF).`,
        },
        { status: 400 }
      );
    }

    // Create sharp instance
    sharpInstance = sharp(buffer);

    // Get metadata
    const metadata = await sharpInstance.metadata();

    // Apply filters
    if (grayscale) {
      sharpInstance = sharpInstance.grayscale();
    }

    if (blur > 0) {
      // Convert 0-100 to 0.3-20 sigma
      const sigma = 0.3 + (blur / 100) * 19.7;
      sharpInstance = sharpInstance.blur(sigma);
    }

    if (brightness !== 0) {
      // Convert -100 to 100 → 0.5 to 1.5 brightness multiplier
      const brightnessMultiplier = 1 + brightness / 200;
      sharpInstance = sharpInstance.modulate({
        brightness: brightnessMultiplier,
      });
    }

    if (contrast !== 0) {
      // Apply contrast using linear transformation
      // Contrast increases the difference from the middle gray
      const contrastFactor = 1 + contrast / 100;
      sharpInstance = sharpInstance.linear(contrastFactor, -(128 * (contrastFactor - 1)));
    }

    // Convert to output format
    let outputBuffer: Buffer;
    let mimeType: string;

    switch (format) {
      case "jpeg":
        outputBuffer = await sharpInstance.jpeg({ quality }).toBuffer();
        mimeType = "image/jpeg";
        break;
      case "png":
        outputBuffer = await sharpInstance.png({ quality }).toBuffer();
        mimeType = "image/png";
        break;
      case "webp":
        outputBuffer = await sharpInstance.webp({ quality }).toBuffer();
        mimeType = "image/webp";
        break;
      case "tiff":
        outputBuffer = await sharpInstance.tiff({ quality }).toBuffer();
        mimeType = "image/tiff";
        break;
      default:
        outputBuffer = await sharpInstance.jpeg({ quality }).toBuffer();
        mimeType = "image/jpeg";
    }

    // Return as base64
    const base64 = outputBuffer.toString("base64");

    return NextResponse.json({
      success: true,
      data: base64,
      mimeType,
      width: metadata.width,
      height: metadata.height,
      size: outputBuffer.length,
    });
  } catch (error) {
    console.error("Image conversion error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unknown error during conversion",
      },
      { status: 500 }
    );
  }
}

// Note: App Router handles body parsing automatically, no config needed
