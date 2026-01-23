"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

interface AdBannerProps {
  slot: string;
  format?: "horizontal" | "rectangle" | "auto";
  className?: string;
}

/**
 * Componente de anuncio Google AdSense
 * Mostra placeholder em desenvolvimento, anuncio real em producao
 */
export function AdBanner({ slot, format = "auto", className = "" }: AdBannerProps) {
  const adRef = useRef<HTMLDivElement>(null);
  const isAdLoaded = useRef(false);
  const [adFailed, setAdFailed] = useState(false);

  useEffect(() => {
    if (isAdLoaded.current) return;

    const timer = setTimeout(() => {
      try {
        if (adRef.current && window.adsbygoogle) {
          window.adsbygoogle.push({});
          isAdLoaded.current = true;
        }
      } catch (error) {
        console.error("AdSense error:", error);
        setAdFailed(true);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  if (adFailed) return null;

  // Placeholder em desenvolvimento
  if (process.env.NODE_ENV === "development") {
    const style =
      format === "horizontal"
        ? { width: "100%", height: "50px" }
        : format === "rectangle"
        ? { width: "300px", height: "250px" }
        : { width: "100%", height: "100px" };

    return (
      <div
        className={`bg-muted border-2 border-dashed border-border rounded-lg flex items-center justify-center text-muted-foreground text-sm ${className}`}
        style={style}
      >
        Anuncio ({slot})
      </div>
    );
  }

  const adStyle =
    format === "horizontal"
      ? { display: "block", width: "100%", height: "50px" }
      : format === "rectangle"
      ? { display: "block", width: "300px", height: "250px" }
      : { display: "block" };

  return (
    <div ref={adRef} className={className}>
      <ins
        className="adsbygoogle"
        style={adStyle}
        data-ad-client="ca-pub-9170994599683217"
        data-ad-slot={slot}
        data-ad-format={format === "auto" ? "auto" : undefined}
        data-full-width-responsive={format === "auto" ? "true" : undefined}
      />
    </div>
  );
}
