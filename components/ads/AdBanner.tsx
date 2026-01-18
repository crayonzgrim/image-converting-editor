"use client";

import { useEffect, useRef, useState } from "react";

interface AdBannerProps {
  slot?: string;
  format?: "auto" | "rectangle" | "horizontal" | "vertical";
  responsive?: boolean;
  className?: string;
}

export function AdBanner({
  slot,
  format = "auto",
  responsive = true,
  className,
}: AdBannerProps) {
  const adRef = useRef<HTMLModElement>(null);
  const isLoaded = useRef(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || !adRef.current || isLoaded.current) return;

    const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
    if (!clientId) {
      console.warn("AdSense client ID is not configured");
      return;
    }

    // Wait for container to have a valid width
    const checkAndLoadAd = () => {
      const container = adRef.current;
      if (!container) return;

      const containerWidth = container.offsetWidth;

      // Only load ad if container has width
      if (containerWidth > 0) {
        try {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          isLoaded.current = true;
        } catch (err) {
          // Silently handle the error - AdSense errors are common and not critical
          if (process.env.NODE_ENV === "development") {
            console.warn("AdSense push error (non-critical):", err);
          }
        }
      } else {
        // Retry after a short delay if container has no width
        const timeoutId = setTimeout(checkAndLoadAd, 100);
        return () => clearTimeout(timeoutId);
      }
    };

    // Small delay to ensure DOM is ready
    const initialTimeout = setTimeout(checkAndLoadAd, 50);

    return () => clearTimeout(initialTimeout);
  }, [isMounted]);

  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

  if (!clientId || !isMounted) {
    return null;
  }

  return (
    <ins
      ref={adRef}
      className={`adsbygoogle ${className || ""}`}
      style={{ display: "block", minWidth: "280px", minHeight: "50px" }}
      data-ad-client={clientId}
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive={responsive.toString()}
    />
  );
}
