"use client";

import { useTranslations } from "next-intl";
import {
  Lightbulb,
  FileImage,
  Shield,
  Zap,
  Clock,
  CheckCircle2,
} from "lucide-react";

export function SidebarQuickTips() {
  const t = useTranslations("sidebar");

  const tips = [
    { icon: Shield, text: t("tip1") },
    { icon: Zap, text: t("tip2") },
    { icon: Clock, text: t("tip3") },
    { icon: CheckCircle2, text: t("tip4") },
  ];

  return (
    <div className="rounded-lg border bg-card p-4">
      <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
        <Lightbulb className="h-4 w-4 text-yellow-500" />
        {t("quickTips")}
      </h3>
      <ul className="space-y-2">
        {tips.map((tip, index) => (
          <li key={index} className="flex items-start gap-2 text-xs text-muted-foreground">
            <tip.icon className="mt-0.5 h-3 w-3 shrink-0 text-primary" />
            <span>{tip.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SidebarFormats() {
  const t = useTranslations("sidebar");

  const inputFormats = ["JPEG", "PNG", "WebP", "GIF", "HEIC", "AVIF", "SVG", "BMP"];
  const outputFormats = ["JPEG", "PNG", "WebP", "GIF", "AVIF", "BMP"];

  return (
    <div className="rounded-lg border bg-card p-4">
      <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
        <FileImage className="h-4 w-4 text-blue-500" />
        {t("supportedFormats")}
      </h3>

      <div className="space-y-3">
        <div>
          <p className="mb-1.5 text-xs font-medium text-muted-foreground">
            {t("input")}
          </p>
          <div className="flex flex-wrap gap-1">
            {inputFormats.map((format) => (
              <span
                key={format}
                className="rounded bg-green-500/10 px-1.5 py-0.5 text-[10px] font-medium text-green-700 dark:text-green-400"
              >
                {format}
              </span>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-1.5 text-xs font-medium text-muted-foreground">
            {t("output")}
          </p>
          <div className="flex flex-wrap gap-1">
            {outputFormats.map((format) => (
              <span
                key={format}
                className="rounded bg-blue-500/10 px-1.5 py-0.5 text-[10px] font-medium text-blue-700 dark:text-blue-400"
              >
                {format}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function SidebarFeatures() {
  const t = useTranslations("sidebar");

  const features = [
    t("feature1"),
    t("feature2"),
    t("feature3"),
    t("feature4"),
  ];

  return (
    <div className="rounded-lg border bg-card p-4">
      <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
        <CheckCircle2 className="h-4 w-4 text-green-500" />
        {t("keyFeatures")}
      </h3>
      <ul className="space-y-1.5">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="h-1 w-1 rounded-full bg-primary" />
            {feature}
          </li>
        ))}
      </ul>
    </div>
  );
}
