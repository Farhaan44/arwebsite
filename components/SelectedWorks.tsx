"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link"; // <-- Added Next.js Link

/**
 * SelectedWorks - Parallax Luxury Editorial Edition
 *
 * Theme: Premium Light (#F2E8D4) & Soft Black (#1A1A1A)
 * Typography: Aboreto (Display) & Work Sans (Sans)
 *
 * Desktop (md+): 2-column masonry with scroll-driven parallax + custom cursor.
 *   Cursor hover state is re-evaluated every animation frame via
 *   document.elementFromPoint(), not just on mousemove. Browsers generally
 *   only recompute :hover / mouseenter / mouseleave on actual pointer
 *   movement - if the page scrolls under a stationary cursor, those events
 *   never fire, so the custom cursor label and the hidden system cursor can
 *   get stuck mid-hover. Polling every frame means hover state stays
 *   correct even when the content moves and the mouse doesn't.
 *
 * Mobile (<md): alternating left/right stagger with a one-time reveal per
 *   card the first time it scrolls into view. The reveal is a clip-path
 *   wipe applied directly to the image (grows in from the edge matching
 *   the card's offset direction) rather than a solid color panel sliding
 *   away - so there's never an opaque block sitting over the image before
 *   it loads or reveals; only the container's own placeholder tone shows
 *   through until the image is fully clipped in.
 *
 * Text reveal (added): the section header and each desktop project's
 * title/description block now fade up once, the first time they scroll
 * into view - same one-time, no-retrigger pattern already used for the
 * mobile text. Nothing else (parallax, cursor, mobile image reveal,
 * layout, colors) was changed.
 */

// Added exact routing links to the WORKS array
const WORKS = [
  {
    id: "01",
    title: "Anzar Residency",
    category: "Architecture & Management",
    description:
      "An architectural statement rising twenty-one stories, featuring meticulously crafted residences with sweeping ocean vistas, where bespoke design meets uncompromising comfort.",
    imageSrc: "/work1.jpg",
    aspectClass: "aspect-[4/5]",
    speed: 0.06, // Positive moves slower (lags behind scroll) - desktop only
    link: "/project/anzarresidency",
  },
  {
    id: "02",
    title: "Blue Ocean",
    category: "Architecture & Management",
    description:
      "Thirty-nine stories of architectural ambition, a bold new horizon for the city, anchored by masterfully executed mixed-use spaces.",
    imageSrc: "/work2.jpg",
    aspectClass: "aspect-[3/4]",
    speed: -0.05, // Negative moves faster (accelerates past scroll) - desktop only
    link: "/project/blueocean",
  },
  {
    id: "03",
    title: "Numara",
    category: "Commercial Space Designing",
    description:
      "Designed using a masterful balance of luminous onyx, veined Statuario marble, and rich polished wood veneers, crafting a commercial environment of quiet opulence and architectural prestige.",
    imageSrc: "/work3.jpg",
    aspectClass: "aspect-[4/5]",
    speed: 0.08,
    link: "/project/numara",
  },
  {
    id: "04",
    title: "The Sky Suite",
    category: "Interior Designing",
    description:
      "A study in luxury, completely dissolving the boundary between the living space and the surrounding sky.",
    imageSrc: "/skysuite.jpeg",
    aspectClass: "aspect-[16/10]",
    speed: -0.07,
    link: "/project/skysuite",
  },
];

const DESKTOP_QUERY = "(min-width: 768px)";

