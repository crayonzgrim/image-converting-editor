"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { Shield, ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
  const t = useTranslations("privacy");

  const sections = [
    { title: t("section1Title"), content: t("section1Content") },
    { title: t("section2Title"), content: t("section2Content") },
    { title: t("section3Title"), content: t("section3Content") },
    { title: t("section4Title"), content: t("section4Content") },
    { title: t("section5Title"), content: t("section5Content") },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("backToHome")}
          </Link>
        </div>

        {/* Title */}
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
            <Shield className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">{t("title")}</h1>
            <p className="text-sm text-muted-foreground">{t("lastUpdated")}</p>
          </div>
        </div>

        {/* Intro */}
        <p className="mb-8 text-lg text-muted-foreground">{t("intro")}</p>

        {/* Safety Highlight Box */}
        <div className="mb-8 rounded-lg border-2 border-green-200 bg-green-50 p-6 dark:border-green-800 dark:bg-green-950">
          <div className="flex items-start gap-4">
            <Shield className="h-8 w-8 text-green-600 dark:text-green-400 shrink-0" />
            <div>
              <h2 className="text-xl font-semibold text-green-800 dark:text-green-200">
                {t("section5Title")}
              </h2>
              <p className="mt-2 text-green-700 dark:text-green-300">
                {t("section5Content")}
              </p>
            </div>
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-8">
          {sections.slice(0, 4).map((section, index) => (
            <section key={index}>
              <h2 className="mb-3 text-xl font-semibold">{section.title}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {section.content}
              </p>
            </section>
          ))}
        </div>

        {/* Contact */}
        <div className="mt-12 rounded-lg border bg-muted/30 p-6">
          <p className="text-muted-foreground">{t("contact")}</p>
        </div>

        {/* Back Link */}
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("backToHome")}
          </Link>
        </div>
      </div>
    </div>
  );
}
