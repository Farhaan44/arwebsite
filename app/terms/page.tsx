"use client";

import React, { useEffect, useRef, useState } from "react";
import { CTASection } from "@/components/CTAsection";

const SECTIONS = [
  { id: "agreement", title: "1. Agreement to Terms" },
  { id: "intellectual-property", title: "2. Intellectual Property" },
  { id: "user-conduct", title: "3. User Conduct" },
  { id: "services", title: "4. Studio Services" },
  { id: "liability", title: "5. Limitation of Liability" },
  { id: "governing-law", title: "6. Governing Law" },
];

export default function TermsOfService() {
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
            Terms of Service
          </h1>
          <p className="font-worksans text-sm md:text-base text-[#1A1A1A]/60 mt-6 max-w-xl">
            Effective Date: September 2026. Please read these terms carefully before engaging with our digital platforms or studio services.
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
            <section id="agreement" ref={(el) => { sectionRefs.current["agreement"] = el; }}>
              <h2 className="font-aboreto text-3xl mb-6">1. Agreement to Terms</h2>
              <div className="font-worksans text-base leading-relaxed text-[#1A1A1A]/75 space-y-6">
                <p>By accessing or using our website, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access our services.</p>
              </div>
            </section>

            <section id="intellectual-property" ref={(el) => { sectionRefs.current["intellectual-property"] = el; }}>
              <h2 className="font-aboreto text-3xl mb-6">2. Intellectual Property</h2>
              <div className="font-worksans text-base leading-relaxed text-[#1A1A1A]/75 space-y-6">
                <p>All architectural designs, master plans, interior concepts, renderings, photography, and text displayed on this website are the exclusive intellectual property of the studio.</p>
                <p>They are protected by international copyright and intellectual property laws. Unauthorized reproduction, distribution, or commercial use of our designs without express written consent is strictly prohibited.</p>
              </div>
            </section>

            <section id="user-conduct" ref={(el) => { sectionRefs.current["user-conduct"] = el; }}>
              <h2 className="font-aboreto text-3xl mb-6">3. User Conduct</h2>
              <div className="font-worksans text-base leading-relaxed text-[#1A1A1A]/75 space-y-6">
                <p>When interacting with our digital platforms, you agree not to use the site for any unlawful purpose, to solicit others to perform unlawful acts, or to infringe upon our intellectual property rights.</p>
              </div>
            </section>

            <section id="services" ref={(el) => { sectionRefs.current["services"] = el; }}>
              <h2 className="font-aboreto text-3xl mb-6">4. Studio Services</h2>
              <div className="font-worksans text-base leading-relaxed text-[#1A1A1A]/75 space-y-6">
                <p>Information provided on this website regarding our architectural, interior design, and management services is for general informational purposes. Formal engagements are strictly governed by bespoke, signed contracts unique to each client and project.</p>
              </div>
            </section>

            <section id="liability" ref={(el) => { sectionRefs.current["liability"] = el; }}>
              <h2 className="font-aboreto text-3xl mb-6">5. Limitation of Liability</h2>
              <div className="font-worksans text-base leading-relaxed text-[#1A1A1A]/75 space-y-6">
                <p>In no event shall the studio, nor its directors, employees, or partners, be liable for any indirect, incidental, special, consequential or punitive damages arising out of your access to, or use of, our website.</p>
              </div>
            </section>

            <section id="governing-law" ref={(el) => { sectionRefs.current["governing-law"] = el; }}>
              <h2 className="font-aboreto text-3xl mb-6">6. Governing Law</h2>
              <div className="font-worksans text-base leading-relaxed text-[#1A1A1A]/75 space-y-6">
                <p>These Terms shall be governed and construed in accordance with the laws of India, without regard to its conflict of law provisions.</p>
              </div>
            </section>
          </div>

        </div>
      </div>
      <CTASection />
    </div>
  );
}