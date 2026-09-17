"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

type CraftSectionProps = {
  /** Use \n for line breaks. */
  title: string;
  paragraphs: string[];
  imageSrc: string;
  imageAlt?: string;
};

export default function CraftSection({
  title,
  paragraphs,
  imageSrc,
  imageAlt = "",
}: CraftSectionProps) {
  const titleLines = title.split("\n");
  const sectionRef = useRef<HTMLElement>(null);

  // Track scroll progress of the section relative to the viewport
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Moves text vertically from +80px to -80px as you scroll through the section
  const textY = useTransform(scrollYProgress, [0, 1], ["80px", "-80px"]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[175vh] w-full overflow-hidden bg-black"
    >
      {/* Background photo */}
      <img
        src={imageSrc}
        alt={imageAlt}
        className="absolute inset-0 h-full w-full object-cover object-[30%_center] lg:object-center"
      />

      {/* Mobile/tablet overlay */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 lg:hidden"
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.35) 45%, rgba(0,0,0,0) 75%)",
        }}
      />

      {/* Desktop overlay */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 hidden lg:block"
        style={{
          background:
            "linear-gradient(to right, rgba(0,0,0,0) 35%, rgba(0,0,0,0.55) 65%, rgba(0,0,0,0.75) 100%)",
        }}
      />

      {/* Content Container */}
      <div className="relative z-10 flex min-h-[130vh] w-full flex-col justify-end p-6 pb-12 sm:p-10 sm:pb-16 lg:flex-row lg:items-center lg:justify-end lg:p-16">
        {/* Parallax Text Wrapper */}
        <motion.div style={{ y: textY }} className="w-full lg:w-[46%]">
          <h2 className="font-aboreto text-4xl leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl">
            {titleLines.map((line, i) => (
              <span key={i} className="block">
                {line}
              </span>
            ))}
          </h2>

          <div className="mt-8 space-y-6 sm:mt-10">
            {paragraphs.map((paragraph, i) => (
              <p
                key={i}
                className="font-sans text-base leading-relaxed text-white/90 sm:text-lg"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}