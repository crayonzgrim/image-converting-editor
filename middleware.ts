import createMiddleware from "next-intl/middleware";
import { locales, defaultLocale } from "@/lib/i18n/config";

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix: "as-needed",
  localeDetection: true, // 브라우저 언어 자동 감지
});

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
