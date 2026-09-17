"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link"; // Added Link import
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { CTASection } from "@/components/CTAsection";

/**
 * ProjectsPage — Parallax Luxury Editorial Edition
 */

// ---------------------------------------------------------------------------
// Types, Data & Helpers
// ---------------------------------------------------------------------------

type Project = {
  id: string;
  title: string;
  tags: string[];
  tagline: string;
  description: string;
  imageSrc: string;
  aspectClass: string;
  year: string;
  link: string; // <-- Required for routing
};

const CATEGORIES = [
  { key: "all", label: "All Projects" },
  { key: "architecture", label: "Architecture" },
  { key: "designing", label: "Designing" },
  { key: "management", label: "Management" },
];

const PROJECTS: Project[] = [
  {
    id: "01",
    title: "Anzar Residency",
    tags: ["architecture", "management"],
    tagline: "Architecture & Management",
    description:
      "An architectural statement rising twenty-one stories, featuring meticulously crafted residences with sweeping ocean vistas, where bespoke design meets uncompromising comfort.",
    imageSrc: "/work1.jpg",
    aspectClass: "aspect-[4/5]",
    year: "2018",
    link: "/project/anzarresidency", // Exact match to your folder
  },
  {
    id: "02",
    title: "Blue Ocean",
    tags: ["architecture", "management"],
    tagline: "Architecture & Management",
    description:
      "Thirty-nine stories of architectural ambition, a bold new horizon for the city, anchored by masterfully executed mixed-use spaces.",
    imageSrc: "/work2.jpg",
    aspectClass: "aspect-[3/4]",
    year: "2020",
    link: "/project/blueocean",
  },
  {
    id: "03",
    title: "Numara",
    tags: ["designing"],
    tagline: "Commercial Space Designing",
    description:
      "Designed using a masterful balance of luminous onyx, veined Statuario marble, and rich polished wood veneers, crafting a commercial environment of quiet opulence.",
    imageSrc: "/work3.jpg",
    aspectClass: "aspect-[4/5]",
    year: "2026",
    link: "/project/numara",
  },
  {
    id: "04",
    title: "The Sky Suite",
    tags: ["designing"],
    tagline: "Interior Designing",
    description:
      "A study in luxury, completely dissolving the boundary between the living space and the surrounding sky.",
    imageSrc: "/skysuite.jpeg",
    aspectClass: "aspect-[16/10]",
    year: "2022",
    link: "/project/skysuite",
  },
  {
    id: "05",
    title: "The Onyx Boardroom",
    tags: ["designing", "management"],
    tagline: "Designing & Management",
    description:
      "A monolithic onyx marble centerpiece paired with warm veneer woodwork and hand-stitched leather seating, crafted for quiet executive authority.",
    imageSrc: "/onyxboardroom.jpg",
    aspectClass: "aspect-[3/4]",
    year: "2026",
    link: "/project/onyxboardroom",
  },
  {
    id: "06",
    title: "The Marble Sanctuary",
    tags: ["designing"],
    tagline: "Interior Designing",
    description:
      "Book-matched Italian Statuario marble and seamless architectural lines frame this private residence, where luminous natural veining meets quiet spatial serenity.",
    imageSrc: "/partner3.jpg",
    aspectClass: "aspect-[4/5]",
    year: "2022",
    link: "/project/marblesanctuary",
  },
  {
    id: "07",
    title: "Veneer Executive Cabin",
    tags: ["designing", "management"],
    tagline: "Designing & Management",
    description:
      "Rich architectural veneer paneling and bespoke joinery frame this private sanctuary, blending tactile warmth with quiet, focused authority.",
    imageSrc: "/veneercabin2.jpg",
    aspectClass: "aspect-[4/5]",
    year: "2026",
    link: "/project/veneercabin",
  },
];

