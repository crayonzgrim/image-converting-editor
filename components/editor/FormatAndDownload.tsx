"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import {
  Download,
  Loader2,
  Check,
  AlertCircle,
  FileType,
} from "lucide-react";
import { useEditorStore } from "@/lib/store/editor-store";
import { OUTPUT_FORMATS } from "@/types/image";
import {
  processImage,
  downloadImage,
  getOutputFilename,
  formatBytes,
} from "@/lib/image/client-processor";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { ClientOutputFormat } from "@/types/image";

interface FormatAndDownloadProps {
  className?: string;
}

export function FormatAndDownload({ className }: FormatAndDownloadProps) {
  const tFormat = useTranslations("format");
  const tDownload = useTranslations("download");
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadStatus, setDownloadStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [processedSize, setProcessedSize] = useState<number | null>(null);

  const currentImage = useEditorStore((state) => state.getCurrentImage());
  const setCurrentOutputFormat = useEditorStore(
    (state) => state.setCurrentOutputFormat
  );
  const setCurrentQuality = useEditorStore((state) => state.setCurrentQuality);

  const handleDownload = useCallback(async () => {
    if (!currentImage) return;

    setIsDownloading(true);
    setDownloadStatus("idle");

    try {
      const { outputFormat, filterSettings, quality } = currentImage;

      const result = await processImage(
        currentImage.file,
        outputFormat as ClientOutputFormat,
        filterSettings,
        quality
      );

      if (!result.success || !result.blob) {
        throw new Error(result.error || "Processing failed");
      }

      const filename = getOutputFilename(
        currentImage.name,
        outputFormat as ClientOutputFormat
      );

      await downloadImage(result.blob, filename);

      setProcessedSize(result.blob.size);
      setDownloadStatus("success");

      setTimeout(() => {
        setDownloadStatus("idle");
      }, 3000);
    } catch (error) {
      console.error("Download failed:", error);
      setDownloadStatus("error");

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

  const { outputFormat, quality } = currentImage;
  const outputFilename = getOutputFilename(
    currentImage.name,
    currentImage.outputFormat as ClientOutputFormat
  );

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <FileType className="h-4 w-4" />
          {tFormat("title")} & {tDownload("title")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Format Selection */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>{tFormat("selectFormat")}</Label>
            <Select
              value={outputFormat}
              onValueChange={(value) =>
                setCurrentOutputFormat(value as typeof outputFormat)
              }
            >
              <SelectTrigger className="h-12">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {OUTPUT_FORMATS.map((format) => (
                  <SelectItem key={format.value} value={format.value}>
                    <div className="flex flex-col items-start">
                      <span className="font-medium">{format.label}</span>
                      <span className="text-xs text-muted-foreground">
                        {format.description}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>{tFormat("quality")}</Label>
              <span className="text-sm text-muted-foreground">{quality}%</span>
            </div>
            <Slider
              value={[quality]}
              onValueChange={([value]) => setCurrentQuality(value)}
              min={1}
              max={100}
              step={1}
              className="mt-3"
            />
            <p className="text-xs text-muted-foreground">
              {tFormat("qualityHint")}
            </p>
          </div>
        </div>

        {/* File Info */}
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-muted/50 p-3 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">{tDownload("filename")}:</span>
            <span className="truncate max-w-[200px] font-medium">
              {outputFilename}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">{tDownload("fileSize")}:</span>
            <span className="font-medium">
              {processedSize
                ? formatBytes(processedSize)
                : `~${formatBytes(currentImage.size)}`}
            </span>
          </div>
        </div>

        {/* Download Button */}
        <Button
          onClick={handleDownload}
          disabled={isDownloading}
          size="lg"
          className={cn(
            "w-full",
            downloadStatus === "success" && "bg-green-600 hover:bg-green-700",
            downloadStatus === "error" && "bg-destructive hover:bg-destructive/90"
          )}
        >
          {isDownloading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {tDownload("preparing")}
            </>
          ) : downloadStatus === "success" ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              {tDownload("success")}
            </>
          ) : downloadStatus === "error" ? (
            <>
              <AlertCircle className="mr-2 h-4 w-4" />
              {tDownload("error")}
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              {tDownload("button")}
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
