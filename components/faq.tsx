"use client";

import { useState } from "react";

// ---------------------------------------------------------------------------
// Theme & Data
// ---------------------------------------------------------------------------

const INK = "#1A1A1A";
const PAPER = "#F2E8D4";

const FAQS = [
  {
    question: "What services do you offer?",
    answer:
      "We handle the complete lifecycle of a build or renovation: architectural design, interior design, municipal approvals (regulatory liaisoning), and full on-site project oversight. You can engage us for the entire process or for specific standalone services.",
  },
  {
    question: "Do you handle the building approvals and local permissions?",
    answer:
      "Yes. We take care of all municipal paperwork, zoning clearances, and local building approvals directly so you don't have to navigate government offices or administrative hurdles yourself.",
  },
  {
    question: "How long does a typical project take?",
    answer:
      "Timelines depend on the scope and approval process. A complete luxury apartment interior usually takes 6 to 9 months, while a custom residence or standalone building typically ranges from 12 to 24 months from initial sketches to handover.",
  },
  {
    question: "How do you charge for your services?",
    answer:
      "Depending on the scale and nature of the work, we charge either a fixed professional fee, a per-square-foot rate, or a percentage of the overall project cost. All fees and payment schedules are laid out transparently before work begins.",
  },
  {
    question: "What is the first step to get started?",
    answer:
      "We begin with an initial meeting to review your site, discuss your goals, budget, and timeline, and answer any immediate questions. From there, we put together a clear project proposal and roadmap.",
  },
];

// ---------------------------------------------------------------------------
// Components
// ---------------------------------------------------------------------------

function cn(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default function Faq() {
  // Track which accordion is open. null means all are closed.
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <section
      id="faq"
      className="relative w-full"
      style={{ backgroundColor: PAPER, color: INK }}
    >
      <style>{`
        .font-aboreto { font-family: var(--font-aboreto), serif; }
        .font-worksans { font-family: var(--font-work-sans), sans-serif; }
      `}</style>

      <div className="mx-auto max-w-7xl px-6 py-24 md:px-12 md:py-32 lg:px-16 flex flex-col lg:flex-row gap-16 lg:gap-24 relative">
        
        {/* ===== LEFT COLUMN: Sticky Header ===== */}
        <div className="w-full lg:w-1/3">
          <div className="lg:sticky lg:top-32">
            <h2 
              className="font-aboreto text-5xl font-bold leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl"
            >
              Common <br className="hidden lg:block" />
              Inquiries
            </h2>
            <p className="font-worksans mt-6 max-w-sm text-sm leading-relaxed opacity-60 uppercase tracking-[0.15em]">
              The parameters of our practice.
            </p>
          </div>
        </div>

        {/* ===== RIGHT COLUMN: Interactive Accordion List ===== */}
        <div className="w-full lg:w-2/3 flex flex-col">
          {/* Top border for the list */}
          <div className="w-full h-px" style={{ backgroundColor: `${INK}1A` }} />

          {FAQS.map((faq, index) => {
            const isOpen = activeIndex === index;
            // If another item is open, dim this one slightly to create depth/focus
            const isDimmed = activeIndex !== null && !isOpen;

            return (
              <div
                key={index}
                className={cn(
                  "group border-b transition-colors duration-500",
                  isOpen ? "border-transparent" : ""
                )}
                style={{ borderColor: isOpen ? "transparent" : `${INK}1A` }}
              >
                <button
                  type="button"
                  onClick={() => setActiveIndex(isOpen ? null : index)}
                  className={cn(
                    "flex w-full items-start justify-between py-8 text-left transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
                    isDimmed ? "opacity-30 hover:opacity-70" : "opacity-100"
                  )}
                >
                  <div className="flex gap-6 md:gap-10">
                    <span 
                      className="font-aboreto mt-1 hidden text-sm sm:block" 
                      style={{ color: `${INK}80` }}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h3 
                      className={cn(
                        "font-worksans text-xl leading-snug tracking-tight sm:text-2xl md:text-3xl transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
                        isOpen ? "translate-x-2" : "group-hover:translate-x-2"
                      )}
                    >
                      {faq.question}
                    </h3>
                  </div>

                  {/* Bespoke Geometric Toggle Icon */}
                  <div className="relative ml-6 mt-1 flex h-6 w-6 shrink-0 items-center justify-center">
                    <div
                      className={cn(
                        "absolute h-px w-full bg-current transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
                        isOpen ? "rotate-180" : "rotate-0"
                      )}
                    />
                    <div
                      className={cn(
                        "absolute h-px w-full bg-current transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
                        isOpen ? "rotate-180 opacity-0" : "rotate-90 opacity-100"
                      )}
                    />
                  </div>
                </button>

                {/* 
                  Smooth Height Expansion using CSS Grid 
                  This avoids max-height guessing and allows natural flow.
                */}
                <div
                  className={cn(
                    "grid transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
                    isOpen ? "grid-rows-[1fr] opacity-100 pb-10" : "grid-rows-[0fr] opacity-0 pb-0"
                  )}
                >
                  <div className="overflow-hidden">
                    <div className="pl-0 sm:pl-[3.25rem] md:pl-[4.5rem] pr-8 lg:pr-16">
                      <p 
                        className="font-worksans text-base leading-relaxed sm:text-lg"
                        style={{ color: `${INK}B3` }}
                      >
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Animated active border replacing the standard static border */}
                <div 
                  className="h-px w-full origin-left transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                  style={{ 
                    backgroundColor: INK,
                    transform: isOpen ? "scaleX(1)" : "scaleX(0)" 
                  }}
                />
              </div>
            );
          })}
        </div>
        
      </div>
    </section>
  );
}