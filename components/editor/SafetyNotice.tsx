"use client";

import { useTranslations } from "next-intl";
import { Shield, RefreshCw, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface SafetyNoticeProps {
  className?: string;
}

export function SafetyNotice({ className }: SafetyNoticeProps) {
  const t = useTranslations("safety");

  return (
    <div
      className={cn(
        "rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-950",
        className
      )}
    >
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
          <Shield className="h-4 w-4 shrink-0" />
          <p className="text-sm">{t("description")}</p>
        </div>
        <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
          <RefreshCw className="h-4 w-4 shrink-0" />
          <p className="text-sm">{t("noStorageDesc")}</p>
        </div>
        <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
          <Lock className="h-4 w-4 shrink-0" />
          <p className="text-sm">{t("browserOnlyDesc")}</p>
        </div>
      </div>
    </div>
  );
}
