"use client";

import { useState } from "react";

/**
 * AlliancePartners - Strategic Partners section
 *
 * Two separate presentations, split by breakpoint - not one effect
 * reused everywhere:
 *
 *  - DESKTOP (md and up): the original infinite marquee, unchanged.
 *    The PARTNERS array is rendered twice back to back inside one
 *    flex track, animated from translateX(0) to translateX(-50%) -
 *    i.e. exactly the width of one full copy of the list - on an
 *    infinite linear loop. Because the second copy is identical to
 *    the first, the moment it snaps back to 0% it looks visually
 *    identical to where it just was, so the loop is seamless with no
 *    visible jump. Hovering (or focusing, for keyboard users) a tile
 *    pauses the whole strip and reveals that tile's credential/
 *    description via the signature-line reveal.
 *
 *  - MOBILE (below md): a plain, native horizontally-scrollable row
 *    with CSS scroll-snap. No animation, no JS scroll math - the
 *    browser's own swipe handling does the work, and each card snaps
 *    to center wherever the user stops swiping. Tapping a card
 *    reveals its description the same way.
 *
 * Both variants are always mounted (Tailwind's `md:` classes decide
 * which is visible) so server and client markup match exactly - no
 * hydration branching on viewport size.
 *
 * PLACEHOLDERS: name, credential, description, logoSrc, and bgSrc
 * below are all placeholder content - replace with real partner
 * details, logos, and background images.
 */

type Partner = {
  id: string;
  role: string;
  name: string;
  credential: string;
  description: string;
  logoSrc: string;
  bgSrc: string;
};

const PARTNERS: Partner[] = [
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

// Desktop only: two back-to-back copies so the track can loop from
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

function PartnerCard({
  partner,
  isActive,
  onEnter,
  onLeave,
  className = "",
}: {
  partner: Partner;
  isActive: boolean;
  onEnter: () => void;
  onLeave: () => void;
  className?: string;
}) {
  return (
    <div
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onFocus={onEnter}
      onBlur={onLeave}
      onClick={() => (isActive ? onLeave() : onEnter())}
      tabIndex={0}
      className={`group relative flex h-[420px] w-[280px] shrink-0 flex-col items-center justify-center overflow-hidden rounded-2xl px-8 text-center outline-none cursor-pointer sm:w-[320px] sm:px-10 md:h-[460px] md:w-[380px] ${className}`}
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
}

/* ------------------------------------------------------------------ */
/* Desktop — original infinite marquee, unchanged                     */
/* ------------------------------------------------------------------ */

function DesktopMarquee() {
  const [activeSlot, setActiveSlot] = useState<number | null>(null);
  const isPaused = activeSlot !== null;

  return (
    <div className="relative">
      <div className="partner-track flex gap-8 md:gap-14" data-paused={isPaused}>
        {TRACK_PARTNERS.map((partner, slot) => (
          <PartnerCard
            key={`${partner.id}-${slot}`}
            partner={partner}
            isActive={activeSlot === slot}
            onEnter={() => setActiveSlot(slot)}
            onLeave={() => setActiveSlot((current) => (current === slot ? null : current))}
          />
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Mobile — native swipeable / scroll-snap list                       */
/* ------------------------------------------------------------------ */

function MobileSwipeList() {
  const [activeSlot, setActiveSlot] = useState<number | null>(null);

  return (
    <div className="partner-scroller flex gap-8 overflow-x-auto px-8 pb-2">
      {PARTNERS.map((partner, slot) => (
        <PartnerCard
          key={partner.id}
          partner={partner}
          isActive={activeSlot === slot}
          onEnter={() => setActiveSlot(slot)}
          onLeave={() => setActiveSlot((current) => (current === slot ? null : current))}
          className="partner-card"
        />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Entry point                                                        */
/* ------------------------------------------------------------------ */

export default function AlliancePartners() {
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
        .partner-scroller {
          scroll-snap-type: x mandatory;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
        }
        .partner-scroller::-webkit-scrollbar {
          display: none;
        }
        .partner-card {
          scroll-snap-align: center;
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

      {/* Both variants are always mounted; Tailwind's `md:` classes decide
          which one is visible, keeping server/client markup identical. */}
      <div className="hidden md:block">
        <DesktopMarquee />
      </div>
      <div className="md:hidden">
        <MobileSwipeList />
      </div>
    </section>
  );
}