export default function SelectedWorks() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorLabelRef = useRef<HTMLDivElement>(null);

  // Refs for desktop parallax
  const wrappersRef = useRef<(HTMLDivElement | null)[]>([]);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  // ===== Desktop: custom cursor + scroll parallax =====
  useEffect(() => {
    let rafId: number;
    let isDesktop = window.matchMedia(DESKTOP_QUERY).matches;
    let wasOverWork = false;

    const resetCursorState = () => {
      wasOverWork = false;
      document.body.style.cursor = "";
      if (cursorLabelRef.current) {
        cursorLabelRef.current.style.transform = "translate(-50%, -50%) scale(0)";
      }
    };

    const mql = window.matchMedia(DESKTOP_QUERY);
    const onMqChange = (e: MediaQueryListEvent) => {
      isDesktop = e.matches;
      if (!isDesktop) {
        cardsRef.current.forEach((card) => {
          if (card) card.style.transform = "translate3d(0, 0, 0)";
        });
        resetCursorState();
      }
    };
    mql.addEventListener("change", onMqChange);

    let mouseX = -100;
    let mouseY = -100;
    let cursorX = -100;
    let cursorY = -100;
    let hasMouse = false;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      hasMouse = true;
    };
    window.addEventListener("mousemove", onMouseMove);

    const render = () => {
      if (isDesktop) {
        cursorX += (mouseX - cursorX) * 0.15;
        cursorY += (mouseY - cursorY) * 0.15;

        if (cursorRef.current) {
          cursorRef.current.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;
        }

        // Re-check hover state every frame (not just on mousemove) so it
        // stays correct when the page scrolls under a stationary cursor.
        const overWork = hasMouse
          ? !!document.elementFromPoint(mouseX, mouseY)?.closest(".work-image-container")
          : false;

        if (overWork !== wasOverWork) {
          wasOverWork = overWork;
          document.body.style.cursor = overWork ? "none" : "";
          if (cursorLabelRef.current) {
            cursorLabelRef.current.style.transform = overWork
              ? "translate(-50%, -50%) scale(1)"
              : "translate(-50%, -50%) scale(0)";
          }
        }

        const viewportCenter = window.innerHeight / 2;

        wrappersRef.current.forEach((wrapper, index) => {
          const card = cardsRef.current[index];
          if (!wrapper || !card) return;

          const rect = wrapper.getBoundingClientRect();
          const elementCenter = rect.top + rect.height / 2;
          const distance = viewportCenter - elementCenter;

          const speed = WORKS[index].speed;
          const yOffset = distance * speed;

          card.style.transform = `translate3d(0, ${yOffset}px, 0)`;
        });
      }

      rafId = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      mql.removeEventListener("change", onMqChange);
      cancelAnimationFrame(rafId);
      resetCursorState();
    };
  }, []);

  // ===== Mobile: one-time clip-path reveal per item on scroll into view =====
  const [revealed, setRevealed] = useState<boolean[]>(() => WORKS.map(() => false));
  const mobileItemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const idx = Number((entry.target as HTMLElement).dataset.index);
          setRevealed((prev) => {
            if (prev[idx]) return prev; // already revealed, never re-trigger
            const next = [...prev];
            next[idx] = true;
            return next;
          });
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
    );

    mobileItemRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // ===== Text reveal (new): header + desktop project text, fade up once =====
  const headerRef = useRef<HTMLDivElement>(null);
  const [headerRevealed, setHeaderRevealed] = useState(false);

  const desktopTextRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [desktopTextRevealed, setDesktopTextRevealed] = useState<boolean[]>(() =>
    WORKS.map(() => false)
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const target = entry.target as HTMLElement;

          if (target.dataset.reveal === "header") {
            setHeaderRevealed(true);
            observer.unobserve(target);
            return;
          }

          if (target.dataset.revealIndex !== undefined) {
            const idx = Number(target.dataset.revealIndex);
            setDesktopTextRevealed((prev) => {
              if (prev[idx]) return prev;
              const next = [...prev];
              next[idx] = true;
              return next;
            });
            observer.unobserve(target);
          }
        });
      },
      { threshold: 0.2 }
    );

    if (headerRef.current) observer.observe(headerRef.current);
    desktopTextRefs.current.forEach((el) => el && observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section className="relative w-full bg-[#F2E8D4] py-16 md:py-24 overflow-hidden">
      {/* ===== Custom Floating Cursor - desktop only ===== */}
      <div
        ref={cursorRef}
        className="pointer-events-none fixed top-0 left-0 z-50 hidden md:block"
      >
        <div
          ref={cursorLabelRef}
          className="absolute flex h-20 w-20 items-center justify-center rounded-full bg-[#1A1A1A] text-[#F2E8D4] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{ transform: "translate(-50%, -50%) scale(0)" }}
        >
          <span className="font-sans text-[10px] uppercase tracking-[0.2em] font-medium">
            View
          </span>
        </div>
      </div>

      <div className="relative z-10 px-6 md:px-12 lg:px-20 max-w-7xl mx-auto">
        {/* Section Header - now fades up once, the first time it's in view */}
        <div
          ref={headerRef}
          data-reveal="header"
          className={`flex flex-col md:flex-row md:items-center justify-between border-b border-[#1A1A1A]/20 pb-6 mb-16 md:mb-24 transition-all duration-700 ease-out ${
            headerRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <h2 className="font-aboreto font-bold text-3xl md:text-5xl text-[#1A1A1A]">
            Selected Works
          </h2>
          <Link
            href="/project"
            className="group mt-4 md:mt-0 flex items-center gap-2 font-sans text-xs uppercase tracking-[0.15em] text-[#1A1A1A]/60 transition-colors hover:text-[#1A1A1A]"
          >
            Explore Archive
            <ArrowRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>

        {/* ===== DESKTOP: 2-column parallax masonry (md and up only) ===== */}
        <div className="hidden md:flex gap-8 lg:gap-16">
          <div className="flex flex-1 flex-col gap-24">
            {[WORKS[0], WORKS[2]].map((work) => {
              const globalIndex = WORKS.findIndex((w) => w.id === work.id);
              return (
                <div
                  key={work.id}
                  ref={(el) => { wrappersRef.current[globalIndex] = el; }}
                  className="relative w-full"
                >
                  <div
                    ref={(el) => { cardsRef.current[globalIndex] = el; }}
                    className="group flex flex-col will-change-transform"
                  >
                    {/* Wrapped Desktop Image in Link */}
                    <Link
                      href={work.link}
                      className={`work-image-container block relative w-full overflow-hidden bg-[#f2e8d4] mb-6 border border-[#1A1A1A]/5 ${work.aspectClass}`}
                    >
                      <img
                        src={work.imageSrc}
                        alt={work.title}
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.5s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                      />
                    </Link>
                    {/* Text reveal wrapper - fades up once, doesn't touch WorkMetadata itself */}
                    <div
                      ref={(el) => { desktopTextRefs.current[globalIndex] = el; }}
                      data-reveal-index={globalIndex}
                      className={`transition-all duration-700 ease-out ${
                        desktopTextRevealed[globalIndex]
                          ? "opacity-100 translate-y-0"
                          : "opacity-0 translate-y-6"
                      }`}
                    >
                      <WorkMetadata work={work} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex flex-1 flex-col gap-24 mt-32">
            {[WORKS[1], WORKS[3]].map((work) => {
              const globalIndex = WORKS.findIndex((w) => w.id === work.id);
              return (
                <div
                  key={work.id}
                  ref={(el) => { wrappersRef.current[globalIndex] = el; }}
                  className="relative w-full"
                >
                  <div
                    ref={(el) => { cardsRef.current[globalIndex] = el; }}
                    className="group flex flex-col will-change-transform"
                  >
                    {/* Wrapped Desktop Image in Link */}
                    <Link
                      href={work.link}
                      className={`work-image-container block relative w-full overflow-hidden bg-[#f2e8d4] mb-6 border border-[#1A1A1A]/5 ${work.aspectClass}`}
                    >
                      <img
                        src={work.imageSrc}
                        alt={work.title}
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.5s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                      />
                    </Link>
                    <div
                      ref={(el) => { desktopTextRefs.current[globalIndex] = el; }}
                      data-reveal-index={globalIndex}
                      className={`transition-all duration-700 ease-out ${
                        desktopTextRevealed[globalIndex]
                          ? "opacity-100 translate-y-0"
                          : "opacity-0 translate-y-6"
                      }`}
                    >
                      <WorkMetadata work={work} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ===== MOBILE: alternating left/right stagger + clip-path reveal (below md only) ===== */}
        <div className="flex md:hidden flex-col gap-20">
          {WORKS.map((work, index) => {
            const isLeft = index % 2 === 0;
            const isRevealed = revealed[index];

            // Clip-path wipe: grows the visible image area in from the edge
            // matching the card's offset direction. No covering panel of
            // any color ever sits on top of the image - what shows before
            // reveal is just the container's own placeholder background.
            const clipHidden = isLeft ? "inset(0 100% 0 0)" : "inset(0 0 0 100%)";
            const clipVisible = "inset(0 0 0 0)";

            return (
              <div
                key={work.id}
                ref={(el) => { mobileItemRefs.current[index] = el; }}
                data-index={index}
                className="flex flex-col"
              >
                {/* Image - bleeds off one edge, insets from the other,
                    alternating per card to create the zigzag rhythm. 
                    Wrapped in a Link for mobile clickability. */}
                <Link
                  href={work.link}
                  className={`block relative w-full overflow-hidden bg-[#f2e8d4] mb-6 ${work.aspectClass} ${
                    isLeft ? "-ml-6 mr-[16%]" : "-mr-6 ml-[16%]"
                  }`}
                >
                  <img
                    src={work.imageSrc}
                    alt={work.title}
                    className="absolute inset-0 h-full w-full object-cover"
                    style={{
                      clipPath: isRevealed ? clipVisible : clipHidden,
                      transform: isRevealed ? "scale(1)" : "scale(1.1)",
                      transition:
                        "clip-path 1100ms cubic-bezier(0.76,0,0.24,1), transform 1400ms cubic-bezier(0.16,1,0.3,1)",
                    }}
                  />
                </Link>

                {/* Text - follows the same side as the image, fades up
                    slightly after the reveal clears */}
                <div
                  className={`transition-all duration-700 ease-out delay-300 ${
                    isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                  }`}
                >
                  <WorkMetadata
                    work={work}
                    align={isLeft ? "left" : "right"}
                    interactive={false}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function WorkMetadata({
  work,
  align = "left",
  interactive = true,
}: {
  work: typeof WORKS[0];
  align?: "left" | "right";
  interactive?: boolean;
}) {
  const alignClasses = align === "right" ? "items-end text-right" : "items-start text-left";
  const hoverText = interactive ? "transition-colors duration-500 group-hover:text-[#1A1A1A]/60" : "";
  const hoverArrow = interactive ? "transition-transform duration-300 group-hover:translate-x-1" : "";

  return (
    <div className={`flex flex-col ${alignClasses}`}>
      <div className="mb-4">
        <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-[#1A1A1A]/60">
          {work.category}
        </span>
      </div>

      <Link href={work.link} className="w-fit">
        <h3 className={`font-aboreto text-2xl md:text-3xl text-[#1A1A1A] max-w-sm ${hoverText} ${interactive ? "cursor-pointer" : ""}`}>
          {work.title}
        </h3>
      </Link>

      <p className="mt-3 font-sans text-sm leading-relaxed text-[#1A1A1A]/75 max-w-sm">
        {work.description}
      </p>

      <Link
        href={work.link}
        className={`mt-6 flex items-center gap-2 font-sans text-[10px] uppercase tracking-[0.2em] text-[#1A1A1A] w-fit ${hoverText}`}
      >
        View Project
        <ArrowRight className={`h-3 w-3 ${hoverArrow}`} />
      </Link>
    </div>
  );
}