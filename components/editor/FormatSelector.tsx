"use client";

import { useTranslations } from "next-intl";
import { useEditorStore } from "@/lib/store/editor-store";
import { OUTPUT_FORMATS } from "@/types/image";
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
import { FileType } from "lucide-react";

interface FormatSelectorProps {
  className?: string;
}

export function FormatSelector({ className }: FormatSelectorProps) {
  const t = useTranslations("format");
  const currentImage = useEditorStore((state) => state.getCurrentImage());
  const setCurrentOutputFormat = useEditorStore((state) => state.setCurrentOutputFormat);
  const setCurrentQuality = useEditorStore((state) => state.setCurrentQuality);

  if (!currentImage) return null;

  const { outputFormat, quality } = currentImage;

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <FileType className="h-4 w-4" />
          {t("title")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>{t("selectFormat")}</Label>
          <Select
            value={outputFormat}
            onValueChange={(value) => setCurrentOutputFormat(value as typeof outputFormat)}
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
            <Label>{t("quality")}</Label>
            <span className="text-sm text-muted-foreground">{quality}%</span>
          </div>
          <Slider
            value={[quality]}
            onValueChange={([value]) => setCurrentQuality(value)}
            min={1}
            max={100}
            step={1}
          />
          <p className="text-xs text-muted-foreground">{t("qualityHint")}</p>
        </div>
      </CardContent>
    </Card>
  );
}
