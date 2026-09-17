"use client";

import { useState } from "react";

/**
 * AlliancePartners - Strategic Partners section
 *
 * INFINITE MARQUEE PASS
 * The whole row of partner tiles now scrolls left, continuously and
 * infinitely, as a single strip - same behavior on desktop and mobile
 * (no more stacked-on-mobile layout). Each tile carries its own
 * darkened background image with white text/logo on top.
 *
 * How the loop works: the PARTNERS array is rendered twice back to
 * back inside one flex track. The track is animated from
 * translateX(0) to translateX(-50%) - i.e. exactly the width of one
 * full copy of the list - on an infinite linear loop. Because the
 * second copy is identical to the first, the moment it snaps back to
 * 0% it looks visually identical to where it just was, so the loop is
 * seamless with no visible jump.
 *
 * Interaction: hovering (desktop) or tapping/focusing (mobile/keyboard)
 * a tile pauses the *entire* strip - so the reader isn't chasing a
 * moving card - and reveals that tile's credential/description via
 * the same signature-line reveal as before.
 *
 * PLACEHOLDERS: name, credential, description, logoSrc, and bgSrc
 * below are all placeholder content - replace with real partner
 * details, logos, and background images.
 */

const PARTNERS = [
  {
    id: "legal",
    role: "Legal Partner",
    name: "Adv. Rajendra Rathod", 
    credential: "Corporate & Real Estate Law",
    description:
      "Led by the esteemed Adv. Rajendra Rathod, Legal India provides uncompromising counsel across our portfolio. Their profound expertise in real estate law, corporate structuring, and rigorous regulatory compliance ensures that every development rests on a foundation of absolute security and transparency.",
    logoSrc: "/partnerlogo2.png", 
    bgSrc: "/partner1.png", 
  },
  {
    id: "development",
    role: "Development Partner",
    name: "Numara Group", 
    credential: "Real Estate Developers",
    description:
      "A vanguard in luxury real estate, Numara Group collaborates with us to execute visionary residential and mixed-use developments. From strategic land acquisition to meticulous final execution, their development prowess aligns seamlessly with our commitment to delivering landmark properties of enduring value.",
    logoSrc: "/numarabrownlogo.png", 
    bgSrc: "/partner2.avif", 
  },
  {
    id: "architecture",
    role: "Architecture Partner",
    name: "Legion Architects", 
    credential: "Design & Master Planning",
    description:
      "Masters of spatial narrative and structural elegance, Legion Architects shapes the defining aesthetic of our skyline. Their rigorous approach to master planning, facade engineering, and site-integrated design ensures each edifice stands as a timeless architectural statement.",
    logoSrc: "/partnerlogo3.png", 
    bgSrc: "/partner3.jpg", 
  },
];

// Render two back-to-back copies of the list so the track can loop from
// translateX(0) to translateX(-50%) with no visible seam.
const TRACK_PARTNERS = [...PARTNERS, ...PARTNERS];

// Signature-line length in the SVG's local coordinate space; matches viewBox width.
const LINE_LENGTH = 160;

function SignatureLine({ active }: { active: boolean }) {
  return (
    <svg
      width="100%"
      viewBox={`0 0 ${LINE_LENGTH} 2`}
      preserveAspectRatio="none"
      className="h-px w-full max-w-[160px]"
      aria-hidden
    >
      <line
        x1="0"
        y1="1"
        x2={LINE_LENGTH}
        y2="1"
        stroke="#9C8355"
        strokeWidth="1"
        style={{
          strokeDasharray: LINE_LENGTH,
          strokeDashoffset: active ? 0 : LINE_LENGTH,
          transition: "stroke-dashoffset 900ms cubic-bezier(0.22,1,0.36,1)",
        }}
      />
    </svg>
  );
}

export default function AlliancePartners() {
  // Which tile (by its position in the doubled TRACK_PARTNERS array) is
  // currently active. Any active tile pauses the whole strip.
  const [activeSlot, setActiveSlot] = useState<number | null>(null);
  const isPaused = activeSlot !== null;

  return (
    <section className="w-full bg-[#F2E8D4] text-[#1A1A1A] pt-10 pb-24 md:pt-14 md:pb-32 border-t border-[#1A1A1A]/12 overflow-hidden">
      <style>{`
        @keyframes partnerMarquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .partner-track {
          width: max-content;
          animation: partnerMarquee 60s linear infinite;
        }
        .partner-track[data-paused="true"] {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          .partner-desc { transition: none !important; }
          .partner-track { animation: none !important; }
        }
      `}</style>

      {/* ===== Section Header ===== */}
      <div className="px-8 md:px-16 lg:px-24 mb-8 md:mb-12">
        <h2 className="font-aboreto text-4xl md:text-6xl">Strategic Partners</h2>
      </div>

      {/* ===== Infinite marquee strip (all breakpoints) ===== */}
      <div className="relative">
        <div className="partner-track flex gap-8 md:gap-14" data-paused={isPaused}>
          {TRACK_PARTNERS.map((partner, slot) => {
            const isActive = activeSlot === slot;

            return (
              <div
                key={`${partner.id}-${slot}`}
                onMouseEnter={() => setActiveSlot(slot)}
                onMouseLeave={() => setActiveSlot((current) => (current === slot ? null : current))}
                onFocus={() => setActiveSlot(slot)}
                onBlur={() => setActiveSlot((current) => (current === slot ? null : current))}
                onClick={() => setActiveSlot((current) => (current === slot ? null : slot))}
                tabIndex={0}
                className="group relative flex h-[420px] w-[280px] shrink-0 flex-col items-center justify-center overflow-hidden rounded-2xl px-8 text-center outline-none cursor-pointer sm:w-[320px] sm:px-10 md:h-[460px] md:w-[380px]"
              >
                {/* Darkened background image */}
                <img
                  src={partner.bgSrc}
                  alt=""
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 h-full w-full object-cover"
                  style={{ filter: "grayscale(0.2)" }}
                />
                <div className="pointer-events-none absolute inset-0 bg-black/60" />

                {/* Content */}
                <div className="relative z-10 flex flex-col items-center">
                  <img
                    src={partner.logoSrc}
                    alt={partner.name}
                    className="mb-9 h-16 w-auto object-contain"
                    style={{ filter: "brightness(0) invert(1)", opacity: 0.9 }}
                  />

                  <h3 className="font-aboreto text-3xl text-white md:text-4xl">{partner.name}</h3>

                  <span className="mt-3 font-mono text-sm uppercase tracking-[0.2em] text-white/60">
                    {partner.role}
                  </span>

                  <div className="mt-7 flex justify-center">
                    <SignatureLine active={isActive} />
                  </div>

                  <div
                    className="partner-desc overflow-hidden"
                    style={{
                      maxHeight: isActive ? "220px" : "0px",
                      opacity: isActive ? 1 : 0,
                      transition: "max-height 600ms cubic-bezier(0.22,1,0.36,1), opacity 450ms ease",
                    }}
                  >
                    <span className="mt-7 mb-3 block font-mono text-[11px] uppercase tracking-[0.2em] text-[#C9AF7E]">
                      {partner.credential}
                    </span>
                    <p className="max-w-[260px] font-light text-base leading-relaxed text-white/75">
                      {partner.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}