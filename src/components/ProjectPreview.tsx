"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";

interface ProjectPreviewProps {
  src: string;
  title: string;
  imageUrl?: string;
}

export function ProjectPreview({ src, title, imageUrl }: ProjectPreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [blocked, setBlocked] = useState(false);

  useEffect(() => {
    // Detect if the iframe is blank (blocked by X-Frame-Options / CSP)
    // We wait 3 s then check if the iframe contentDocument is still accessible
    // If the site is same-origin it loads fine; if blocked the document is blank.
    const timer = setTimeout(() => {
      try {
        const iframe = iframeRef.current;
        if (!iframe) return;
        // cross-origin frames throw on contentDocument access — that means it DID load
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const _ = iframe.contentDocument;
        // If we can read contentDocument and it's empty/blank, it was blocked
        if (!iframe.contentDocument?.body?.innerHTML) {
          setBlocked(true);
        }
      } catch {
        // Cross-origin but loaded — iframe is working fine, do nothing
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [src]);

  return (
    <div className="relative w-full aspect-video rounded overflow-hidden border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5">
      {/* Always render the iframe — it works for sites that allow embedding */}
      <iframe
        ref={iframeRef}
        src={src}
        title={title}
        className="w-full h-full"
        loading="lazy"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
      />

      {/* Fallback overlay — shown only if iframe is blocked */}
      {blocked && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/80 backdrop-blur-sm">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-cover opacity-40"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-orange-500/5" />
          )}
          <div className="relative z-10 flex flex-col items-center gap-2 text-center px-4">
            <span className="text-3xl font-bold text-orange-400 uppercase select-none">
              {title.charAt(0)}
            </span>
            <p className="text-xs text-white/60 max-w-[180px] leading-relaxed">
              This site doesn&apos;t allow embedding.
            </p>
            <a
              href={src}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="mt-1 inline-flex items-center gap-1.5 rounded-full border border-orange-500/60 px-3 py-1 text-xs text-orange-400 hover:bg-orange-500/20 transition"
            >
              Open site ↗
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
