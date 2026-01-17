"use client";

import { cn } from "@/lib/utils";
import { AdBanner } from "@/components/ads/AdBanner";
import { KakaoAdFit } from "@/components/ads/KakaoAdFit";

interface ThreeColumnLayoutProps {
  children: React.ReactNode;
  leftSidebar?: React.ReactNode;
  rightSidebar?: React.ReactNode;
  showSidebars?: boolean;
  className?: string;
}

export function ThreeColumnLayout({
  children,
  leftSidebar,
  rightSidebar,
  showSidebars = true,
  className,
}: ThreeColumnLayoutProps) {
  return (
    <div className={cn("flex min-h-screen w-full justify-center", className)}>
      {/* Left Sidebar - Google AdSense */}
      {showSidebars && (
        <aside className="hidden lg:block lg:w-[335px] lg:shrink-0">
          <div className="sticky top-0 h-screen overflow-y-auto p-4">
            {leftSidebar || <AdBanner format="vertical" />}
          </div>
        </aside>
      )}

      {/* Main Content */}
      <main className="w-full max-w-[780px] flex-1">
        {children}
      </main>

      {/* Right Sidebar - Kakao AdFit */}
      {showSidebars && (
        <aside className="hidden lg:block lg:w-[335px] lg:shrink-0">
          <div className="sticky top-0 h-screen overflow-y-auto p-4 flex justify-center">
            {rightSidebar || (
              <KakaoAdFit
                unit="DAN-rZeLPIHqRCQOjPa3"
                width={250}
                height={250}
              />
            )}
          </div>
        </aside>
      )}
    </div>
  );
}
