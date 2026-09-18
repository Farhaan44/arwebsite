"use client";

import Image from "next/image";
import { useEffect, useRef, useSyncExternalStore } from "react";

/**
 * AboutHero
 *
 * Flat-color masthead section: large headline on the left, a short body
 * paragraph on the right, then a photo beneath. The photo is inset with
 * margins (not full-bleed) and sits on top of a full-bleed texture image
 * that shows through the margins. The photo itself has a real scroll
 * parallax (it travels at a different speed than the page, not just a
 * fade/scale); the texture behind it stays fixed.
 *
 * Wrap *word or phrase* in `description` with single asterisks to render
 * it in italic, matching the reference's "tangible interior solutions".
 *
 * Respects prefers-reduced-motion — the photo is static, no transform,
 * when the user has that preference set.
 *
 * USAGE:
 * <AboutHero
 *   title={"BACKING\nARCHITECTS\nSINCE 2010"}
 *   description="We are a Milan-based studio... transform sketches into *tangible interior solutions*, managing complexity..."
 *   imageSrc="/images/team.jpg"
 *   imageAlt="The studio team"
 *   textureSrc="/images/paper-texture.jpg"
 * />
 */

type AboutHeroProps = {
  /** Use \n for line breaks, rendered as separate lines. */
  title: string;
  description: string;
  imageSrc: string;
  imageAlt?: string;
  /** Full-bleed texture image sitting behind the inset photo. */
  textureSrc: string;
  /** Background color for the text block (and texture fallback). */
  backgroundColor?: string;
};

function renderEmphasis(text: string) {
  const parts = text.split(/\*(.+?)\*/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <em key={i} className="not-italic font-[inherit] italic">
        {part}
      </em>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

// --- prefers-reduced-motion, read via useSyncExternalStore ---
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeToReducedMotion(callback: () => void) {
  const mq = window.matchMedia(REDUCED_MOTION_QUERY);
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

function getReducedMotionSnapshot() {
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

function getReducedMotionServerSnapshot() {
  return false;
}

function useReducedMotion() {
  return useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot
  );
}

export default function AboutHero({
  title,
  description,
  imageSrc,
  imageAlt = "",
  textureSrc,
  backgroundColor = "#CCBEB5",
}: AboutHeroProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const reducedMotion = useReducedMotion();

  // Image is rendered taller than its container; this is how much extra
  // height it has to move through, as a fraction of the container height.
  const OVERSCAN = 0.28;

  useEffect(() => {
    if (reducedMotion) return;
    const wrap = wrapRef.current;
    const img = imgRef.current;
    if (!wrap || !img) return;

    let ticking = false;

    function update() {
      ticking = false;
      const wrapEl = wrapRef.current;
      const imgEl = imgRef.current;
      if (!wrapEl || !imgEl) return;

      const rect = wrapEl.getBoundingClientRect();
      const viewportH = window.innerHeight;

      let progress = (viewportH - rect.top) / (viewportH + rect.height);
      progress = Math.min(Math.max(progress, 0), 1);

      const extraPx = rect.height * OVERSCAN;
      const translateY = (progress - 0.5) * extraPx;

      imgEl.style.transform = `translate3d(0, ${translateY}px, 0)`;
    }

    function onScroll() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    }

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [reducedMotion]);

  const titleLines = title.split("\n");

  return (
    <section style={{ backgroundColor }}>
      {/* ===== Text block — increased top padding (`pt-28`) for smaller screens ===== */}
      <div className="mx-auto max-w-7xl px-6 pt-28 pb-6 sm:px-10 sm:pt-24 sm:pb-8 lg:px-16 lg:pt-28 lg:pb-10">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between lg:gap-16">
          <h1
            className="font-aboreto font-bold text-[13vw] leading-[0.95] tracking-tight text-black sm:text-6xl lg:text-[5.5vw] lg:leading-[0.95] xl:text-7xl"
            style={{ WebkitTextStroke: "0.5px black" }}
          >
            {titleLines.map((line, i) => (
              <span key={i} className="block">
                {line}
              </span>
            ))}
          </h1>

          <p className="max-w-sm font-sans text-base leading-relaxed text-black/80 lg:text-lg">
            {renderEmphasis(description)}
          </p>
        </div>
      </div>

      {/* ===== Textured backdrop + inset photo, stacked via CSS grid ===== */}
      <div
        className="relative grid w-full grid-cols-1 grid-rows-1 overflow-hidden"
        style={{ backgroundColor }}
      >
        <div className="relative z-0 col-start-1 row-start-1 h-full w-full">
          <Image
            src={textureSrc}
            alt=""
            fill
            sizes="100vw"
            aria-hidden="true"
            className="object-cover"
          />
        </div>

        <div
          aria-hidden="true"
          className="pointer-events-none relative z-10 col-start-1 row-start-1 h-full w-full"
          style={{
            background: `linear-gradient(to bottom, ${backgroundColor} 0%, ${backgroundColor} 6%, transparent 32%)`,
          }}
        />

        {/* ===== Inset parallax photo — margins reveal the texture around it ===== */}
        <div className="relative z-20 col-start-1 row-start-1 mx-auto w-full max-w-7xl px-6 py-10 sm:px-10 sm:py-14 lg:px-16 lg:py-20">
          <div
            ref={wrapRef}
            className="relative h-[48vh] w-full overflow-hidden rounded-2xl sm:h-[56vh] lg:h-[66vh]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={imgRef}
              src={imageSrc}
              alt={imageAlt}
              className="absolute inset-x-0 w-full object-cover will-change-transform"
              style={{
                top: `-${(OVERSCAN / 2) * 100}%`,
                height: `${(1 + OVERSCAN) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}