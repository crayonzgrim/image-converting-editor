import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { locales, type Locale } from "@/lib/i18n/config";
import { JsonLd } from "@/components/seo";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://image-converter.example.com";

const seoData = {
  ko: {
    title: "이미지 변환기 - 무료 온라인 이미지 포맷 변환 및 편집 도구",
    description: "JPEG, PNG, WebP, AVIF, HEIC 등 다양한 이미지 포맷을 무료로 변환하세요. 흑백, 블러, 밝기, 대비 필터를 적용하고 Before/After로 비교할 수 있습니다. 100MB까지 지원, 개인정보 보호 - 모든 처리는 브라우저에서 이루어집니다.",
    keywords: ["이미지 변환", "이미지 편집", "포맷 변환", "JPEG 변환", "PNG 변환", "WebP 변환", "HEIC 변환", "온라인 이미지 편집기", "무료 이미지 변환"],
  },
  en: {
    title: "Image Converter - Free Online Image Format Conversion & Editing Tool",
    description: "Convert images between JPEG, PNG, WebP, AVIF, HEIC and more formats for free. Apply grayscale, blur, brightness, contrast filters and compare with Before/After view. Supports up to 100MB, privacy-first - all processing happens in your browser.",
    keywords: ["image converter", "image editor", "format conversion", "JPEG converter", "PNG converter", "WebP converter", "HEIC converter", "online image editor", "free image converter"],
  },
};

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  const locale = params.locale as Locale;
  const seo = seoData[locale] || seoData.en;
  const alternateLocale = locale === "ko" ? "en" : "ko";

  return {
    title: {
      default: seo.title,
      template: `%s | ${locale === "ko" ? "이미지 변환기" : "Image Converter"}`,
    },
    description: seo.description,
    keywords: seo.keywords,
    authors: [{ name: "Image Converter Team" }],
    creator: "Image Converter",
    publisher: "Image Converter",
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: `${siteUrl}/${locale}`,
      languages: {
        "ko": `${siteUrl}/ko`,
        "en": `${siteUrl}/en`,
        "x-default": `${siteUrl}/en`,
      },
    },
    openGraph: {
      type: "website",
      locale: locale === "ko" ? "ko_KR" : "en_US",
      alternateLocale: alternateLocale === "ko" ? "ko_KR" : "en_US",
      url: `${siteUrl}/${locale}`,
      siteName: locale === "ko" ? "이미지 변환기" : "Image Converter",
      title: seo.title,
      description: seo.description,
      // Images are auto-generated from opengraph-image.tsx
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
      // Images are auto-generated from twitter-image.tsx
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    verification: {
      // Add your verification codes here
      // google: "your-google-verification-code",
      // yandex: "your-yandex-verification-code",
    },
  };
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} className="light">
      <head>
        <JsonLd />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
