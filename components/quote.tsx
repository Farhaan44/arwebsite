"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Quote — Founder's Word, Scroll-Ink Edition
 *
 * Theme: Soft Black (#1A1A1A) background / Parchment (#F2E8D4) ink,
 * the inverse of the site's primary palette.
 * Typography: Aboreto (eyebrow + attribution) & Work Sans (quote body).
 *
 * Signature element: the paragraph is pre-split into per-letter spans.
 * As the section scrolls through the viewport, a single continuous
 * "reading progress" value (0 → 1) is computed from scroll position and
 * mapped across every letter with a short overlap window, so the text
 * inks itself in, left to right, top to bottom, at the pace of the
 * reader's own scroll - not a timed animation, a scrubbed one. Letter
 * color is written directly to the DOM on scroll (no React state per
 * letter) to keep it smooth at ~280 nodes. The section is tall
 * (220vh) with a sticky inner stage so there is enough scroll distance
 * for the fill to read clearly rather than snapping in half a screen.
 *
 * Reduced motion: if the user prefers reduced motion, the letters are
 * simply rendered fully inked and the scroll-driven fill is skipped.
 */

const QUOTE =
  "An extraordinary residence is born at the intersection of creative ambition and technical rigor. We assume total command over the spatial, legal, and structural layers of every project, allowing our clients to experience seamless execution at the highest level.";

const FOUNDER_NAME = "Architect Shahbaz Ahmed";
const FOUNDER_TITLE = "";

const UNFILLED = "rgba(242, 232, 212, 0.14)";
const FILLED = "rgba(242, 232, 212, 1)";
const FONT_IMPORT_ID = "quote-section-font-import";

// How much of the total scroll progress each letter's own fade spans.
// Smaller = snappier per-letter transitions but a longer overall wave.
const LETTER_WINDOW = 0.16;

function clamp(v: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, v));
}

