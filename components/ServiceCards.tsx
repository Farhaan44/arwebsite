"use client";

import { useRef } from "react";
import {
  Compass,
  Sofa,
  ClipboardList,
  Handshake,
  FileCheck2,
  Building2,
  Box,
  HardHat,
} from "lucide-react";

type HueColor = "green" | "brass" | "teal";

type Service = {
  name: string;
  icon: React.ElementType;
  description: string;
  hue: HueColor;
};

const services: Service[] = [
  {
    name: "Architectural Design",
    icon: Compass,
    description: "Concept to construction drawings",
    hue: "green",
  },
  {
    name: "Interior Design",
    icon: Sofa,
    description: "Spatial planning and finishes",
    hue: "brass",
  },
  {
    name: "Project Management",
    icon: ClipboardList,
    description: "Scheduling, budgets, vendors",
    hue: "teal",
  },
  {
    name: "Consultancy",
    icon: Handshake,
    description: "Feasibility and advisory",
    hue: "green",
  },
  {
    name: "Liaisoning",
    icon: FileCheck2,
    description: "Approvals and permits",
    hue: "brass",
  },
  {
    name: "Structural Engineering",
    icon: Building2,
    description: "Load analysis and detailing",
    hue: "teal",
  },
  {
    name: "3D Visualization",
    icon: Box,
    description: "Renders and walkthroughs",
    hue: "brass",
  },
  {
    name: "Site Supervision",
    icon: HardHat,
    description: "On-ground execution checks",
    hue: "green",
  },
];

const HUES: Record<HueColor, { text: string; glow: string }> = {
  green: { text: "#7fb69a", glow: "127,182,154" },
  brass: { text: "#c9a876", glow: "201,168,118" },
  teal: { text: "#6fb3b8", glow: "111,179,184" },
};

function ServiceCard({ name, icon: Icon, description, hue }: Service) {
  const cardRef = useRef<HTMLDivElement>(null);
  const color = HUES[hue];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    card.style.setProperty("--x", `${e.clientX - rect.left}px`);
    card.style.setProperty("--y", `${e.clientY - rect.top}px`);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      tabIndex={0}
      style={{ "--x": "50%", "--y": "50%" } as React.CSSProperties}
      className="group relative flex w-[72%] shrink-0 snap-center flex-col items-center justify-center gap-4 overflow-hidden rounded-2xl border border-white/10 bg-[#0d0f0a] px-6 py-10 text-center transition-colors duration-300 hover:border-white/20 focus-visible:border-white/20 focus-visible:outline-none sm:w-auto sm:shrink sm:py-14"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(320px circle at var(--x) var(--y), rgba(${color.glow},0.16), transparent 70%)`,
        }}
      />

      <Icon
        strokeWidth={1}
        className="relative h-9 w-9 text-neutral-400 transition-colors duration-300"
      />
      <style jsx>{`
        div.group:hover svg {
          color: ${color.text};
        }
      `}</style>
      <div className="relative">
        <h3 className="text-base font-normal text-neutral-100">{name}</h3>
        <p className="mt-1.5 text-sm text-neutral-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          {description}
        </p>
      </div>
    </div>
  );
}

export default function ServicesSection() {
  return (
    <section className="relative overflow-hidden bg-[#0a0c08] px-6 py-24 sm:px-10 lg:px-16">
      <div className="aurora-layer pointer-events-none absolute inset-0 overflow-hidden">
        <div className="aurora-a absolute -top-40 left-[10%] h-[36rem] w-[36rem] rounded-full bg-[#4d7c5f] opacity-[0.22] blur-[90px] mix-blend-screen" />
        <div className="aurora-b absolute -top-24 right-[8%] h-[30rem] w-[30rem] rounded-full bg-[#b08d57] opacity-[0.18] blur-[90px] mix-blend-screen" />
        <div className="aurora-c absolute top-1/4 left-1/2 h-[26rem] w-[26rem] -translate-x-1/2 rounded-full bg-[#3a6b6f] opacity-[0.18] blur-[90px] mix-blend-screen" />
        <div className="aurora-d absolute bottom-[-10rem] left-[30%] h-[24rem] w-[24rem] rounded-full bg-[#5a8f6a] opacity-[0.14] blur-[90px] mix-blend-screen" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        <div className="max-w-2xl">
          {/* Added Header Here */}
          <h2 className="mb-6 font-aboreto font-bold text-4xl tracking-wide text-neutral-100 sm:text-5xl lg:text-6xl">
            Why Choose Us
          </h2>
          <p className="text-lg leading-relaxed text-neutral-300 sm:text-xl">
            We bring architectural design, interior refinement, municipal liaisoning, and project consultancy under one complete umbrella. By seamlessly integrating every legal, spatial, and technical discipline within a single principal-led workflow, we eliminate the friction of managing separate vendors, ensuring your vision is executed with absolute precision, total discretion, and unbroken continuity.
          </p>
        </div>

        <div className="no-scrollbar mt-16 -mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-5 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-4">
          {services.map((service) => (
            <ServiceCard key={service.name} {...service} />
          ))}
        </div>

        <p className="mt-3 text-xs text-neutral-600 sm:hidden">
          Swipe to see all services →
        </p>
      </div>

      <style jsx>{`
        @keyframes driftA {
          0% {
            transform: translate(0, 0) scale(1) rotate(0deg);
          }
          33% {
            transform: translate(8%, 10%) scale(1.15) rotate(8deg);
          }
          66% {
            transform: translate(-4%, 14%) scale(0.95) rotate(-6deg);
          }
          100% {
            transform: translate(0, 0) scale(1) rotate(0deg);
          }
        }
        @keyframes driftB {
          0% {
            transform: translate(0, 0) scale(1) rotate(0deg);
          }
          40% {
            transform: translate(-10%, 8%) scale(1.1) rotate(-10deg);
          }
          75% {
            transform: translate(6%, -6%) scale(0.92) rotate(6deg);
          }
          100% {
            transform: translate(0, 0) scale(1) rotate(0deg);
          }
        }
        @keyframes driftC {
          0% {
            transform: translate(-50%, 0) scale(1) rotate(0deg);
          }
          50% {
            transform: translate(-46%, -12%) scale(1.2) rotate(12deg);
          }
          100% {
            transform: translate(-50%, 0) scale(1) rotate(0deg);
          }
        }
        @keyframes driftD {
          0% {
            transform: translate(0, 0) scale(1);
          }
          50% {
            transform: translate(10%, -10%) scale(1.12);
          }
          100% {
            transform: translate(0, 0) scale(1);
          }
        }
        .aurora-layer {
          contain: layout style paint;
        }
        .aurora-a,
        .aurora-b,
        .aurora-c,
        .aurora-d {
          will-change: transform;
          transform: translateZ(0);
          backface-visibility: hidden;
        }
        .aurora-a {
          animation: driftA 14s ease-in-out infinite;
        }
        .aurora-b {
          animation: driftB 17s ease-in-out infinite;
        }
        .aurora-c {
          animation: driftC 20s ease-in-out infinite;
        }
        .aurora-d {
          animation: driftD 12s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .aurora-a,
          .aurora-b,
          .aurora-c,
          .aurora-d {
            animation: none;
          }
        }
        .no-scrollbar {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}