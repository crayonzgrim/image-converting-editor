"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Download, Loader2, Check, AlertCircle } from "lucide-react";
import { useEditorStore } from "@/lib/store/editor-store";
import {
  processImage,
  downloadImage,
  getOutputFilename,
  formatBytes,
} from "@/lib/image/client-processor";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { ClientOutputFormat } from "@/types/image";

interface DownloadButtonProps {
  className?: string;
}

export function DownloadButton({ className }: DownloadButtonProps) {
  const t = useTranslations("download");
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadStatus, setDownloadStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [processedSize, setProcessedSize] = useState<number | null>(null);

  const currentImage = useEditorStore((state) => state.getCurrentImage());

  const handleDownload = useCallback(async () => {
    if (!currentImage) return;

    setIsDownloading(true);
    setDownloadStatus("idle");

    try {
      // Use current image's individual settings
      const { outputFormat, filterSettings, quality } = currentImage;

      // Process the image
      const result = await processImage(
        currentImage.file,
        outputFormat as ClientOutputFormat,
        filterSettings,
        quality
      );

      if (!result.success || !result.blob) {
        throw new Error(result.error || "Processing failed");
      }

      // Get output filename
      const filename = getOutputFilename(
        currentImage.name,
        outputFormat as ClientOutputFormat
      );

      // Trigger download
      await downloadImage(result.blob, filename);

      setProcessedSize(result.blob.size);
      setDownloadStatus("success");

      // Reset status after 3 seconds
      setTimeout(() => {
        setDownloadStatus("idle");
      }, 3000);
    } catch (error) {
      console.error("Download failed:", error);
      setDownloadStatus("error");

      // Reset status after 3 seconds
      setTimeout(() => {
        setDownloadStatus("idle");
      }, 3000);
    } finally {
      setIsDownloading(false);
    }
  }, [currentImage]);

  if (!currentImage) {
    return null;
  }

  const outputFilename = getOutputFilename(
    currentImage.name,
    currentImage.outputFormat as ClientOutputFormat
  );

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Download className="h-4 w-4" />
          {t("title")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">{t("filename")}</span>
            <span className="truncate max-w-[150px] sm:max-w-[250px] md:max-w-[400px] font-medium">
              {outputFilename}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">{t("fileSize")}</span>
            <span className="font-medium">
              {processedSize
                ? formatBytes(processedSize)
                : `~${formatBytes(currentImage.size)}`}
            </span>
          </div>
        </div>

        <Button
          onClick={handleDownload}
          disabled={isDownloading}
          className={cn(
            "w-full",
            downloadStatus === "success" && "bg-green-600 hover:bg-green-700",
            downloadStatus === "error" && "bg-destructive hover:bg-destructive/90"
          )}
        >
          {isDownloading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t("preparing")}
            </>
          ) : downloadStatus === "success" ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              {t("success")}
            </>
          ) : downloadStatus === "error" ? (
            <>
              <AlertCircle className="mr-2 h-4 w-4" />
              {t("error")}
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              {t("button")}
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
