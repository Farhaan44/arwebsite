"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CTASection } from "@/components/CTAsection";

// ---------------------------------------------------------------------------
// Theme & Mock Data
// ---------------------------------------------------------------------------

const INK = "#1A1A1A";
const PAPER = "#F2E8D4";

const PROJECT = {
  title: "Blue Ocean",
  tagline: "A bold new horizon in high-rise living.",
  year: "2020",
  location: "Agripada, Mumbai",
  services: ["Structural Designing", "Space Planning", "Management"],
  heroImage: "/work2.jpg", 
  imageTwo: "/servicearchitecture.png",
  imageThree: "/qubainterior.png",
  description:
    "Rising thirty-nine stories, Blue Ocean is an exercise in architectural ambition and mixed-use mastery. The structure anchors the city skyline with deliberate precision, seamlessly blending commercial vitality at its base with serene, elevated residential spaces above. Every structural decision was driven by a desire to maximize natural light and open spatial flow, resulting in a monolith that feels impossibly light and deeply connected to its surroundings.",
};

function cn(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export default function ProjectDetail() {
  // --- Parallax & Scroll Animations ---
  const heroParallaxRef = useRef<HTMLDivElement | null>(null);
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});

  // 1. Smooth Parallax for Hero Image Wrapper
  useEffect(() => {
    let rafId: number;
    const handleScroll = () => {
      if (heroParallaxRef.current) {
        const scrolled = window.scrollY;
        // Apply transform to the wrapper div, keeping <Image> untouched
        heroParallaxRef.current.style.transform = `translate3d(0, ${scrolled * 0.15}px, 0) scale(1.05)`;
      }
      rafId = requestAnimationFrame(handleScroll);
    };
    rafId = requestAnimationFrame(handleScroll);
    return () => cancelAnimationFrame(rafId);
  }, []);

  // 2. Fade-Up on Scroll Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target as HTMLElement;
            const indexStr = target.getAttribute("data-reveal-index");
            
            if (indexStr !== null) {
              const index = Number(indexStr);
              setRevealed((prev) => ({ ...prev, [index]: true }));
              observer.unobserve(target);
            }
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -5% 0px" }
    );

    const elements = document.querySelectorAll("[data-reveal-index]");
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div
      className="relative w-full min-h-screen selection:bg-[#1A1A1A] selection:text-[#F2E8D4]"
      style={{ backgroundColor: PAPER, color: INK }}
    >
      <style>{`
        .font-aboreto { font-family: var(--font-aboreto), serif; }
        .font-worksans { font-family: var(--font-work-sans), sans-serif; }
      `}</style>

      {/* ===== 1. HERO SECTION (Constrained Width, Tall Image) ===== */}
      <section className="pt-32 md:pt-48 px-6 md:px-12 lg:px-16 max-w-7xl mx-auto">
        {/* Title */}
        <div 
          data-reveal-index="0"
          className={cn(
            "transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]",
            revealed[0] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          )}
        >
          <h1 className="font-aboreto text-[14vw] md:text-[9vw] lg:text-[7.5vw] leading-[0.9] tracking-tight uppercase">
            {PROJECT.title}
          </h1>
        </div>

        {/* Hero Image (Tall but respects page padding) */}
        <div 
          data-reveal-index="1"
          className={cn(
            // Keeps the massive height, but sits inside the max-w-7xl container margins
            "relative w-full h-[75vh] md:h-[95vh] mt-10 md:mt-16 overflow-hidden transition-all duration-1000 delay-200 ease-[cubic-bezier(0.16,1,0.3,1)]",
            revealed[1] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          )}
        >
          <div ref={heroParallaxRef} className="absolute inset-0 w-full h-full origin-bottom scale-105">
            <Image
              src={PROJECT.heroImage}
              alt={PROJECT.title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 90vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* ===== 2. PROJECT METADATA GRID ===== */}
      <section className="px-6 md:px-12 lg:px-16 max-w-7xl mx-auto mt-16 md:mt-24">
        <div 
          data-reveal-index="2"
          className={cn(
            "grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 border-t border-b border-[#1A1A1A]/15 py-12 transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]",
            revealed[2] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <div>
            <h4 className="font-aboreto text-[10px] md:text-xs uppercase tracking-[0.2em] opacity-50 mb-3">
              Location
            </h4>
            <p className="font-worksans text-sm md:text-base font-medium">{PROJECT.location}</p>
          </div>
          <div>
            <h4 className="font-aboreto text-[10px] md:text-xs uppercase tracking-[0.2em] opacity-50 mb-3">
              Year
            </h4>
            <p className="font-worksans text-sm md:text-base font-medium">{PROJECT.year}</p>
          </div>
          <div className="col-span-2 md:col-span-2">
            <h4 className="font-aboreto text-[10px] md:text-xs uppercase tracking-[0.2em] opacity-50 mb-3">
              Scope of Work
            </h4>
            <p className="font-worksans text-sm md:text-base font-medium">
              {PROJECT.services.join(" • ")}
            </p>
          </div>
        </div>
      </section>

      {/* ===== 3. EDITORIAL NARRATIVE ===== */}
      <section className="px-6 md:px-12 lg:px-16 max-w-7xl mx-auto mt-24 md:mt-32">
        <div className="flex flex-col md:flex-row gap-16 md:gap-24 items-start">
          
          {/* Oversized Drop Quote (Left) */}
          <div 
            data-reveal-index="3"
            className={cn(
              "w-full md:w-5/12 transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]",
              revealed[3] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
            )}
          >
            <h3 className="font-aboreto text-3xl md:text-4xl lg:text-5xl leading-[1.1] tracking-tight">
              &quot;{PROJECT.tagline}&quot;
            </h3>
          </div>

          {/* Description Text (Right) */}
          <div 
            data-reveal-index="4"
            className={cn(
              "w-full md:w-7/12 font-worksans text-base md:text-lg leading-relaxed text-[#1A1A1A]/80 whitespace-pre-line transition-all duration-1000 delay-100 ease-[cubic-bezier(0.16,1,0.3,1)]",
              revealed[4] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
            )}
          >
            {PROJECT.description}
          </div>

        </div>
      </section>

      {/* ===== 4. ASYMMETRIC IMAGE GALLERY ===== */}
      <section className="px-6 md:px-12 lg:px-16 max-w-7xl mx-auto mt-24 md:mt-32 pb-32">
        <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-center md:items-end">
          
          {/* Portrait Image (Small/Left) */}
          <div 
            data-reveal-index="5"
            className={cn(
              "relative w-full md:w-4/12 aspect-[3/4] overflow-hidden transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]",
              revealed[5] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16"
            )}
          >
            <Image
              src={PROJECT.imageTwo}
              alt="Detail view 1"
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover transition-transform duration-[2s] hover:scale-105"
            />
          </div>

          {/* Landscape Image (Large/Right) */}
          <div 
            data-reveal-index="6"
            className={cn(
              "relative w-full md:w-8/12 aspect-[4/3] overflow-hidden transition-all duration-1000 delay-200 ease-[cubic-bezier(0.16,1,0.3,1)]",
              revealed[6] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16"
            )}
          >
            <Image
              src={PROJECT.imageThree}
              alt="Detail view 2"
              fill
              sizes="(max-width: 768px) 100vw, 66vw"
              className="object-cover transition-transform duration-[2s] hover:scale-105"
            />
          </div>

        </div>
      </section>

      {/* ===== 5. NEXT PROJECT FOOTER ===== */}
      <section className="border-t border-[#1A1A1A]/10">
        <Link 
          href="/project/numara" 
          className="group block w-full px-6 py-24 md:py-32 text-center hover:bg-[#1A1A1A] transition-colors duration-700"
        >
          <span className="font-worksans block text-xs uppercase tracking-[0.25em] text-[#1A1A1A]/50 mb-6 transition-colors duration-700 group-hover:text-[#F2E8D4]/50">
            Next Project
          </span>
          <h2 className="font-aboreto text-4xl md:text-6xl lg:text-8xl text-[#1A1A1A] transition-colors duration-700 group-hover:text-[#F2E8D4] flex items-center justify-center gap-4 md:gap-8">
            Numara
            <ArrowRight className="w-8 h-8 md:w-16 md:h-16 -rotate-45 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:rotate-0" />
          </h2>
        </Link>
      </section>

      <CTASection />
    </div>
  );
}