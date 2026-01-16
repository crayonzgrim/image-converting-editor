"use client";

import { cn } from "@/lib/utils";

interface ThreeColumnLayoutProps {
  children: React.ReactNode;
  leftSidebar?: React.ReactNode;
  rightSidebar?: React.ReactNode;
  className?: string;
}

export function ThreeColumnLayout({
  children,
  leftSidebar,
  rightSidebar,
  className,
}: ThreeColumnLayoutProps) {
  return (
    <div className={cn("flex min-h-screen w-full justify-center", className)}>
      {/* Left Sidebar - Hidden on mobile */}
      <aside className="hidden lg:block lg:w-[335px] lg:shrink-0">
        <div className="sticky top-0 h-screen overflow-y-auto p-4">
          {leftSidebar || <AdPlaceholder position="left" />}
        </div>
      </aside>

      {/* Main Content */}
      <main className="w-full max-w-[780px] flex-1">
        {children}
      </main>

      {/* Right Sidebar - Hidden on mobile */}
      <aside className="hidden lg:block lg:w-[335px] lg:shrink-0">
        <div className="sticky top-0 h-screen overflow-y-auto p-4">
          {rightSidebar || <AdPlaceholder position="right" />}
        </div>
      </aside>
    </div>
  );
}

interface AdPlaceholderProps {
  position: "left" | "right";
}

function AdPlaceholder({ position }: AdPlaceholderProps) {
  return (
    <div className="flex h-full items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/20 bg-muted/30">
      <span className="text-sm text-muted-foreground">
        {position === "left" ? "Left Ad Area" : "Right Ad Area"}
      </span>
    </div>
  );
}