const DESKTOP_QUERY = "(min-width: 768px)";
const FONT_IMPORT_ID = "projects-page-font-import";

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export default function ProjectsPage() {
  // ---- Typography Loader ----
  useEffect(() => {
    if (document.getElementById(FONT_IMPORT_ID)) return;
    const link = document.createElement("link");
    link.id = FONT_IMPORT_ID;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Aboreto&family=Work+Sans:wght@300;400;500;600&display=swap";
    document.head.appendChild(link);
  }, []);

  // ---- State ----
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [displayedFilter, setDisplayedFilter] = useState<string>("all");
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  
  const [gridVisible, setGridVisible] = useState<boolean>(false);
  const [gridKey, setGridKey] = useState<number>(0);

  const filtered = useMemo(
    () =>
      displayedFilter === "all"
        ? PROJECTS
        : PROJECTS.filter((p) => p.tags.includes(displayedFilter)),
    [displayedFilter]
  );

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: PROJECTS.length };
    CATEGORIES.forEach((cat) => {
      if (cat.key === "all") return;
      c[cat.key] = PROJECTS.filter((p) => p.tags.includes(cat.key)).length;
    });
    return c;
  }, []);

  // ---- Initial Grid Fade In ----
  useEffect(() => {
    const t = setTimeout(() => setGridVisible(true), 150);
    return () => clearTimeout(t);
  }, []);

  // ---- Filter Click Handler ----
  const handleFilterClick = (newFilter: string) => {
    if (newFilter === activeFilter || isAnimating) return;
    
    setIsAnimating(true);
    setActiveFilter(newFilter);
    setGridVisible(false);

    setTimeout(() => {
      setDisplayedFilter(newFilter);
      setGridKey((k) => k + 1);

      setTimeout(() => {
        setGridVisible(true);
        setTimeout(() => setIsAnimating(false), 800);
      }, 50);
    }, 450); 
  };

  // ---- Sliding index-rail underline ----
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const railRef = useRef<HTMLDivElement | null>(null);
  const [underline, setUnderline] = useState({ left: 0, width: 0 });

  useEffect(() => {
    const update = () => {
      const el = tabRefs.current[activeFilter];
      const rail = railRef.current;
      if (!el || !rail) return;
      
      const elRect = el.getBoundingClientRect();
      const railRect = rail.getBoundingClientRect();
      setUnderline({ left: elRect.left - railRect.left, width: elRect.width });
    };
    
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [activeFilter]);

  // ---- Desktop custom cursor ----
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const cursorLabelRef = useRef<HTMLDivElement | null>(null);

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
      if (!isDesktop) resetCursorState();
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

        const el = document.elementFromPoint(mouseX, mouseY);
        // Only trigger cursor on links inside the container
        const overWork = hasMouse && el ? !!el.closest(".project-image-container") : false;

        if (overWork !== wasOverWork) {
          wasOverWork = overWork;
          document.body.style.cursor = overWork ? "none" : "";
          if (cursorLabelRef.current) {
            cursorLabelRef.current.style.transform = overWork
              ? "translate(-50%, -50%) scale(1)"
              : "translate(-50%, -50%) scale(0)";
          }
        }
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

  // ---- Fade-ups ----
  const headerRef = useRef<HTMLDivElement | null>(null);
  const railWrapRef = useRef<HTMLDivElement | null>(null);
  const [headerRevealed, setHeaderRevealed] = useState<boolean>(false);
  const [railRevealed, setRailRevealed] = useState<boolean>(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const target = entry.target as HTMLElement;
          if (target.dataset.reveal === "header") setHeaderRevealed(true);
          if (target.dataset.reveal === "rail") setRailRevealed(true);
          observer.unobserve(target);
        });
      },
      { threshold: 0.15 }
    );
    if (headerRef.current) observer.observe(headerRef.current);
    if (railWrapRef.current) observer.observe(railWrapRef.current);
    return () => observer.disconnect();
  }, []);

  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [cardRevealed, setCardRevealed] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const target = entry.target as HTMLElement;
          const id = target.dataset.cardId;
          if (id) {
            setCardRevealed((prev) => (prev[id] ? prev : { ...prev, [id]: true }));
            observer.unobserve(target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -5% 0px" }
    );
    Object.values(cardRefs.current).forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [gridKey]);

  useEffect(() => {
    let rafId: number;
    const TRIGGER_Y = 20; 

    const tick = () => {
      const isMobile = window.innerWidth < 768;

      const metrics = filtered.map((project) => {
        const card = cardRefs.current[project.id];
        return card ? { card, rect: card.getBoundingClientRect() } : null;
      });

      metrics.forEach((metric) => {
        if (!metric) return;
        const { card, rect } = metric;

        if (!isMobile) {
          card.style.transform = "";
          card.style.opacity = "";
          return;
        }

        const fadeDistance = rect.height * 1.2;
        const progress = clamp((TRIGGER_Y - rect.top) / fadeDistance, 0, 1);

        if (progress > 0) {
          const yOffset = progress * (rect.height * 0.25);
          const scale = 1 - progress * 0.05;
          const opacity = 1 - Math.pow(progress, 2.5);

          card.style.transform = `translate3d(0px, ${yOffset}px, 0px) scale(${scale})`;
          card.style.opacity = String(opacity);
        } else {
          card.style.transform = "translate3d(0px, 0px, 0px) scale(1)";
          card.style.opacity = "1";
        }
      });

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [filtered]);

  return (
    <div
      className="relative w-full min-h-screen bg-[#F2E8D4]"
      style={{ fontFamily: "'Work Sans', sans-serif" }}
    >
      <style>{`
        .font-aboreto { font-family: 'Aboreto', serif; }
        .font-worksans { font-family: 'Work Sans', sans-serif; }
      `}</style>

      {/* ===== Custom Floating Cursor - desktop only ===== */}
      <div ref={cursorRef} className="pointer-events-none fixed top-0 left-0 z-50 hidden md:block">
        <div
          ref={cursorLabelRef}
          className="absolute flex h-20 w-20 items-center justify-center rounded-full bg-[#1A1A1A]/95 text-[#F2E8D4] backdrop-blur-md transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-xl"
          style={{ transform: "translate(-50%, -50%) scale(0)" }}
        >
          <span className="font-worksans text-[10px] uppercase tracking-[0.2em] font-medium">Explore</span>
        </div>
      </div>

      <div className="relative z-10 px-6 md:px-12 lg:px-20 max-w-7xl mx-auto py-16 md:py-24">
        {/* ===== Page Header ===== */}
        <div
          ref={headerRef}
          data-reveal="header"
          className={`border-b border-[#1A1A1A]/10 pb-8 mb-10 md:mb-14 transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            headerRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <h1 className="font-aboreto font-bold text-5xl md:text-7xl lg:text-8xl text-[#1A1A1A] mt-4 tracking-tight">
            Projects
          </h1>
          <p className="font-worksans text-sm md:text-base leading-relaxed text-[#1A1A1A]/60 max-w-lg mt-6">
            A curated index of the studio&apos;s architectural, interior design, and master planning engagements.
          </p>
        </div>

        {/* ===== Index Rail (filter tabs) ===== */}
        <div
          ref={railWrapRef}
          data-reveal="rail"
          className={`relative mb-16 md:mb-20 transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] delay-100 ${
            railRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div
            ref={railRef}
            className="relative flex flex-wrap gap-x-8 gap-y-6 md:gap-x-12 border-b border-[#1A1A1A]/15 pb-5"
          >
            {CATEGORIES.map((cat) => (
              <button
                key={cat.key}
                ref={(el) => {
                  tabRefs.current[cat.key] = el;
                }}
                onClick={() => handleFilterClick(cat.key)}
                className={`group flex items-baseline gap-2 font-worksans text-xs md:text-sm uppercase tracking-[0.15em] transition-colors duration-500 ${
                  activeFilter === cat.key ? "text-[#1A1A1A]" : "text-[#1A1A1A]/40 hover:text-[#1A1A1A]/80"
                }`}
              >
                {cat.label}
                <span className="text-[10px] tracking-normal opacity-50">
                  ({String(counts[cat.key]).padStart(2, "0")})
                </span>
              </button>
            ))}

            <span
              className="absolute -bottom-[1px] h-[1.5px] bg-[#1A1A1A] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{ left: underline.left, width: underline.width }}
            />
          </div>
        </div>

        {/* ===== Project Grid ===== */}
        <div key={gridKey} className="columns-1 md:columns-2 lg:columns-3 gap-8 lg:gap-12 [column-fill:_balance]">
          {filtered.map((project, index) => (
            <div key={project.id} className="mb-14 lg:mb-16 break-inside-avoid">
              <ProjectCard
                project={project}
                index={index}
                visible={gridVisible}
                revealed={!!cardRevealed[project.id]}
                registerRef={(el) => {
                  if (el) {
                    cardRefs.current[project.id] = el;
                  } else {
                    delete cardRefs.current[project.id];
                  }
                }}
              />
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="py-24 text-center">
            <p className="font-aboreto text-2xl text-[#1A1A1A]/40">No entries in this discipline yet.</p>
          </div>
        )}
      </div>
      <CTASection />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Project Card Component
// ---------------------------------------------------------------------------

interface ProjectCardProps {
  project: Project;
  index: number;
  visible: boolean;
  revealed: boolean;
  registerRef: (el: HTMLDivElement | null) => void;
}

function ProjectCard({ project, index, visible, revealed, registerRef }: ProjectCardProps) {
  const isShown = visible && revealed;
  const opacity = isShown ? 1 : 0;
  const entranceTransform = isShown ? "translateY(0)" : "translateY(40px)";
  const delay = visible ? `${index * 80}ms` : "0ms";

  return (
    <div
      ref={registerRef}
      data-card-id={project.id}
      className="will-change-transform"
      style={{ transformOrigin: "center top" }}
    >
      <div
        className="group flex flex-col"
        style={{
          opacity,
          transform: entranceTransform,
          transition: "opacity 900ms cubic-bezier(0.16,1,0.3,1), transform 900ms cubic-bezier(0.16,1,0.3,1)",
          transitionDelay: delay,
        }}
      >
        {/* Next.js Link properly wrapping the image */}
        <Link
          href={project.link}
          className={`project-image-container block relative w-full overflow-hidden bg-[#E6DCC5] mb-6 ${project.aspectClass}`}
        >
          <Image
            src={project.imageSrc}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-[2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/0 transition-colors duration-[1.5s] group-hover:bg-black/10 pointer-events-none" />

          <div className="absolute top-4 left-4 z-10 pointer-events-none">
            <span className="font-worksans text-[10px] uppercase tracking-[0.2em] text-[#F2E8D4] bg-[#1A1A1A]/80 backdrop-blur-md px-3 py-1.5 rounded-sm">
              {project.id}
            </span>
          </div>
          
          <div className="absolute top-4 right-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-[#F2E8D4]/95 opacity-80 shadow-sm transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] md:opacity-0 md:-translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 pointer-events-none">
            <ArrowUpRight className="h-4 w-4 text-[#1A1A1A]" />
          </div>
        </Link>

        {/* Card Typography Content */}
        <div className="flex flex-col px-1">
          <div className="mb-4 flex items-center justify-between border-b border-[#1A1A1A]/10 pb-3">
            <span className="font-worksans text-[9px] uppercase tracking-[0.25em] text-[#1A1A1A]/50 font-medium">
              {project.tagline}
            </span>
            <span className="font-worksans text-[10px] uppercase tracking-[0.2em] text-[#1A1A1A]/40">
              {project.year}
            </span>
          </div>

          {/* Title also wrapped in a link for good measure */}
          <Link href={project.link} className="w-fit">
            <h3 className="font-aboreto text-2xl md:text-3xl text-[#1A1A1A] max-w-sm transition-colors duration-500 group-hover:text-[#1A1A1A]/70">
              {project.title}
            </h3>
          </Link>

          <p className="mt-4 font-worksans text-sm leading-relaxed text-[#1A1A1A]/60 max-w-sm">
            {project.description}
          </p>

          {/* The View Project button converted cleanly to Next Link */}
          <Link
            href={project.link}
            className="mt-6 flex items-center gap-3 font-worksans text-[10px] uppercase tracking-[0.2em] text-[#1A1A1A] w-fit transition-colors duration-500 group-hover:text-[#1A1A1A]/60 font-medium"
          >
            View Project
            <ArrowRight className="h-3 w-3 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}