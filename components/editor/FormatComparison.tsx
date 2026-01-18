"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileType, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface FormatComparisonProps {
  className?: string;
}

export function FormatComparison({ className }: FormatComparisonProps) {
  const t = useTranslations("formatComparison");

  const formats = [
    {
      name: "JPEG",
      compression: t("lossy"),
      transparency: false,
      animation: false,
      quality: t("good"),
      fileSize: t("small"),
      bestFor: t("jpegBestFor"),
    },
    {
      name: "PNG",
      compression: t("lossless"),
      transparency: true,
      animation: false,
      quality: t("excellent"),
      fileSize: t("large"),
      bestFor: t("pngBestFor"),
    },
    {
      name: "WebP",
      compression: t("both"),
      transparency: true,
      animation: true,
      quality: t("excellent"),
      fileSize: t("verySmall"),
      bestFor: t("webpBestFor"),
    },
    {
      name: "AVIF",
      compression: t("lossy"),
      transparency: true,
      animation: true,
      quality: t("excellent"),
      fileSize: t("smallest"),
      bestFor: t("avifBestFor"),
    },
    {
      name: "GIF",
      compression: t("lossless"),
      transparency: true,
      animation: true,
      quality: t("limited"),
      fileSize: t("medium"),
      bestFor: t("gifBestFor"),
    },
    {
      name: "BMP",
      compression: t("none"),
      transparency: false,
      animation: false,
      quality: t("excellent"),
      fileSize: t("veryLarge"),
      bestFor: t("bmpBestFor"),
    },
  ];

  return (
    <Card className={cn(className)}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <FileType className="h-5 w-5" />
          {t("title")}
        </CardTitle>
        <p className="text-sm text-muted-foreground">{t("description")}</p>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="py-2 text-left font-medium">{t("format")}</th>
                <th className="py-2 text-left font-medium">{t("compression")}</th>
                <th className="py-2 text-center font-medium">{t("transparency")}</th>
                <th className="py-2 text-center font-medium">{t("animation")}</th>
                <th className="py-2 text-left font-medium">{t("quality")}</th>
                <th className="py-2 text-left font-medium">{t("fileSize")}</th>
                <th className="py-2 text-left font-medium">{t("bestFor")}</th>
              </tr>
            </thead>
            <tbody>
              {formats.map((format) => (
                <tr key={format.name} className="border-b last:border-0">
                  <td className="py-2 font-medium">{format.name}</td>
                  <td className="py-2 text-muted-foreground">{format.compression}</td>
                  <td className="py-2 text-center">
                    {format.transparency ? (
                      <Check className="mx-auto h-4 w-4 text-green-600" />
                    ) : (
                      <X className="mx-auto h-4 w-4 text-red-500" />
                    )}
                  </td>
                  <td className="py-2 text-center">
                    {format.animation ? (
                      <Check className="mx-auto h-4 w-4 text-green-600" />
                    ) : (
                      <X className="mx-auto h-4 w-4 text-red-500" />
                    )}
                  </td>
                  <td className="py-2 text-muted-foreground">{format.quality}</td>
                  <td className="py-2 text-muted-foreground">{format.fileSize}</td>
                  <td className="py-2 text-muted-foreground">{format.bestFor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
