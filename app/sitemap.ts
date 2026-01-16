import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n/config";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://image-converter.example.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  // Generate sitemap entries for each locale
  const localeEntries = locales.map((locale) => ({
    url: `${siteUrl}/${locale}`,
    lastModified,
    changeFrequency: "weekly" as const,
    priority: 1.0,
    alternates: {
      languages: {
        ko: `${siteUrl}/ko`,
        en: `${siteUrl}/en`,
      },
    },
  }));

  // Root URL redirect
  const rootEntry = {
    url: siteUrl,
    lastModified,
    changeFrequency: "weekly" as const,
    priority: 1.0,
  };

  return [rootEntry, ...localeEntries];
}
