"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Zap,
  Shield,
  Globe,
  Smartphone,
  DollarSign,
  Clock,
  Lightbulb,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface WhyUseThisToolProps {
  className?: string;
}

export function WhyUseThisTool({ className }: WhyUseThisToolProps) {
  const t = useTranslations("whyUse");

  const benefits = [
    {
      icon: Shield,
      title: t("privacyTitle"),
      description: t("privacyDesc"),
    },
    {
      icon: Zap,
      title: t("speedTitle"),
      description: t("speedDesc"),
    },
    {
      icon: DollarSign,
      title: t("freeTitle"),
      description: t("freeDesc"),
    },
    {
      icon: Globe,
      title: t("noInstallTitle"),
      description: t("noInstallDesc"),
    },
    {
      icon: Smartphone,
      title: t("mobileTitle"),
      description: t("mobileDesc"),
    },
    {
      icon: Clock,
      title: t("batchTitle"),
      description: t("batchDesc"),
    },
  ];

  return (
    <Card className={cn(className)}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Lightbulb className="h-5 w-5" />
          {t("title")}
        </CardTitle>
        <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="flex gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <benefit.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-sm font-medium">{benefit.title}</h3>
                <p className="text-xs text-muted-foreground">
                  {benefit.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
