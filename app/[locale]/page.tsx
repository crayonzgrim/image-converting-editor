"use client";

import {
  FilterPanel,
  FormatAndDownload,
  ImageCarousel,
  ImagePreview,
  ImageUploader,
  UsageGuide,
  SafetyNotice,
  FAQ,
  FormatComparison,
  WhyUseThisTool,
} from "@/components/editor";
import { Header, ThreeColumnLayout } from "@/components/layout";
import { KakaoAdFit } from "@/components/ads/KakaoAdFit";
import { useEditorStore } from "@/lib/store/editor-store";
import { useTranslations } from "next-intl";
import Link from "next/link";

export default function HomePage() {
  const t = useTranslations("common");
  const tFooter = useTranslations("footer");
  const hasImages = useEditorStore((state) => state.hasImages());

  return (
    <ThreeColumnLayout>
      <div className="flex min-h-screen flex-col">
        <Header />

        <div className="flex-1 p-4 md:p-6 lg:p-8">
          <div className="mx-auto max-w-6xl space-y-6">
            {/* Kakao AdFit Banner */}
            <div className="flex justify-center">
              <KakaoAdFit
                unit="DAN-82FNvxH1iYXKO4ke"
                width={320}
                height={100}
              />
            </div>

            {/* Upload section - always visible */}
            {!hasImages ? (
              <>
                <ImageUploader className="min-h-75" />
                <UsageGuide className="mt-6" />

                {/* Additional content sections for SEO */}
                <WhyUseThisTool className="mt-6" />
                <FormatComparison className="mt-6" />
                <FAQ className="mt-6" />
              </>
            ) : (
              <>
                {/* Compact uploader when images exist */}
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">{t("appName")}</h2>
                  <ImageUploader compact />
                </div>

                {/* Carousel - thumbnails only */}
                <ImageCarousel />

                {/* Preview - full width */}
                <ImagePreview />

                {/* Filter Panel - below image */}
                <FilterPanel />

                {/* Format Selection & Download - combined */}
                <FormatAndDownload />
              </>
            )}

            {/* Safety Notice - Bottom */}
            <SafetyNotice />
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t py-4 text-center text-sm text-muted-foreground">
          <div className="flex items-center justify-center gap-4">
            <p>{tFooter("copyright")} &copy; {new Date().getFullYear()}</p>
            <span className="text-muted-foreground/50">|</span>
            <Link
              href="/privacy"
              className="hover:text-foreground transition-colors"
            >
              {tFooter("privacy")}
            </Link>
          </div>
        </footer>
      </div>
    </ThreeColumnLayout>
  );
}
