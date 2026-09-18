"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Services — Natural-Flow Stack Edition
 *
 * Theme: Taupe (#EAE0C8) section on the site's parchment/soft-black system.
 * Typography: Aboreto (index numerals, headings) & Work Sans (body/labels),
 * both loaded once in layout.tsx via next/font and exposed as CSS variables
 * (`--font-aboreto`, `--font-work-sans`) — this file just references them.
 * The intro heading/paragraph intentionally match AboutHero's type scale
 * (viewport-based clamp sizing, same tracking/leading) so the two sections
 * read as one consistent system.
 *
 * ================================ DESKTOP ================================
 * (md and up) — classic sticky-scroll: a pinned image column crossfades
 * between the four service images as the list scrolls past it.
 *
 * - Which image is "active" is driven by an IntersectionObserver watching a
 *   thin band across the vertical center of the viewport (not a timer, and
 *   not only hover) — so it advances correctly on scroll, trackpad,
 *   scrollbar drag, or hover.
 * - The sticky visual is centered using `sticky top-0` on a
 *   `h-screen flex items-center` wrapper — NOT a CSS transform, since a
 *   transform on a stuck element is unconstrained by the sticky containing
 *   block and can push it out of the section entirely.
 * - Each list item is tall (`min-h-[85vh]`) with a trailing spacer after
 *   the last one, so every service gets a full, roughly equal scroll
 *   window as the "active" one.
 *
 * ================================= MOBILE =================================
 * (below md) — a tilted card deck, but in NORMAL scroll flow.
 *
 * - Cards are NOT `position: sticky` and there is no permanent negative
 *   margin between them — nothing pins the screen and nothing physically
 *   overlaps another card's text at rest. Cards sit in normal flow with
 *   real spacing (mt-14/mt-16) so every title and description stays fully
 *   readable.
 * - The "receding" look (scale down, dim, tilt, rise slightly) is applied
 *   purely as a CSS transform driven by each card's OWN position in the
 *   viewport: a rAF loop reads `getBoundingClientRect().top` for every
 *   card and maps how far its top has crossed a trigger line near the top
 *   of the screen to a 0→1 progress value, then writes the transform
 *   directly. Because this only reads scroll position (never intercepts
 *   or pins it) and the transform never affects layout, scrolling stays
 *   completely native and no card ever covers another's text.
 * - Each card's image still does a one-time clip-path wipe reveal the
 *   first time it scrolls into view, alternating direction card to card.
 * - The tap-to-jump dot rail scrolls straight to a card and tracks
 *   whichever card currently sits closest to the top of the viewport.
 *
 * No animation library is used — every transform here is plain CSS driven
 * by scroll-computed values written to the DOM directly for smoothness.
 */

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

type Service = {
  title: string;
  description: string;
  image: string;
};

const SERVICES: Service[] = [
  {
    title: "Architectural Designing",
    description:
      "Concept through construction documentation - massing, materiality, and structural logic resolved as one continuous decision, not a handoff between disciplines.",
    image: "/servicearchitecture.png",
  },
  {
    title: "Interiors",
    description:
      "Spatial planning, joinery, lighting, and finish selection carried through with the same hand that shaped the architecture, so the inside never reads as an afterthought.",
    image: "/serviceinterior.png",
  },
  {
    title: "Liaisoning & Legal Compliance",
    description:
      "Approvals, sanctions, and statutory clearances managed directly with municipal and regulatory bodies, so the project's paperwork moves as deliberately as its design.",
    image: "/serviceliaison.jpg",
  },
  {
    title: "Project Management & Consultancy",
    description:
      "On-site execution, vendor coordination, and budget stewardship held to a single standard of accountability, from groundbreaking to the final key handover.",
    image: "/servicemanagement.avif",
  },
];

// ---------------------------------------------------------------------------
// Theme + small helpers
// ---------------------------------------------------------------------------

const INK = "#1A1A1A";
const PAPER = "#F2E8D4";
const TAUPE = "#CCBEB5"; //"#EAE0C8";

// How far (in px, from the top of the viewport) a card's top has to cross
// before it starts receding under the next one.
const MOBILE_TRIGGER_PX_FROM_TOP = 140;
// How much scroll distance (in px) the recede transition happens over,
// per card. Larger = slower / more gradual shuffle.
const MOBILE_RECEDE_DISTANCE_PX = 420;

function cn(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

// ---------------------------------------------------------------------------
// Desktop: sticky image column
// ---------------------------------------------------------------------------

function DesktopVisual({ activeIndex }: { activeIndex: number }) {
  return (
    // Added min-w-0 to ensure the overflowing flex child doesn't stretch the CSS grid column
    <div className="relative min-w-0 order-2">
      {/* Sticky box is exactly 100vh and pins flush at top:0 */}
      <div className="sticky top-0 flex h-screen items-center">
        {/*
            Using calculated widths to make the image stretch from the left boundary
            of its standard grid cell all the way to the right end of the viewport.
            - md gap is 4rem (2rem half-gap) -> 50vw - 2rem
            - lg gap is 6rem (3rem half-gap) -> 50vw - 3rem
            shrink-0 guarantees the flexbox doesn't compress it back to the column width.
        */}
        <div
          className="relative w-full shrink-0 overflow-hidden md:w-[calc(50vw-2rem)] lg:w-[calc(50vw-3rem)]"
          style={{
            aspectRatio: "4 / 5",
            border: `1px solid ${INK}0D`,
            backgroundColor: `${INK}0A`,
          }}
        >
          {SERVICES.map((service, index) => (
            <div
              key={service.title}
              className="absolute inset-0 transition-all duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{
                opacity: activeIndex === index ? 1 : 0,
                transform: activeIndex === index ? "scale(1)" : "scale(1.06)",
              }}
            >
              <img
                src={service.image}
                alt={`${service.title} service`}
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Desktop: scrolling text list
// ---------------------------------------------------------------------------

function DesktopServiceList({
  activeIndex,
  onHover,
  itemRefCallback,
}: {
  activeIndex: number;
  onHover: (index: number) => void;
  itemRefCallback: (el: HTMLElement | null, index: number) => void;
}) {
  return (
    <div className="order-1 flex flex-col">
      {SERVICES.map((service, index) => {
        const isActive = activeIndex === index;
        return (
          <article
            key={service.title}
            ref={(el) => itemRefCallback(el, index)}
            data-index={index}
            onMouseEnter={() => onHover(index)}
            className="flex min-h-[85vh] flex-col justify-center border-t first:border-t-0"
            style={{ borderColor: `${INK}1A` }}
          >
            <span
              className="font-aboreto text-xs transition-opacity duration-500 sm:text-sm"
              style={{ color: INK, opacity: isActive ? 0.9 : 0.35 }}
            >
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3
              className="font-aboreto mt-4 text-2xl transition-opacity duration-500 sm:text-3xl lg:text-4xl xl:text-5xl"
              style={{ color: INK, opacity: isActive ? 1 : 0.55 }}
            >
              {service.title}
            </h3>
            <p
              className="font-worksans mt-5 max-w-lg text-base leading-relaxed transition-opacity duration-500 sm:text-lg lg:text-xl"
              style={{ color: `${INK}CC`, opacity: isActive ? 1 : 0.45 }}
            >
              {service.description}
            </p>
          </article>
        );
      })}
      {/* Trailing spacer — enough room for the last service to sit centered
          and be genuinely seen before the section ends. */}
      <div aria-hidden="true" className="h-[50vh]" />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Mobile: one card in normal document flow (no pinning, no overlap)
// ---------------------------------------------------------------------------

function MobileServiceCard({
  service,
  index,
  revealed,
  cardRefCallback,
}: {
  service: Service;
  index: number;
  revealed: boolean;
  cardRefCallback: (el: HTMLDivElement | null, index: number) => void;
}) {
  const isLeft = index % 2 === 0;
  const clipHidden = isLeft ? "inset(0 100% 0 0)" : "inset(0 0 0 100%)";

  return (
    <div
      ref={(el) => cardRefCallback(el, index)}
      data-reveal-index={index}
      className={cn(
        "relative will-change-transform",
        index !== 0 && "mt-14 sm:mt-16"
      )}
      style={{
        // No physical overlap at rest — cards sit in normal flow with a
        // real gap so text is always fully readable. The "deck" look
        // comes entirely from the scroll-driven transform below (tilt,
        // scale, translateY), which is visual only and doesn't affect
        // layout or cover neighboring cards' content.
        transformOrigin: "center top",
        boxShadow: "0 24px 60px -24px rgba(26,26,26,0.35)",
      }}
    >
      <div
        className="relative overflow-hidden"
        style={{
          aspectRatio: "4 / 5",
          border: `1px solid ${INK}14`,
          backgroundColor: TAUPE,
        }}
      >
        <img
          src={service.image}
          alt={`${service.title} service`}
          className="absolute inset-0 h-full w-full object-cover"
          style={{
            clipPath: revealed ? "inset(0 0 0 0)" : clipHidden,
            transform: revealed ? "scale(1)" : "scale(1.12)",
            transition:
              "clip-path 1000ms cubic-bezier(0.76,0,0.24,1), transform 1300ms cubic-bezier(0.16,1,0.3,1)",
          }}
        />
        <span
          className="font-worksans absolute left-3 top-3 px-2.5 py-1 text-[9px] uppercase tracking-[0.2em] sm:text-[10px]"
          style={{ color: PAPER, backgroundColor: `${INK}B3` }}
        >
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      <div
        className="px-1 pb-2 pt-6 transition-all duration-700 ease-out"
        style={{
          backgroundColor: TAUPE,
          opacity: revealed ? 1 : 0,
          transform: revealed ? "translateY(0)" : "translateY(16px)",
        }}
      >
        <h3 className="font-aboreto text-2xl sm:text-3xl" style={{ color: INK }}>
          {service.title}
        </h3>
        <p
          className="font-worksans mt-3 text-sm leading-relaxed sm:text-base"
          style={{ color: `${INK}CC` }}
        >
          {service.description}
        </p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Mobile: tap-to-jump dot rail
// ---------------------------------------------------------------------------

function MobileJumpDots({
  activeIndex,
  visible,
  onJump,
}: {
  activeIndex: number;
  visible: boolean;
  onJump: (index: number) => void;
}) {
  return (
    <div
      className={cn(
        "fixed right-4 top-1/2 z-40 flex -translate-y-1/2 flex-col items-center gap-4 transition-opacity duration-500",
        visible ? "opacity-100" : "pointer-events-none opacity-0"
      )}
    >
      {SERVICES.map((service, index) => (
        <button
          key={service.title}
          type="button"
          aria-label={`Jump to ${service.title}`}
          onClick={() => onJump(index)}
          className="flex items-center justify-center p-1.5"
        >
          <span
            className="block rounded-full transition-all duration-400"
            style={{
              width: activeIndex === index ? 8 : 5,
              height: activeIndex === index ? 8 : 5,
              backgroundColor: INK,
              opacity: activeIndex === index ? 0.9 : 0.3,
            }}
          />
        </button>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main section
// ---------------------------------------------------------------------------

export default function Services() {
  // ===== Desktop: active service driven by center-band intersection =====
  const [activeService, setActiveService] = useState(0);
  const desktopItemRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const idx = Number((entry.target as HTMLElement).dataset.index);
          if (!Number.isNaN(idx)) setActiveService(idx);
        });
      },
      // A thin band through the vertical center of the viewport - the
      // service currently crossing it becomes active.
      { threshold: 0, rootMargin: "-45% 0px -45% 0px" }
    );

    desktopItemRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // ===== Mobile: natural-flow tilted card deck =====
  const stackCardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mobileOuterRef = useRef<HTMLDivElement | null>(null);
  const mobileActiveRef = useRef(0);

  const [mobileActive, setMobileActive] = useState(0);
  const [dotsVisible, setDotsVisible] = useState(false);
  const [imageRevealed, setImageRevealed] = useState<boolean[]>(() =>
    SERVICES.map(() => false)
  );

  // One-time clip-path image reveal per card, first time it scrolls into view.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const idx = Number((entry.target as HTMLElement).dataset.revealIndex);
          setImageRevealed((prev) => {
            if (prev[idx]) return prev;
            const next = [...prev];
            next[idx] = true;
            return next;
          });
        });
      },
      { threshold: 0.25 }
    );
    stackCardRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Show the jump-dots only while the mobile stack is actually on screen.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => setDotsVisible(e.isIntersecting)),
      { threshold: 0.05 }
    );
    if (mobileOuterRef.current) observer.observe(mobileOuterRef.current);
    return () => observer.disconnect();
  }, []);

  // Per-frame: each card's OWN scroll position (not pinning) drives how
  // "receded" it looks — scale/dim/tilt/rise — as its top crosses a
  // trigger line near the top of the viewport. Because this only ever
  // READS scroll position (never intercepts it), the page scrolls
  // completely naturally; nothing freezes and nothing overlaps at rest.
  useEffect(() => {
    let rafId: number;

    const tick = () => {
      let current = 0;

      stackCardRefs.current.forEach((card, i) => {
        if (!card) return;

        const rect = card.getBoundingClientRect();
        const progress = clamp(
          (MOBILE_TRIGGER_PX_FROM_TOP - rect.top) / MOBILE_RECEDE_DISTANCE_PX,
          0,
          1
        );

        const tiltBase = i % 2 === 0 ? -1.2 : 1.2;
        card.style.transform = `translateY(${-progress * 14}px) scale(${
          1 - progress * 0.06
        }) rotate(${tiltBase * (1 + progress * 0.6)}deg)`;
        card.style.opacity = String(1 - progress * 0.35);
        card.style.filter = `brightness(${1 - progress * 0.15})`;

        // "Current" card = the last one whose top has crossed the upper
        // half of the viewport - i.e. the one sitting at the front of the deck.
        if (rect.top < window.innerHeight * 0.5) {
          current = i;
        }
      });

      if (current !== mobileActiveRef.current) {
        mobileActiveRef.current = current;
        setMobileActive(current);
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  // One-time fade-up for the intro block on scroll into view.
  const introRef = useRef<HTMLDivElement | null>(null);
  const [introRevealed, setIntroRevealed] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIntroRevealed(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.2 }
    );
    if (introRef.current) observer.observe(introRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="services"
      // Added overflow-x-clip to prevent horizontal scrolling when the viewport 
      // width calculation slightly exceeds client bounds (like under a scrollbar) 
      // without breaking `position: sticky` logic (unlike overflow-hidden).
      className="relative w-full overflow-x-clip"
      style={{ backgroundColor: TAUPE }}
    >
      <style>{`
        .font-aboreto { font-family: var(--font-aboreto), serif; }
        .font-worksans { font-family: var(--font-work-sans), sans-serif; }
      `}</style>

      {/* Increased top padding (`pt-28`) only for smaller screens; original `md:py-28` is preserved for medium and up */}
      <div className="mx-auto max-w-7xl px-6 pt-28 pb-20 md:px-12 md:py-28 lg:px-16">
        {/* ===== Intro — left/right split, type scale matched to AboutHero ===== */}
        <div
          ref={introRef}
          className={cn(
            "flex flex-col gap-10 transition-all duration-700 ease-out lg:flex-row lg:items-start lg:justify-between lg:gap-16",
            introRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          )}
        >
          <h2
            className="font-aboreto font-bold text-[13vw] leading-[0.95] tracking-tight sm:text-6xl lg:text-[5.5vw] lg:leading-[0.95] xl:text-7xl"
            style={{ color: INK }}
          >
            <span className="block">One studio</span>
            <span className="block">Every layer</span>
          </h2>
          <p
            className="font-worksans max-w-sm text-base leading-relaxed lg:text-lg"
            style={{ color: `${INK}CC` }}
          >
            Architecture is a sequence of decisions. We stay close to each one,
            from the first line to the last key.
          </p>
        </div>

        {/* ===== Separator Line ===== */}
        <div
          aria-hidden="true"
          className={cn(
            "h-px w-full mt-12 md:mt-16 origin-left transition-all delay-200 duration-1000 ease-out",
            introRevealed ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0"
          )}
          style={{ backgroundColor: `${INK}1A` }}
        />

        {/* ===== DESKTOP: sticky visual + scrolling list (md and up) ===== */}
        <div className="mt-16 hidden md:grid md:grid-cols-2 md:gap-16 lg:gap-24">
          <DesktopVisual activeIndex={activeService} />
          <DesktopServiceList
            activeIndex={activeService}
            onHover={setActiveService}
            itemRefCallback={(el, index) => {
              desktopItemRefs.current[index] = el;
            }}
          />
        </div>

        {/* ===== MOBILE: natural-flow tilted card deck (below md) ===== */}
        <div ref={mobileOuterRef} className="relative mt-14 md:hidden">
          {SERVICES.map((service, index) => (
            <MobileServiceCard
              key={service.title}
              service={service}
              index={index}
              revealed={imageRevealed[index]}
              cardRefCallback={(el, i) => {
                stackCardRefs.current[i] = el;
              }}
            />
          ))}

          <MobileJumpDots
            activeIndex={mobileActive}
            visible={dotsVisible}
            onJump={(index) =>
              stackCardRefs.current[index]?.scrollIntoView({
                behavior: "smooth",
                block: "center",
              })
            }
          />
        </div>
      </div>
    </section>
  );
}