"use client";

import { useTranslations } from "next-intl";
import { useEditorStore } from "@/lib/store/editor-store";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sliders, RotateCcw, Sun, Contrast, Droplets } from "lucide-react";

interface FilterPanelProps {
  className?: string;
}

export function FilterPanel({ className }: FilterPanelProps) {
  const t = useTranslations("filter");
  const currentImage = useEditorStore((state) => state.getCurrentImage());
  const setCurrentFilterSettings = useEditorStore((state) => state.setCurrentFilterSettings);
  const resetCurrentFilters = useEditorStore((state) => state.resetCurrentFilters);

  if (!currentImage) return null;

  const { filterSettings } = currentImage;

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
        {/* Grayscale */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="flex items-center gap-2">
              <Droplets className="h-4 w-4" />
              {t("grayscale")}
            </Label>
            <p className="text-xs text-muted-foreground">{t("grayscaleDesc")}</p>
          </div>
          <Switch
            checked={filterSettings.grayscale}
            onCheckedChange={(checked) =>
              setCurrentFilterSettings({ grayscale: checked })
            }
          />
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
            onValueChange={([value]) => setCurrentFilterSettings({ blur: value })}
            min={0}
            max={100}
            step={1}
          />
          <p className="text-xs text-muted-foreground">{t("blurDesc")}</p>
        </div>

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
            onValueChange={([value]) => setCurrentFilterSettings({ brightness: value })}
            min={-100}
            max={100}
            step={1}
          />
          <p className="text-xs text-muted-foreground">{t("brightnessDesc")}</p>
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
            onValueChange={([value]) => setCurrentFilterSettings({ contrast: value })}
            min={-100}
            max={100}
            step={1}
          />
          <p className="text-xs text-muted-foreground">{t("contrastDesc")}</p>
        </div>
      </CardContent>
    </Card>
  );
}
