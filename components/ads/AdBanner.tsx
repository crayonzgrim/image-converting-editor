"use client";

import { useEffect, useRef } from "react";

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

  useEffect(() => {
    if (!adRef.current || isLoaded.current) return;

    const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
    if (!clientId) {
      console.warn("AdSense client ID is not configured");
      return;
    }

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      isLoaded.current = true;
    } catch (err) {
      console.error("AdSense error:", err);
    }
  }, []);

  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

  if (!clientId) {
    return (
      <div className="flex h-full items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/20 bg-muted/30 p-4">
        <span className="text-sm text-muted-foreground">Ad Area</span>
      </div>
    );
  }

  return (
    <ins
      ref={adRef}
      className={`adsbygoogle ${className || ""}`}
      style={{ display: "block" }}
      data-ad-client={clientId}
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive={responsive.toString()}
    />
  );
}
