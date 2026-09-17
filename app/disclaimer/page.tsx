"use client";

import React, { useEffect, useRef, useState } from "react";
import { CTASection } from "@/components/CTAsection";

const SECTIONS = [
  { id: "general", title: "1. General Information" },
  { id: "professional-advice", title: "2. No Professional Advice" },
  { id: "accuracy", title: "3. Accuracy of Information" },
  { id: "external-links", title: "4. External Links" },
];

export default function Disclaimer() {
  const [activeSection, setActiveSection] = useState(SECTIONS[0].id);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0px -70% 0px" }
    );

    Object.values(sectionRefs.current).forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    sectionRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const [revealed, setRevealed] = useState(false);
  
  // Fixed cascading render issue by deferring state update to next tick
  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), 50);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="relative w-full min-h-screen bg-[#F2E8D4] text-[#1A1A1A]">
      <style>{`
        .font-aboreto { font-family: var(--font-aboreto), serif; }
        .font-worksans { font-family: var(--font-work-sans), sans-serif; }
      `}</style>

      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 pt-32 md:pt-48 pb-24">
        
        <div className={`border-b border-[#1A1A1A]/10 pb-12 transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${revealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>
          
          <h1 className="font-aboreto text-5xl md:text-7xl lg:text-8xl tracking-tight">
            Disclaimer
          </h1>
          <p className="font-worksans text-sm md:text-base text-[#1A1A1A]/60 mt-6 max-w-xl">
            Effective Date: September 2026. Important disclosures regarding the information presented on our platform.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-16 mt-16 lg:mt-24">
          
          <div className="w-full lg:w-1/3">
            <div className="sticky top-32 flex flex-col gap-4">
              {SECTIONS.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className="group flex items-center gap-4 text-left font-worksans text-sm uppercase tracking-[0.1em]"
                >
                  <span className={`h-[1px] bg-[#1A1A1A] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${activeSection === section.id ? "w-8 opacity-100" : "w-0 opacity-0 group-hover:w-4 group-hover:opacity-50"}`} />
                  <span className={`transition-colors duration-500 ${activeSection === section.id ? "text-[#1A1A1A]" : "text-[#1A1A1A]/40 group-hover:text-[#1A1A1A]/70"}`}>
                    {section.title}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="w-full lg:w-2/3 flex flex-col gap-24">
            <section id="general" ref={(el) => { sectionRefs.current["general"] = el; }}>
              <h2 className="font-aboreto text-3xl mb-6">1. General Information</h2>
              <div className="font-worksans text-base leading-relaxed text-[#1A1A1A]/75 space-y-6">
                <p>The information provided by our studio on this website is for general informational and portfolio display purposes only. All information on the site is provided in good faith.</p>
              </div>
            </section>

            <section id="professional-advice" ref={(el) => { sectionRefs.current["professional-advice"] = el; }}>
              <h2 className="font-aboreto text-3xl mb-6">2. No Professional Advice</h2>
              <div className="font-worksans text-base leading-relaxed text-[#1A1A1A]/75 space-y-6">
                <p>The site cannot and does not contain formal architectural, structural, or legal advice. Browsing our portfolio or reading our design philosophy does not establish an architect-client relationship.</p>
                <p>Any action you take upon the information on our website is strictly at your own risk. Professional consultation must be sought before making structural or real estate decisions.</p>
              </div>
            </section>

            <section id="accuracy" ref={(el) => { sectionRefs.current["accuracy"] = el; }}>
              <h2 className="font-aboreto text-3xl mb-6">3. Accuracy of Information</h2>
              <div className="font-worksans text-base leading-relaxed text-[#1A1A1A]/75 space-y-6">
                <p>While we strive to present accurate visual representations of our work, project renderings, conceptual sketches, and finished photography may differ from actual built realities due to site conditions, lighting, and material variations.</p>
              </div>
            </section>

            <section id="external-links" ref={(el) => { sectionRefs.current["external-links"] = el; }}>
              <h2 className="font-aboreto text-3xl mb-6">4. External Links</h2>
              <div className="font-worksans text-base leading-relaxed text-[#1A1A1A]/75 space-y-6">
                <p>Our website may contain links to third-party vendors, suppliers, or press features. We do not warrant, endorse, or assume responsibility for the accuracy or reliability of any information offered by third-party websites linked through our site.</p>
              </div>
            </section>
          </div>

        </div>
      </div>
      <CTASection />
    </div>
  );
}