"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

export function HeroParallax() {
  const figureRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let rafId: number;
    let tx = 0, ty = 0;
    let cx = 0, cy = 0;

    function onMouseMove(e: MouseEvent) {
      const { innerWidth: W, innerHeight: H } = window;
      tx = (e.clientX / W - 0.5) * 2; // –1 → 1
      ty = (e.clientY / H - 0.5) * 2;
    }

    function loop() {
      // Smooth lerp — 0.055 feels weighty, not instant
      cx += (tx - cx) * 0.055;
      cy += (ty - cy) * 0.055;

      if (figureRef.current) {
        figureRef.current.style.transform = `translate(${cx * 22}px, ${cy * 14}px)`;
      }
      rafId = requestAnimationFrame(loop);
    }

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    rafId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div ref={figureRef} className="relative w-full h-full">
      {/* Dark Mode Hero */}
      <div className="absolute inset-0 grayscale mix-blend-luminosity opacity-30 md:opacity-50 hidden dark:block">
        <Image
          src="/hero.jpg"
          alt="Excel Ikueze"
          fill
          priority
          className="object-cover object-center md:object-[center_top]"
        />
      </div>
      {/* Light Mode Hero */}
      <div className="absolute inset-0 grayscale mix-blend-luminosity opacity-20 md:opacity-35 block dark:hidden">
        <Image
          src="/hero2.png"
          alt="Excel Ikueze"
          fill
          priority
          className="object-cover object-center md:object-[center_top]"
        />
      </div>
    </div>
  );
}
