"use client";

import { useEffect, useRef, useState } from "react";
import { useLenis } from "lenis/react";

type Panel = {
  eyebrow: string;
  label: string;
  title: string;
  description: string;
  imageSrc: string;
  speed?: number;
};

const DEFAULT_PANELS: Panel[] = [
  { eyebrow: "01", label: "ARCHITECTURE", title: "Architectural\nDesign", description: "Custom spatial studies, structural concepting, and site-integrated luxury residential designs.", imageSrc: "/process1.jpg", speed: 0.85 },
  { eyebrow: "02", label: "INTERIORS", title: "Interior\nDesigning", description: "Curated material palettes, custom millwork, lighting orchestration, and bespoke interior finishes.", imageSrc: "/process2.jpg", speed: 0.75 },
  { eyebrow: "03", label: "LIAISONING", title: "Liaisoning &\nLegal Compliance", description: "Navigating municipal frameworks, zoning codes, and environmental approvals discreetly.", imageSrc: "/process3.jpg", speed: 0.85 },
  { eyebrow: "04", label: "CONSULTANCY", title: "Project\nManagement\nConsultancy", description: "Vetting contractors, structural advisory, site inspections, and end-to-end quality control.", imageSrc: "/process4.jpg", speed: 0.8 },
];

type ProcessScrollJackProps = { panels?: Panel[] };

/* ------------------------------------------------------------------ */
/* Shared hooks                                                        */
/* ------------------------------------------------------------------ */

// IMPORTANT: never read `window` inside a useState initializer here — that
// runs during the client's first render pass, before hydration has
// reconciled against the server HTML, and a value that disagrees with the
// server default triggers a hydration-mismatch remount. Always start with
// a fixed default and correct it in a useEffect, which only ever runs
// client-side, after hydration is already settled.
function usePrefersReducedMotion() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReducedMotion(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return reducedMotion;
}

/* ------------------------------------------------------------------ */
/* Static fallback — reduced motion, any screen size                   */
/* ------------------------------------------------------------------ */