export default function Quote() {
  useEffect(() => {
    if (document.getElementById(FONT_IMPORT_ID)) return;
    const link = document.createElement("link");
    link.id = FONT_IMPORT_ID;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Aboreto&family=Work+Sans:wght@300;400;500&display=swap";
    document.head.appendChild(link);
  }, []);

  const sectionRef = useRef<HTMLElement | null>(null);
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const progressBarRef = useRef<HTMLDivElement | null>(null);
  const eyebrowRef = useRef<HTMLDivElement | null>(null);

  const [attributionVisible, setAttributionVisible] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Build the letter list once: word groups (kept intact for wrapping)
  // each containing indexed letters, so we can assign one continuous
  // global index per letter across the whole paragraph.
  const words = QUOTE.split(" ");
  let globalIndex = -1;
  const wordData = words.map((word) =>
    word.split("").map((ch) => {
      globalIndex += 1;
      return { ch, index: globalIndex };
    })
  );
  const totalLetters = globalIndex + 1;

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) {
      letterRefs.current.forEach((el) => {
        if (el) el.style.color = FILLED;
      });
      setAttributionVisible(true);
      return;
    }

    let rafId: number;
    let crossedAttribution = false;

    const applyProgress = () => {
      const section = sectionRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const scrollDistance = rect.height - window.innerHeight;
      const scrolled = -rect.top;
      const progress = scrollDistance > 0 ? clamp(scrolled / scrollDistance) : 0;

      // Eyebrow + progress rule ease in over the first sliver of scroll.
      const introProgress = clamp(progress / 0.06);
      if (eyebrowRef.current) {
        eyebrowRef.current.style.opacity = String(introProgress);
        eyebrowRef.current.style.transform = `translateY(${(1 - introProgress) * 10}px)`;
      }
      if (progressBarRef.current) {
        progressBarRef.current.style.transform = `scaleX(${progress})`;
      }

      // Per-letter ink fill, staggered across the paragraph.
      const usableRange = Math.max(0.0001, 1 - LETTER_WINDOW);
      letterRefs.current.forEach((el, i) => {
        if (!el) return;
        const start = (i / Math.max(1, totalLetters - 1)) * usableRange;
        const t = clamp((progress - start) / LETTER_WINDOW);
        el.style.color = t <= 0 ? UNFILLED : t >= 1 ? FILLED : mixColor(t);
      });

      if (progress > 0.9 && !crossedAttribution) {
        crossedAttribution = true;
        setAttributionVisible(true);
      } else if (progress <= 0.9 && crossedAttribution) {
        crossedAttribution = false;
        setAttributionVisible(false);
      }

      rafId = requestAnimationFrame(applyProgress);
    };

    rafId = requestAnimationFrame(applyProgress);
    return () => cancelAnimationFrame(rafId);
  }, [prefersReducedMotion, totalLetters]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-[#1A1A1A]"
      style={{ minHeight: "220vh" }}
    >
      <style>{`
        .font-aboreto { font-family: 'Aboreto', serif; }
        .font-worksans { font-family: 'Work Sans', sans-serif; }
      `}</style>

      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden px-6 md:px-12 lg:px-24">
        {/* Oversized decorative mark, set well behind the text */}
        <span
          aria-hidden="true"
          className="font-aboreto pointer-events-none absolute -top-6 left-4 md:left-16 select-none text-[10rem] md:text-[16rem] leading-none text-[#F2E8D4]/[0.05]"
        >
          &ldquo;
        </span>

        <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-start">
          {/* Eyebrow */}
          <div
            ref={eyebrowRef}
            className="mb-8 flex items-center gap-4"
            style={{ opacity: 0, transform: "translateY(10px)" }}
          >
            <span className="font-worksans text-[10px] uppercase tracking-[0.3em] text-[#F2E8D4]/50">
              From the Founder
            </span>
            <span className="h-px w-10 bg-[#F2E8D4]/30" />
          </div>

          {/* Reading-progress rule */}
          <div className="mb-10 h-px w-full max-w-[120px] bg-[#F2E8D4]/15 md:mb-14">
            <div
              ref={progressBarRef}
              className="h-px w-full origin-left bg-[#F2E8D4]/70"
              style={{ transform: "scaleX(0)" }}
            />
          </div>

          {/* Quote */}
          <blockquote className="font-worksans text-2xl font-light leading-[1.45] tracking-[-0.01em] text-[#F2E8D4] md:text-4xl lg:text-[2.75rem] lg:leading-[1.4]">
            {wordData.map((letters, wi) => (
              <span key={wi} className="mr-[0.28em] inline-block whitespace-nowrap">
                {letters.map(({ ch, index }) => (
                  <span
                    key={index}
                    ref={(el) => {
                      letterRefs.current[index] = el;
                    }}
                    style={{ color: UNFILLED, transition: "color 60ms linear" }}
                  >
                    {ch}
                  </span>
                ))}
              </span>
            ))}
          </blockquote>

          {/* Attribution */}
          <div
            className="mt-10 flex items-center gap-4 transition-all duration-700 ease-out md:mt-14"
            style={{
              opacity: attributionVisible ? 1 : 0,
              transform: attributionVisible ? "translateY(0)" : "translateY(14px)",
            }}
          >
            <span className="h-px w-10 bg-[#F2E8D4]/40" />
            <div className="flex flex-col">
              <span className="font-aboreto text-base text-[#F2E8D4] md:text-lg">
                {FOUNDER_NAME}
              </span>
              <span className="font-worksans text-[11px] uppercase tracking-[0.2em] text-[#F2E8D4]/50">
                {FOUNDER_TITLE}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Interpolates the letter opacity between the unfilled and filled ink
// states without allocating a new string on every frame for settled
// letters (handled by the t<=0 / t>=1 shortcuts above this is only hit
// mid-transition).
function mixColor(t: number) {
  const opacity = 0.14 + 0.86 * t;
  return `rgba(242, 232, 212, ${opacity})`;
}