"use client";

import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEditorStore } from "@/lib/store/editor-store";

interface ImageCarouselProps {
  className?: string;
}

export function ImageCarousel({ className }: ImageCarouselProps) {
  const images = useEditorStore((state) => state.images);
  const currentIndex = useEditorStore((state) => state.currentIndex);
  const setCurrentIndex = useEditorStore((state) => state.setCurrentIndex);
  const removeImage = useEditorStore((state) => state.removeImage);

  if (images.length === 0) {
    return null;
  }

  return (
    <div className={cn("flex items-center gap-2 overflow-x-auto py-2", className)}>
      {images.map((image, index) => (
        <div
          key={image.id}
          className={cn(
            "relative shrink-0 cursor-pointer overflow-hidden rounded-md border-2 transition-all",
            index === currentIndex
              ? "border-primary ring-2 ring-primary/20"
              : "border-transparent hover:border-muted-foreground/50"
          )}
          onClick={() => setCurrentIndex(index)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image.originalUrl}
            alt={image.name}
            className="h-16 w-16 object-cover"
          />
          {image.isProcessing && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          )}
          {image.error && (
            <div className="absolute inset-0 flex items-center justify-center bg-destructive/80">
              <X className="h-4 w-4 text-destructive-foreground" />
            </div>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              removeImage(image.id);
            }}
            className="absolute right-0.5 top-0.5 rounded-full bg-background/80 p-0.5 opacity-0 transition-opacity hover:bg-destructive hover:text-destructive-foreground group-hover:opacity-100 [div:hover>&]:opacity-100"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      ))}
    </div>
  );
}
