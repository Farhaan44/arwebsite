"use client";

import React, { useEffect, useRef, useState } from "react";
import { CTASection } from "@/components/CTAsection";

const SECTIONS = [
  { id: "introduction", title: "1. Introduction" },
  { id: "data-collection", title: "2. Data Collection" },
  { id: "data-usage", title: "3. Use of Information" },
  { id: "cookies", title: "4. Cookies & Tracking" },
  { id: "third-parties", title: "5. Third-Party Sharing" },
  { id: "rights", title: "6. Your Rights" },
];

export default function PrivacyPolicy() {
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
            Privacy Policy
          </h1>
          <p className="font-worksans text-sm md:text-base text-[#1A1A1A]/60 mt-6 max-w-xl">
            Effective Date: September 2026. We respect your privacy and are committed to protecting your personal data.
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
            <section id="introduction" ref={(el) => { sectionRefs.current["introduction"] = el; }}>
              <h2 className="font-aboreto text-3xl mb-6">1. Introduction</h2>
              <div className="font-worksans text-base leading-relaxed text-[#1A1A1A]/75 space-y-6">
                <p>Welcome to our studio&apos;s digital presence. This privacy policy dictates how we collect, use, and protect your information when you visit our website or engage our architectural and design services.</p>
                <p>We believe in absolute transparency. Your data is treated with the same discretion and meticulous care as our physical projects.</p>
              </div>
            </section>

            <section id="data-collection" ref={(el) => { sectionRefs.current["data-collection"] = el; }}>
              <h2 className="font-aboreto text-3xl mb-6">2. Data Collection</h2>
              <div className="font-worksans text-base leading-relaxed text-[#1A1A1A]/75 space-y-6">
                <p>We may collect personal identification information (Name, email address, phone number, project details) when you voluntarily submit it through our contact forms or during consultations.</p>
                <p>We also automatically collect certain technical data (such as IP addresses, browser types, and usage metrics) to ensure our website functions optimally and to analyze visitor trends.</p>
              </div>
            </section>

            <section id="data-usage" ref={(el) => { sectionRefs.current["data-usage"] = el; }}>
              <h2 className="font-aboreto text-3xl mb-6">3. Use of Information</h2>
              <div className="font-worksans text-base leading-relaxed text-[#1A1A1A]/75 space-y-6">
                <p>Your information is primarily used to provide and improve our services. Specifically, we use your data to:</p>
                <ul className="list-disc pl-6 space-y-2 opacity-90">
                  <li>Respond to project inquiries and consultation requests.</li>
                  <li>Draft proposals, contracts, and design briefs.</li>
                  <li>Improve our website&apos;s performance and user experience.</li>
                  <li>Send strictly relevant studio updates, if you have opted in.</li>
                </ul>
              </div>
            </section>

            <section id="cookies" ref={(el) => { sectionRefs.current["cookies"] = el; }}>
              <h2 className="font-aboreto text-3xl mb-6">4. Cookies & Tracking</h2>
              <div className="font-worksans text-base leading-relaxed text-[#1A1A1A]/75 space-y-6">
                <p>We utilize cookies to enhance your browsing experience. Cookies allow us to remember your preferences and understand how you navigate our editorial archives.</p>
                <p>You reserve the right to disable cookies through your browser settings, though this may impact the performance of certain interactive features on our site.</p>
              </div>
            </section>

            <section id="third-parties" ref={(el) => { sectionRefs.current["third-parties"] = el; }}>
              <h2 className="font-aboreto text-3xl mb-6">5. Third-Party Sharing</h2>
              <div className="font-worksans text-base leading-relaxed text-[#1A1A1A]/75 space-y-6">
                <p>We do not sell, trade, or rent your personal identification information to others. We may share generic aggregated demographic information not linked to any personal identification information with our trusted affiliates and advertisers.</p>
              </div>
            </section>

            <section id="rights" ref={(el) => { sectionRefs.current["rights"] = el; }}>
              <h2 className="font-aboreto text-3xl mb-6">6. Your Rights</h2>
              <div className="font-worksans text-base leading-relaxed text-[#1A1A1A]/75 space-y-6">
                <p>You retain the right to request access to, correction of, or deletion of your personal data at any time. To exercise these rights, please contact our studio administration directly.</p>
              </div>
            </section>
          </div>

        </div>
      </div>
      <CTASection />
    </div>
  );
}