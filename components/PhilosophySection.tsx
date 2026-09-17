"use client";

import Image from "next/image";
import LineWaves from "./LineWaves";

const bentoItems = [
  {
    title: "Sculpting Spaces Through Light and Precision",
    body: "Great architecture is not simply constructed, it is felt. We design living art that honors its landscape, lighting and topography",
    image: "/philosophy1.png",
    span: "md:row-span-2",
  },
  {
    title: "Liaison & Regulatory Mastery",
    body: "Ambitious design requires municipal precision. We handle complex zoning, and approvals delivering seamless execution without friction.",
    image: "/philosophy2.png",
    span: "md:row-span-1",
  },
  {
    title: "Architectural & Interior Continuity",
    body: "Uniting architecture, interiors, liaisoning, and consultancy under one practice protects your project's vision across every dimension of the build.",
    image: "/philosophy3.png",
    span: "md:row-span-1",
  },
];

export default function PhilosophySection() {
  return (
    <section
      className="
        relative z-20 w-full overflow-hidden
        bg-[#F2E8D4] px-6 py-16
        md:min-h-[140vh] md:px-12
      "
    >
      {/* Background waves */}
      <div className="pointer-events-none absolute inset-0">
        <LineWaves
          speed={0.2}
          innerLineCount={15}
          outerLineCount={16}
          warpIntensity={0.4}
          rotation={-45}
          edgeFadeWidth={0}
          colorCycleSpeed={1}
          brightness={0.2}
          color1="#f2eade"
          color2="#d3ba92"
          color3="#f8f0e5"
          enableMouseInteraction
          mouseInfluence={1.8}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto w-full max-w-[1600px]">
        <h2 className="mb-10 font-aboreto text-4xl font-bold leading-tight text-neutral-900 md:text-5xl">
          Designing Beyond
          <br />
          The Structure
        </h2>

        <div className="grid grid-cols-1 gap-5 md:min-h-[110vh] md:grid-cols-2 md:grid-rows-2">
          {bentoItems.map((item) => (
            <div
              key={item.title}
              className={`
                ${item.span}
                relative flex min-h-[520px] flex-col overflow-hidden
                rounded-3xl border border-white/10 bg-white/5
                shadow-[0_8px_32px_rgba(0,0,0,0.08)] backdrop-blur-sm
                transition-transform duration-300 hover:scale-[1.015]
                md:min-h-0
                transform-gpu backface-hidden /* CRUCIAL iOS FIX FOR BACKDROP-BLUR */
              `}
            >
              {/* Glass highlight */}
              <div
                className="
                  pointer-events-none absolute inset-0 z-20 rounded-3xl
                  bg-gradient-to-br from-white/40 via-transparent to-transparent
                "
              />

              {/* Text */}
              <div className="relative z-10 shrink-0 p-6 pb-4">
                <h3 className="font-aboreto text-lg font-bold leading-snug text-black">
                  {item.title}
                </h3>
                <p className="mt-2 font-work-sans text-sm leading-relaxed text-neutral-900/90">
                  {item.body}
                </p>
              </div>

              {/* Image */}
              <div className="relative z-10 min-h-[300px] flex-1 md:min-h-0">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}