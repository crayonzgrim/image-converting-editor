"use client";

import { useTranslations } from "next-intl";
import { useEditorStore } from "@/lib/store/editor-store";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Sliders,
  RotateCcw,
  Sun,
  Contrast,
  Droplets,
  Palette,
  Image as ImageIcon,
  RotateCw,
  FlipHorizontal,
  FlipVertical,
} from "lucide-react";

interface FilterPanelProps {
  className?: string;
}

export function FilterPanel({ className }: FilterPanelProps) {
  const t = useTranslations("filter");
  const currentImage = useEditorStore((state) => state.getCurrentImage());
  const setCurrentFilterSettings = useEditorStore(
    (state) => state.setCurrentFilterSettings
  );
  const resetCurrentFilters = useEditorStore(
    (state) => state.resetCurrentFilters
  );

  if (!currentImage) return null;

  const { filterSettings } = currentImage;

  const handleRotate = () => {
    const newRotate = (filterSettings.rotate + 90) % 360;
    setCurrentFilterSettings({ rotate: newRotate });
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <Sliders className="h-4 w-4" />
            {t("title")}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={resetCurrentFilters}>
            <RotateCcw className="mr-2 h-4 w-4" />
            {t("reset")}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Transform Section */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">{t("transform")}</Label>
          <div className="flex flex-wrap gap-2">
            {/* Rotate Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleRotate}
              className="flex items-center gap-2"
            >
              <RotateCw className="h-4 w-4" />
              {t("rotate")} ({filterSettings.rotate}°)
            </Button>

            {/* Flip Horizontal */}
            <Button
              variant={filterSettings.flipHorizontal ? "default" : "outline"}
              size="sm"
              onClick={() =>
                setCurrentFilterSettings({
                  flipHorizontal: !filterSettings.flipHorizontal,
                })
              }
              className="flex items-center gap-2"
            >
              <FlipHorizontal className="h-4 w-4" />
              {t("flipH")}
            </Button>

            {/* Flip Vertical */}
            <Button
              variant={filterSettings.flipVertical ? "default" : "outline"}
              size="sm"
              onClick={() =>
                setCurrentFilterSettings({
                  flipVertical: !filterSettings.flipVertical,
                })
              }
              className="flex items-center gap-2"
            >
              <FlipVertical className="h-4 w-4" />
              {t("flipV")}
            </Button>
          </div>
        </div>

        <div className="border-t pt-4" />

        {/* Color Filters Section */}
        <div className="grid gap-6 sm:grid-cols-2">
          {/* Grayscale */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="flex items-center gap-2">
                <Droplets className="h-4 w-4" />
                {t("grayscale")}
              </Label>
              <p className="text-xs text-muted-foreground">
                {t("grayscaleDesc")}
              </p>
            </div>
            <Switch
              checked={filterSettings.grayscale}
              onCheckedChange={(checked) =>
                setCurrentFilterSettings({ grayscale: checked })
              }
            />
          </div>

          {/* Sepia */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                <ImageIcon className="h-4 w-4" />
                {t("sepia")}
              </Label>
              <span className="text-sm text-muted-foreground">
                {filterSettings.sepia}
              </span>
            </div>
            <Slider
              value={[filterSettings.sepia]}
              onValueChange={([value]) =>
                setCurrentFilterSettings({ sepia: value })
              }
              min={0}
              max={100}
              step={1}
            />
            <p className="text-xs text-muted-foreground">{t("sepiaDesc")}</p>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {/* Brightness */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                <Sun className="h-4 w-4" />
                {t("brightness")}
              </Label>
              <span className="text-sm text-muted-foreground">
                {filterSettings.brightness > 0 ? "+" : ""}
                {filterSettings.brightness}
              </span>
            </div>
            <Slider
              value={[filterSettings.brightness]}
              onValueChange={([value]) =>
                setCurrentFilterSettings({ brightness: value })
              }
              min={-100}
              max={100}
              step={1}
            />
            <p className="text-xs text-muted-foreground">
              {t("brightnessDesc")}
            </p>
          </div>

          {/* Contrast */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                <Contrast className="h-4 w-4" />
                {t("contrast")}
              </Label>
              <span className="text-sm text-muted-foreground">
                {filterSettings.contrast > 0 ? "+" : ""}
                {filterSettings.contrast}
              </span>
            </div>
            <Slider
              value={[filterSettings.contrast]}
              onValueChange={([value]) =>
                setCurrentFilterSettings({ contrast: value })
              }
              min={-100}
              max={100}
              step={1}
            />
            <p className="text-xs text-muted-foreground">{t("contrastDesc")}</p>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {/* Saturation */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                {t("saturation")}
              </Label>
              <span className="text-sm text-muted-foreground">
                {filterSettings.saturation > 0 ? "+" : ""}
                {filterSettings.saturation}
              </span>
            </div>
            <Slider
              value={[filterSettings.saturation]}
              onValueChange={([value]) =>
                setCurrentFilterSettings({ saturation: value })
              }
              min={-100}
              max={100}
              step={1}
            />
            <p className="text-xs text-muted-foreground">
              {t("saturationDesc")}
            </p>
          </div>

          {/* Blur */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                <Droplets className="h-4 w-4" />
                {t("blur")}
              </Label>
              <span className="text-sm text-muted-foreground">
                {filterSettings.blur}
              </span>
            </div>
            <Slider
              value={[filterSettings.blur]}
              onValueChange={([value]) =>
                setCurrentFilterSettings({ blur: value })
              }
              min={0}
              max={100}
              step={1}
            />
            <p className="text-xs text-muted-foreground">{t("blurDesc")}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
