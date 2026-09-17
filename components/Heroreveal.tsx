"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useLenis } from "lenis/react";

type HeroRevealProps = {
  bwSrc: string;
  colorSrc: string;
  textTop: string;
  textBottom: string;
  contactHref?: string;
  ctaLabel?: string;
  scrollLengthVh?: number;
  postRevealHoldVh?: number;
};

export default function HeroReveal({
  bwSrc,
  colorSrc,
  textTop,
  textBottom,
  contactHref = "/contact",
  ctaLabel = "Consult Us",
  scrollLengthVh = 2.5,
  postRevealHoldVh = 1,
}: HeroRevealProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const revealLayerRef = useRef<HTMLDivElement>(null);

  const metrics = useRef({ viewportH: 0, maxRadiusPx: 0, trackTop: 0 });
  const physics = useRef({
    targetRadius: 0,
    currentRadius: 0,
  });

  useEffect(() => {
    function updateMeasurements() {
      if (!trackRef.current) return;
      const viewportW = window.innerWidth;
      const viewportH = window.innerHeight;

      metrics.current = {
        viewportH,
        maxRadiusPx: Math.sqrt((viewportW / 2) ** 2 + viewportH ** 2),
        trackTop: window.scrollY + trackRef.current.getBoundingClientRect().top,
      };
    }

    updateMeasurements();
    window.addEventListener("resize", updateMeasurements, { passive: true });

    return () => {
      window.removeEventListener("resize", updateMeasurements);
    };
  }, []);

  useLenis((lenis) => {
    if (metrics.current.maxRadiusPx === 0) return;

    const { viewportH, maxRadiusPx, trackTop } = metrics.current;
    const scrolled = lenis.scroll - trackTop;
    const revealScrollVh = Math.max(scrollLengthVh - 1, 0);
    const revealScrollPx = revealScrollVh * viewportH;

    let progress = revealScrollPx > 0 ? scrolled / revealScrollPx : 0;
    progress = Math.min(Math.max(progress, 0), 1);

    physics.current.targetRadius = progress * maxRadiusPx;
  });

  useEffect(() => {
    let rafId: number;

    function render() {
      const diff = physics.current.targetRadius - physics.current.currentRadius;

      if (Math.abs(diff) > 0.5) {
        physics.current.currentRadius += diff * 0.15;

        const radiusPx = Number(physics.current.currentRadius.toFixed(1));
        const clipPathVal = `circle(${radiusPx}px at 50% 100%)`;

        if (revealLayerRef.current) {
          const style = revealLayerRef.current.style as CSSStyleDeclaration & { webkitClipPath?: string };
          style.clipPath = clipPathVal;
          style.webkitClipPath = clipPathVal;
        }
      }

      rafId = requestAnimationFrame(render);
    }

    rafId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(rafId);
  }, []);

  const textClasses =
    "text-center font-aboreto text-5xl tracking-wide drop-shadow-lg sm:text-8xl md:text-8xl px-6 transform-gpu";

  const ctaClasses =
    "mt-8 inline-block rounded-sm border border-white px-8 py-3 text-sm uppercase tracking-[2px] text-white " +
    "transition-colors duration-300 transform-gpu touch-manipulation " +
    "active:bg-white active:text-black " +
    "[@media(hover:hover)]:hover:bg-white [@media(hover:hover)]:hover:text-black";

  const totalTrackVh = scrollLengthVh + postRevealHoldVh + 1;

  return (
    <div
      ref={trackRef}
      className="relative"
      style={{ height: `${totalTrackVh * 100}vh` }}
    >
      <div className="sticky top-0 h-[100svh] md:h-screen w-full overflow-hidden">
        {/* BASE LAYER */}
        <div className="absolute inset-0 h-full w-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={bwSrc}
            alt=""
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover grayscale contrast-[1.05] transform-gpu backface-hidden"
          />

          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <h1 className={`${textClasses} text-black`}>{textTop}</h1>

            {ctaLabel && contactHref && (
              <span className={`${ctaClasses} invisible`} aria-hidden="true">
                {ctaLabel}
              </span>
            )}
          </div>
        </div>

        {/* REVEAL LAYER */}
        <div
          ref={revealLayerRef}
          className="absolute inset-0 h-full w-full will-change-[clip-path] transform-gpu backface-hidden"
          style={{
            clipPath: "circle(0px at 50% 100%)",
            WebkitClipPath: "circle(0px at 50% 100%)",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={colorSrc}
            alt=""
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover transform-gpu backface-hidden"
          />

          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <h1 className={textClasses}>{textBottom}</h1>

            {ctaLabel && contactHref && (
              <Link href={contactHref} className={`${ctaClasses} pointer-events-auto`}>
                {ctaLabel}
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}