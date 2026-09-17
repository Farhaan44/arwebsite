"use client";

import { useEffect, useMemo, useRef, useSyncExternalStore } from "react";

/**
 * StatCards
 *
 * A row of bordered stat cards on a flat background: a large figure at the
 * top of each card that counts up from 0 the first time the section
 * scrolls into view, then a label and short description pinned to the
 * bottom. Stacks to a single column on mobile, three columns from `sm` up.
 *
 * Each `value` can be a plain number or a number with a prefix/suffix
 * (e.g. "150+", "60M", "$2.4B") — only the numeric part animates; any
 * surrounding text stays static. Values with no numeric part (rare, but
 * just in case) render as-is with no animation.
 *
 * Respects prefers-reduced-motion — figures render at their final value
 * immediately, no count-up, when the user has that preference set.
 *
 * USAGE:
 * <StatCards
 *   stats={[
 *     { value: "150+", label: "Projects", description: "Executed across residential, commercial and marine environments." },
 *     { value: "60M", label: "Cumulative project value", description: "Across high-stake interiors where accountability and financial solidity are imperative." },
 *     { value: "19", label: "Countries worldwide", description: "International projects managed with the highest quality and commitment." },
 *   ]}
 * />
 */

type Stat = {
  value: string;
  label: string;
  description: string;
};

type StatCardsProps = {
  stats: Stat[];
  backgroundColor?: string;
  /** Count-up duration in ms. Default 1400. */
  durationMs?: number;
};

type ParsedValue = {
  prefix: string;
  number: number;
  decimals: number;
  suffix: string;
} | null;

function parseValue(value: string): ParsedValue {
  const match = value.match(/^([^0-9]*)([0-9]+(?:\.[0-9]+)?)(.*)$/);
  if (!match) return null;
  const [, prefix, numberStr, suffix] = match;
  const decimalPart = numberStr.split(".")[1];
  return {
    prefix,
    number: parseFloat(numberStr),
    decimals: decimalPart ? decimalPart.length : 0,
    suffix,
  };
}

function formatNumber(n: number, decimals: number) {
  return decimals > 0 ? n.toFixed(decimals) : Math.round(n).toString();
}

function animateCount(
  el: HTMLSpanElement,
  target: number,
  decimals: number,
  duration: number
) {
  el.textContent = formatNumber(0, decimals);
  const start = performance.now();

  function step(now: number) {
    const t = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
    el.textContent = formatNumber(eased * target, decimals);
    if (t < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

// Same useSyncExternalStore pattern as AboutHero — reads
// prefers-reduced-motion without an effect-triggered setState.
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

export default function StatCards({
  stats,
  backgroundColor = "#CCBEB5",
  durationMs = 1400,
}: StatCardsProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const numberRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const reducedMotion = useReducedMotion();

  const parsedStats = useMemo(() => stats.map((s) => parseValue(s.value)), [
    stats,
  ]);

  useEffect(() => {
    if (reducedMotion) return;
    const sectionEl = sectionRef.current;
    if (!sectionEl) return;

    let triggered = false;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting || triggered) return;
          triggered = true;
          parsedStats.forEach((parsed, i) => {
            if (!parsed) return;
            const el = numberRefs.current[i];
            if (!el) return;
            setTimeout(() => {
              animateCount(el, parsed.number, parsed.decimals, durationMs);
            }, i * 120);
          });
          observer.disconnect();
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(sectionEl);
    return () => observer.disconnect();
  }, [reducedMotion, parsedStats, durationMs]);

  return (
    <section ref={sectionRef} style={{ backgroundColor }}>
      <div className="mx-auto max-w-7xl px-6 py-16 sm:px-10 sm:py-20 lg:px-16 lg:py-24">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-6">
          {stats.map((stat, i) => {
            const parsed = parsedStats[i];
            return (
              <div
                key={stat.label}
                className="flex flex-col gap-6 rounded-lg border border-black/15 p-8 sm:p-10"
              >
                <span className="font-aboreto text-6xl leading-none tracking-tight text-black md:text-7xl">
                  {parsed ? (
                    <>
                      {parsed.prefix}
                      <span
                        ref={(el) => {
                          numberRefs.current[i] = el;
                        }}
                      >
                        {formatNumber(parsed.number, parsed.decimals)}
                      </span>
                      {parsed.suffix}
                    </>
                  ) : (
                    stat.value
                  )}
                </span>

                <div>
                  <h3 className="font-sans text-xl text-black">
                    {stat.label}
                  </h3>
                  <p className="mt-2 font-sans text-base leading-relaxed text-black/60">
                    {stat.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}