"use client";

import { useTranslations } from "next-intl";
import { Shield, RefreshCw, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface SafetyNoticeProps {
  className?: string;
  compact?: boolean;
}

export function SafetyNotice({ className, compact = false }: SafetyNoticeProps) {
  const t = useTranslations("safety");

  if (compact) {
    return (
      <div
        className={cn(
          "flex items-center gap-2 rounded-full bg-green-100 px-3 py-1.5 text-sm text-green-700 dark:bg-green-900 dark:text-green-300",
          className
        )}
      >
        <Shield className="h-4 w-4" />
        <span>{t("badge")}</span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-950",
        className
      )}
    >
      <div className="flex items-center gap-2 mb-3">
        <Shield className="h-5 w-5 text-green-600 dark:text-green-400" />
        <h3 className="font-semibold text-green-800 dark:text-green-200">
          {t("title")}
        </h3>
      </div>
      <p className="text-sm text-green-700 dark:text-green-300 mb-4">
        {t("description")}
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="flex items-start gap-3">
          <RefreshCw className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-medium text-green-800 dark:text-green-200">
              {t("noStorage")}
            </p>
            <p className="text-xs text-green-600 dark:text-green-400">
              {t("noStorageDesc")}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Lock className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-medium text-green-800 dark:text-green-200">
              {t("browserOnly")}
            </p>
            <p className="text-xs text-green-600 dark:text-green-400">
              {t("browserOnlyDesc")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