function StaticFallback({ panels }: { panels: Panel[] }) {
  return (
    <section className="bg-[#0A0A0A] pb-12 pt-8">
      <div className="border-b border-[#F5F3EE]/10 px-8 pb-8 md:px-16 lg:px-24">
        <h2 className="font-aboreto text-2xl leading-[1.1] text-[#F5F3EE] md:text-3xl lg:text-4xl">
          We handle all <br className="hidden md:block" /> the complexity
        </h2>
      </div>
      {panels.map((p) => (
        <div key={p.label} className="flex min-h-[70vh] flex-col border-b border-[#F5F3EE]/10 last:border-0 md:flex-row">
          <div className="flex w-full flex-col justify-center gap-6 px-8 py-16 md:w-[45%] md:px-16 lg:px-24">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#F5F3EE]/50">{p.eyebrow} — {p.label}</span>
            <h3 className="whitespace-pre-line font-aboreto text-3xl leading-[1.15] text-[#F5F3EE] md:text-4xl">{p.title}</h3>
            <p className="max-w-sm font-light text-sm leading-relaxed text-[#F5F3EE]/70">{p.description}</p>
          </div>
          <div className="relative aspect-[4/3] w-full border-l border-[#F5F3EE]/10 md:aspect-auto md:w-[55%]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.imageSrc} alt={p.title} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover opacity-90 grayscale" />
          </div>
        </div>
      ))}
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Desktop — the original horizontal scroll-jack, unchanged            */
/* ------------------------------------------------------------------ */

function DesktopScrollJack({ panels }: { panels: Panel[] }) {
  const trackWrapRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [isNearViewport, setIsNearViewport] = useState(false);

  const metrics = useRef({ wrapTop: 0, wrapHeight: 0, windowH: 0, containerWidth: 0 });
  const lastShift = useRef<number | null>(null);
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    function updateMeasurements() {
      if (!trackWrapRef.current) return;
      metrics.current = {
        wrapTop: window.scrollY + trackWrapRef.current.getBoundingClientRect().top,
        wrapHeight: trackWrapRef.current.offsetHeight,
        windowH: window.innerHeight,
        containerWidth: trackWrapRef.current.clientWidth,
      };
      lastShift.current = null;
    }
    const timer = setTimeout(updateMeasurements, 50);
    window.addEventListener("resize", updateMeasurements, { passive: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", updateMeasurements);
    };
  }, [panels.length]);

  useEffect(() => {
    if (!trackWrapRef.current) return;
    const el = trackWrapRef.current;
    const io = new IntersectionObserver(
      ([entry]) => setIsNearViewport(entry.isIntersecting),
      { rootMargin: "100% 0px 100% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  function applyProgress(scrollY: number) {
    if (!trackRef.current || !trackWrapRef.current) return;

    if (metrics.current.wrapHeight === 0) {
      metrics.current = {
        wrapTop: window.scrollY + trackWrapRef.current.getBoundingClientRect().top,
        wrapHeight: trackWrapRef.current.offsetHeight,
        windowH: window.innerHeight,
        containerWidth: trackWrapRef.current.clientWidth,
      };
    }

    const { wrapTop, wrapHeight, windowH, containerWidth } = metrics.current;
    if (wrapHeight === 0 || containerWidth === 0) return;

    const scrolled = scrollY - wrapTop;
    const scrollable = wrapHeight - windowH;
    let progress = scrollable > 0 ? scrolled / scrollable : 0;
    progress = Math.min(Math.max(progress, 0), 1);

    const maxShift = containerWidth * (panels.length - 1);
    const shift = Math.round(progress * maxShift);

    if (shift === lastShift.current) return;
    lastShift.current = shift;

    trackRef.current.style.transform = `translate3d(${-shift}px, 0, 0)`;

    for (let i = 0; i < panels.length; i++) {
      const el = imageRefs.current[i];
      if (!el) continue;
      const cardNaturalX = i * containerWidth - shift;
      const speed = panels[i].speed ?? 1;
      const offset = Math.round(-cardNaturalX * (1 - speed));
      el.style.transform = `translate3d(${offset}px, 0, 0)`;
    }
  }

  // Lenis driver — no-ops if no Lenis instance is present on the page.
  useLenis((lenis) => {
    if (!isNearViewport) return;
    applyProgress(lenis.scroll);
  });

  // Native scroll driver — fallback path when Lenis isn't driving.
  useEffect(() => {
    if (!isNearViewport) return;

    function onScroll() {
      if (rafId.current !== null) return;
      rafId.current = requestAnimationFrame(() => {
        applyProgress(window.scrollY);
        rafId.current = null;
      });
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId.current !== null) cancelAnimationFrame(rafId.current);
    };
  }, [isNearViewport, panels.length]);

  return (
    <div ref={trackWrapRef} className="relative w-full bg-[#0A0A0A]" style={{ height: `${panels.length * 100}vh` }}>
      <div className="sticky top-0 flex h-screen w-full flex-col overflow-hidden bg-[#0A0A0A]" style={{ contain: "layout paint style" }}>
        <div className="z-20 shrink-0 px-16 pb-6 pt-6 lg:px-24 lg:pb-6 lg:pt-8">
          <h2 className="font-aboreto text-4xl leading-[1.1] text-[#F5F3EE] lg:text-5xl">
            We handle all <br /> the complexity
          </h2>
        </div>

        <div className="relative w-full flex-1 overflow-hidden border-t border-[#F5F3EE]/10">
          <div
            ref={trackRef}
            className="absolute left-0 top-0 flex h-full will-change-transform transform-gpu"
            style={{ width: `${panels.length * 100}%`, backfaceVisibility: "hidden" }}
          >
            {panels.map((p, i) => (
              <div key={p.label} style={{ width: `${100 / panels.length}%` }} className="relative flex h-full shrink-0 flex-row overflow-hidden">
                <div className="relative z-10 flex h-full w-[45%] flex-col justify-center px-16 lg:px-24">
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#F5F3EE]/50">{p.eyebrow} — {p.label}</span>
                  <h3 className="mt-6 whitespace-pre-line font-aboreto text-4xl leading-[1.15] text-[#F5F3EE] lg:text-5xl">{p.title}</h3>
                  <p className="mt-6 max-w-sm font-light text-sm leading-relaxed text-[#F5F3EE]/70">{p.description}</p>
                </div>

                <div className="relative h-full w-[55%] overflow-hidden bg-[#111] border-l border-[#F5F3EE]/10">
                  <div
                    ref={(el) => { imageRefs.current[i] = el; }}
                    className="absolute -inset-x-[15%] inset-y-0 will-change-transform transform-gpu"
                    style={{ backfaceVisibility: "hidden" }}
                  >
                    <div className="absolute inset-0 z-10 bg-black/20" />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.imageSrc} alt={p.title} loading={i === 0 ? "eager" : "lazy"} decoding="async" className="h-full w-full object-cover" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Mobile — sticky stacked-card reveal                                 */
/*                                                                      */
/* Each panel pins to the top of the viewport with `position: sticky`. */
/* As the next panel scrolls up and covers it, the outgoing panel is   */
/* scaled down, dimmed, and blurred slightly — a deck-of-cards depth    */
/* effect used on sites like Stripe, Linear, and Apple's product pages, */
/* instead of trying to force a horizontal, swipe-fighting interaction  */
/* onto a touch screen.                                                 */
/* ------------------------------------------------------------------ */

function MobileStackedReveal({ panels }: { panels: Panel[] }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const innerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    function onScroll() {
      if (rafId.current !== null) return;
      rafId.current = requestAnimationFrame(() => {
        rafId.current = null;
        const windowH = window.innerHeight;

        for (let i = 0; i < panels.length; i++) {
          const inner = innerRefs.current[i];
          if (!inner) continue;

          const next = cardRefs.current[i + 1];
          let progress = 0;

          if (next) {
            const nextTop = next.getBoundingClientRect().top;
            // nextTop === windowH -> next card hasn't arrived yet (progress 0)
            // nextTop === 0       -> next card fully covers this one (progress 1)
            progress = 1 - nextTop / windowH;
            progress = Math.min(Math.max(progress, 0), 1);
          }

          const scale = 1 - progress * 0.1;
          const dim = 1 - progress * 0.55;
          const blur = progress * 6;
          const translateY = progress * -24;

          inner.style.transform = `translate3d(0, ${translateY}px, 0) scale(${scale})`;
          inner.style.filter = `brightness(${dim}) blur(${blur}px)`;
        }
      });
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId.current !== null) cancelAnimationFrame(rafId.current);
    };
  }, [panels.length]);

  return (
    <div ref={wrapRef} className="relative w-full bg-[#0A0A0A]">
      {/*
        Sticky, not fixed — same reasoning as before: this page's Lenis
        wrapper transforms to scroll, which breaks `position: fixed`.
        Sticky pins correctly and, as a bonus, needs no scroll listener —
        it also sits above the cards (z-40) so they visibly rise and slide
        underneath it as the section scrolls, like a glass toolbar over
        content.
      */}
      <div className="sticky top-0 z-40 border-b border-[#F5F3EE]/10 bg-[#0A0A0A]/80 px-8 py-5 backdrop-blur-md">
        <h2 className="font-aboreto text-xl leading-[1.15] text-[#F5F3EE]">
          We handle all the complexity
        </h2>
      </div>

      {panels.map((p, i) => (
        <div
          key={p.label}
          ref={(el) => { cardRefs.current[i] = el; }}
          className="sticky top-0 h-[100svh] w-full overflow-hidden"
          style={{ zIndex: i + 1 }}
        >
          <div
            ref={(el) => { innerRefs.current[i] = el; }}
            className="relative flex h-full w-full flex-col overflow-hidden bg-[#0A0A0A] will-change-transform transform-gpu"
            style={{ backfaceVisibility: "hidden", transformOrigin: "center 30%" }}
          >
            <div className="relative flex-1">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.imageSrc}
                alt={p.title}
                loading={i === 0 ? "eager" : "lazy"}
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/20 to-black/30" />
            </div>

            <div className="relative z-10 flex flex-col gap-3 px-8 pb-12 pt-6">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#F5F3EE]/50">
                {p.eyebrow} — {p.label}
              </span>
              <h3 className="whitespace-pre-line font-aboreto text-3xl leading-[1.15] text-[#F5F3EE]">
                {p.title}
              </h3>
              <p className="max-w-sm font-light text-sm leading-relaxed text-[#F5F3EE]/70">
                {p.description}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Entry point                                                         */
/* ------------------------------------------------------------------ */

export default function ProcessScrollJack({ panels = DEFAULT_PANELS }: ProcessScrollJackProps) {
  const reducedMotion = usePrefersReducedMotion();

  if (reducedMotion) return <StaticFallback panels={panels} />;

  // Both variants are always mounted; Tailwind's `md:` classes decide which
  // one is visible. This keeps the server and client DOM identical (no
  // hydration mismatch) instead of branching render output on a client-only
  // viewport read. The hidden variant measures a zero-size, `display: none`
  // box, so its scroll math is a harmless no-op.
  return (
    <>
      <div className="hidden md:block">
        <DesktopScrollJack panels={panels} />
      </div>
      <div className="md:hidden">
        <MobileStackedReveal panels={panels} />
      </div>
    </>
  );
}