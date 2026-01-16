"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import {
  ReactCompareSlider,
  ReactCompareSliderImage,
  ReactCompareSliderHandle,
} from "react-compare-slider";
import { useEditorStore } from "@/lib/store/editor-store";
import { buildFilterString } from "@/lib/image/client-processor";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, Loader2 } from "lucide-react";

interface ImagePreviewProps {
  className?: string;
}

export function ImagePreview({ className }: ImagePreviewProps) {
  const t = useTranslations("preview");
  const [viewMode, setViewMode] = useState<"compare" | "before" | "after">(
    "compare"
  );
  const currentImage = useEditorStore((state) => state.getCurrentImage());
  const isProcessing = useEditorStore((state) => state.isProcessing);

  if (!currentImage) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center" style={{ aspectRatio: "4/3" }}>
          <div className="text-center text-muted-foreground">
            <Eye className="mx-auto mb-2 h-12 w-12 opacity-50" />
            <p>{t("noImage")}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const filterString = buildFilterString(currentImage.filterSettings);

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <Eye className="h-4 w-4" />
            {t("title")}
          </CardTitle>
          <Tabs
            value={viewMode}
            onValueChange={(v) => setViewMode(v as typeof viewMode)}
          >
            <TabsList className="h-8">
              <TabsTrigger value="compare" className="text-xs">
                {t("compare")}
              </TabsTrigger>
              <TabsTrigger value="before" className="text-xs">
                {t("before")}
              </TabsTrigger>
              <TabsTrigger value="after" className="text-xs">
                {t("after")}
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative overflow-hidden rounded-lg bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIGZpbGw9IiNmMGYwZjAiLz48cmVjdCB4PSIxMCIgeT0iMTAiIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgZmlsbD0iI2YwZjBmMCIvPjxyZWN0IHg9IjEwIiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIGZpbGw9IiNlMGUwZTAiLz48cmVjdCB5PSIxMCIgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjZTBlMGUwIi8+PC9zdmc+')]">
          {isProcessing && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/80">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">{t("processing")}</span>
            </div>
          )}

          {viewMode === "compare" ? (
            <CompareView
              originalUrl={currentImage.originalUrl}
              filterString={filterString}
            />
          ) : viewMode === "before" ? (
            <SingleView url={currentImage.originalUrl} label={t("before")} />
          ) : (
            <SingleView
              url={currentImage.originalUrl}
              filterString={filterString}
              label={t("after")}
            />
          )}
        </div>

        {viewMode === "compare" && (
          <p className="mt-2 text-center text-xs text-muted-foreground">
            {t("dragToCompare")}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

interface CompareViewProps {
  originalUrl: string;
  filterString: string;
}

function CompareView({ originalUrl, filterString }: CompareViewProps) {
  const [aspectRatio, setAspectRatio] = useState<number>(4 / 3);

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setAspectRatio(img.naturalWidth / img.naturalHeight);
    };
    img.src = originalUrl;
  }, [originalUrl]);

  return (
    <div className="relative w-full" style={{ aspectRatio }}>
      <ReactCompareSlider
        itemOne={
          <ReactCompareSliderImage
            src={originalUrl}
            alt="Original"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        }
        itemTwo={
          <ReactCompareSliderImage
            src={originalUrl}
            alt="Processed"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: filterString,
            }}
          />
        }
        handle={
          <ReactCompareSliderHandle
            buttonStyle={{
              backdropFilter: "blur(4px)",
              background: "rgba(255, 255, 255, 0.8)",
              border: "2px solid #666",
              color: "#333",
            }}
            linesStyle={{ opacity: 0.5 }}
          />
        }
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}

interface SingleViewProps {
  url: string;
  filterString?: string;
  label: string;
}

function SingleView({ url, filterString, label }: SingleViewProps) {
  const [aspectRatio, setAspectRatio] = useState<number>(4 / 3);

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setAspectRatio(img.naturalWidth / img.naturalHeight);
    };
    img.src = url;
  }, [url]);

  return (
    <div className="relative w-full" style={{ aspectRatio }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={url}
        alt={label}
        className="h-full w-full object-cover"
        style={{ filter: filterString || "none" }}
      />
      <div className="absolute bottom-2 left-2 rounded bg-background/80 px-2 py-1 text-xs">
        {label}
      </div>
    </div>
  );
}
