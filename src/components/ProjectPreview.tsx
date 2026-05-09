"use client";

import { useState, useEffect } from "react";
import { cloudinaryFetch, extractRawUrl } from "@/lib/cloudinary";

interface ProjectPreviewProps {
  src: string;
  title: string;
  imageUrl?: string;
}

export function ProjectPreview({ src, title, imageUrl }: ProjectPreviewProps) {
  const [isBlocked, setIsBlocked] = useState<boolean | null>(null);

  useEffect(() => {
    async function checkIframe() {
      try {
        const res = await fetch(`/api/check-iframe?url=${encodeURIComponent(src)}`);
        const data = await res.json();
        setIsBlocked(!data.embeddable);
      } catch {
        setIsBlocked(true);
      }
    }
    checkIframe();
  }, [src]);

  return (
    <div className="relative w-full aspect-video rounded overflow-hidden border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 pointer-events-auto">
      {/* If it is explicitly NOT blocked, render the interactive iframe */}
      {isBlocked === false && (
        <iframe
          src={src}
          title={title}
          className="w-full h-full"
          loading="lazy"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        />
      )}

      {/* Fallback overlay — shown if iframe is blocked, or while loading */}
      {(isBlocked === true || isBlocked === null) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/80 backdrop-blur-sm z-10">
          {imageUrl ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={cloudinaryFetch(extractRawUrl(imageUrl), { width: 1600 })}
              alt={title}
              className="absolute inset-0 object-cover w-full h-full opacity-40"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-orange-500/5" />
          )}
          <div className="relative z-20 flex flex-col items-center gap-2 text-center px-4">
            <span className="text-3xl font-bold text-orange-400 uppercase select-none">
              {title.charAt(0)}
            </span>
            <p className="text-xs text-white/60 max-w-[180px] leading-relaxed">
              {isBlocked === null ? "Checking connection..." : "This site doesn't allow embedding."}
            </p>
            {isBlocked === true && (
              <a
                href={src}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="mt-1 inline-flex items-center gap-1.5 rounded-full border border-orange-500/60 px-3 py-1 text-xs text-orange-400 hover:bg-orange-500/20 transition"
              >
                Open site ↗
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

