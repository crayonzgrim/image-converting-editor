"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useTranslations } from "next-intl";
import { Upload, ImagePlus, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEditorStore } from "@/lib/store/editor-store";
import { MAX_IMAGES } from "@/types/image";
import { Button } from "@/components/ui/button";

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

const ACCEPTED_FORMATS = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/webp": [".webp"],
  "image/gif": [".gif"],
  "image/bmp": [".bmp"],
  "image/avif": [".avif"],
  "image/heic": [".heic"],
  "image/heif": [".heif"],
  "image/svg+xml": [".svg"],
  "image/x-icon": [".ico"],
  "image/tiff": [".tiff", ".tif"],
  // RAW formats
  "image/x-dcraw": [
    ".raf",
    ".arw",
    ".cr2",
    ".cr3",
    ".nef",
    ".dng",
    ".orf",
    ".rw2",
    ".pef",
    ".srw",
  ],
  "image/x-adobe-dng": [".dng"],
  "image/x-canon-cr2": [".cr2", ".cr3"],
  "image/x-nikon-nef": [".nef"],
  "image/x-sony-arw": [".arw"],
  "image/x-fuji-raf": [".raf"],
  "image/vnd.adobe.photoshop": [".psd"],
};

interface ImageUploaderProps {
  className?: string;
  compact?: boolean;
}

export function ImageUploader({ className, compact = false }: ImageUploaderProps) {
  const t = useTranslations("upload");
  const addImages = useEditorStore((state) => state.addImages);
  const hasImages = useEditorStore((state) => state.hasImages());
  const canAddMoreImages = useEditorStore((state) => state.canAddMoreImages());
  const remainingSlots = useEditorStore((state) => state.getRemainingSlots());

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (!canAddMoreImages) return;

      const validFiles = acceptedFiles.filter(
        (file) => file.size <= MAX_FILE_SIZE
      );

      if (validFiles.length > 0) {
        addImages(validFiles);
      }
    },
    [addImages, canAddMoreImages]
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      onDrop,
      accept: ACCEPTED_FORMATS,
      maxSize: MAX_FILE_SIZE,
      multiple: true,
      disabled: !canAddMoreImages,
    });

  if (compact && hasImages) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        {canAddMoreImages ? (
          <Button
            variant="outline"
            size="sm"
            {...getRootProps()}
            className="gap-2"
          >
            <input {...getInputProps()} />
            <ImagePlus className="h-4 w-4" />
            {t("selectFiles")} ({remainingSlots})
          </Button>
        ) : (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <AlertCircle className="h-4 w-4" />
            {t("limitReached")}
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={cn(
        "relative flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors",
        isDragActive && !isDragReject && canAddMoreImages && "border-primary bg-primary/5",
        isDragReject && "border-destructive bg-destructive/5",
        !isDragActive && canAddMoreImages && "border-muted-foreground/25 hover:border-primary/50",
        !canAddMoreImages && "cursor-not-allowed opacity-50",
        className
      )}
    >
      <input {...getInputProps()} />

      <div className="flex flex-col items-center gap-4 text-center">
        <div
          className={cn(
            "rounded-full p-4 transition-colors",
            isDragActive && !isDragReject && canAddMoreImages && "bg-primary/10",
            isDragReject && "bg-destructive/10",
            !isDragActive && "bg-muted"
          )}
        >
          <Upload
            className={cn(
              "h-8 w-8",
              isDragActive && !isDragReject && canAddMoreImages && "text-primary",
              isDragReject && "text-destructive",
              !isDragActive && "text-muted-foreground"
            )}
          />
        </div>

        <div className="space-y-2">
          <p className="text-lg font-medium">
            {!canAddMoreImages
              ? t("limitReached")
              : isDragActive
              ? t("dropzoneActive")
              : t("dropzone")}
          </p>
          <p className="text-sm text-muted-foreground">
            {t("supportedFormats")}
          </p>
          <p className="text-xs text-muted-foreground">
            {t("maxSize")} • {t("maxImages", { count: MAX_IMAGES })}
          </p>
        </div>

        {canAddMoreImages && (
          <Button variant="secondary" className="mt-2" type="button">
            {t("selectFiles")}
          </Button>
        )}
      </div>
    </div>
  );
}
