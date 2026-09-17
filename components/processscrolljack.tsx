"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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
/* Shared hooks                                                       */
/* ------------------------------------------------------------------ */

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

  const applyProgress = useCallback((scrollY: number) => {
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
  }, [panels]);

  useLenis((lenis) => {
    if (!isNearViewport) return;
    applyProgress(lenis.scroll);
  });

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
  }, [isNearViewport, applyProgress]);

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
/* Mobile — Full-Bleed 3D Continuous Wheel                            */
/* ------------------------------------------------------------------ */

function MobileWheelScroll({ panels }: { panels: Panel[] }) {
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rafId = useRef<number | null>(null);

  const updateWheel = useCallback(() => {
    const windowH = window.innerHeight;
    const windowCenter = windowH / 2;
    const maxScroll = windowH * 1.0; 

    cardRefs.current.forEach((card) => {
      if (!card) return;
      const rect = card.getBoundingClientRect();
      const cardCenter = rect.top + rect.height / 2;
      
      const dist = (cardCenter - windowCenter) / maxScroll;
      const clamped = Math.max(-1.5, Math.min(1.5, dist));
      const absClamped = Math.abs(clamped);

      // --- Edge-to-Edge Cylinder Math ---
      // Fixed stretching: Reduced rotateX slightly and pulled the CSS camera back via perspective
      const rotateX = clamped * -45; 
      const translateZ = absClamped * -180; 
      const scale = 1 - (absClamped * 0.08); 
      
      // DELAYED FADE & BLUR: 
      // Holds perfect clarity for the first 15% of the scroll before fading.
      const opacity = 1 - Math.max(0, absClamped - 0.15) * 0.9; 
      const blur = Math.max(0, absClamped - 0.15) * 6;

      // Apply the physics
      card.style.transform = `translateZ(${translateZ}px) rotateX(${rotateX}deg) scale(${scale})`;
      card.style.opacity = Math.max(0, opacity).toString();
      card.style.filter = `blur(${blur}px)`;
    });
  }, []);

  useLenis(() => updateWheel());

  useEffect(() => {
    function onScroll() {
      if (rafId.current !== null) return;
      rafId.current = requestAnimationFrame(() => {
        updateWheel();
        rafId.current = null;
      });
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    updateWheel(); // Initial trigger

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId.current !== null) cancelAnimationFrame(rafId.current);
    };
  }, [updateWheel]);

  return (
    <div className="relative w-full bg-[#0A0A0A]">
      
      {/* Sticky Header - Locks firmly to the top of the viewport */}
      <div className="sticky top-0 z-50 border-b border-[#F5F3EE]/10 bg-[#0A0A0A]/85 px-6 py-5 backdrop-blur-xl">
        <h2 className="font-aboreto text-xl leading-[1.15] text-[#F5F3EE]">
          We handle all the complexity
        </h2>
      </div>

      {/* 
        The Wheel Container 
        - Perspective pulled back to 1200px to stop the cards from stretching/distorting
      */}
      <div 
        className="py-[20vh] space-y-[10vh]" 
        style={{ perspective: "1200px" }}
      >
        {panels.map((p, i) => (
          <div
            key={p.label}
            ref={(el) => { cardRefs.current[i] = el; }}
            className="relative w-full h-[85svh] bg-[#050505] will-change-transform transform-gpu origin-center shadow-[0_30px_60px_rgba(0,0,0,0.8)]"
          >
            {/* Full Bleed Image Layer */}
            <div className="absolute inset-0 h-full w-full overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.imageSrc}
                alt={p.title}
                loading={i === 0 ? "eager" : "lazy"}
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
            
            {/* Taller Text Protection Gradient - stretches to 85% to ensure safety for text */}
            <div className="absolute inset-x-0 bottom-0 h-[85%] bg-gradient-to-t from-[#050505] via-[#050505]/65 to-transparent pointer-events-none" />

            {/* Text Layer - Adjusted sizing and padding to prevent overflow */}
            <div className="absolute bottom-8 left-6 right-6 flex flex-col gap-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#F5F3EE]/60">
                {p.eyebrow} — {p.label}
              </span>
              <h3 className="whitespace-pre-line font-aboreto text-3xl leading-[1.1] text-[#F5F3EE]">
                {p.title}
              </h3>
              <p className="font-light text-sm leading-relaxed text-[#F5F3EE]/80 mt-1 max-w-[95%]">
                {p.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Entry point                                                        */
/* ------------------------------------------------------------------ */

export default function ProcessScrollJack({ panels = DEFAULT_PANELS }: ProcessScrollJackProps) {
  const reducedMotion = usePrefersReducedMotion();

  if (reducedMotion) return <StaticFallback panels={panels} />;

  return (
    <>
      <div className="hidden md:block">
        <DesktopScrollJack panels={panels} />
      </div>
      <div className="md:hidden">
        <MobileWheelScroll panels={panels} />
      </div>
    </>
  );
}