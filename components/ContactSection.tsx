"use client";

import React, { useState } from "react";
import MorphSlider from "./MorphSlider";

// ---------------------------------------------------------------------------
// Theme & Data
// ---------------------------------------------------------------------------

const sliderItems = [
  {
    image: "skysuite.jpeg",
    caption: "Concept",
  },
  {
    image: "work1.jpg",
    caption: "Process",
  },
  {
    image: "veneercabin2.jpg",
    caption: "Execution",
  },
];

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export default function ContactSection() {
  // --- Form State Management ---
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("submitting");

    const formData = new FormData(e.currentTarget);
    // Add the Web3Forms access key from your environment variables
    formData.append("access_key", process.env.NEXT_PUBLIC_WEB3FORMS_KEY as string);
    // Optional: Set a custom subject line for your inbox
    formData.append("subject", "New Studio Inquiry from Website");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setStatus("success");
        (e.target as HTMLFormElement).reset(); // Clear the form
        // Reset button after 4 seconds
        setTimeout(() => setStatus("idle"), 4000);
      } else {
        setStatus("error");
        setTimeout(() => setStatus("idle"), 4000);
      }
    } catch (error) {
      console.error(error);
      setStatus("error");
      setTimeout(() => setStatus("idle"), 4000);
    }
  };

  return (
    <section
      id="contact"
      className="relative w-full min-h-screen overflow-hidden bg-black text-white"
    >
      <style>{`
        .font-aboreto { font-family: var(--font-aboreto), serif; }
        .font-worksans { font-family: var(--font-work-sans), sans-serif; }
      `}</style>

      {/* 1. Full-Screen Background Slider */}
      <div className="absolute inset-0 z-0 [&_.morph-slider-controls]:hidden">
        <MorphSlider
          items={sliderItems}
          transition="melt"
          intensity={0.55}
          aberration={0.35}
          drift={0.4}
          autoplay={true}
          overlayColor="#05060a"
          duration={1.1}
          ease="power2.inOut"
          scale={2.4}
          autoplayDelay={5}
          loop
          radius={0}
          showCaptions={false}
          showControls={true}
          showIndicators={false}
          className="w-full h-full"
        />
      </div>

      <div className="absolute inset-0 z-0 bg-black/40 pointer-events-none" />
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent pointer-events-none" />

      {/* 2. Content Grid */}
      <div
        className="relative z-10 mx-auto max-w-7xl px-6 pt-32 pb-16 sm:pt-28 md:px-12 md:pt-32 md:pb-28 lg:px-16 lg:py-28 min-h-screen items-center
        grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16
        [grid-template-areas:'heading'_'form'_'info']
        lg:[grid-template-areas:'heading_form'_'info_form']"
      >
        {/* ===== HEADING BLOCK ===== */}
        <div className="[grid-area:heading] flex flex-col justify-center">
          <h2 className="font-aboreto text-[10vw] sm:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight text-white break-words">
            Start a<br /> Conversation
          </h2>

          <p className="font-worksans mt-8 max-w-md text-base leading-relaxed sm:text-lg text-white/80">
            Whether you have a specific project in mind or simply want to
            explore possibilities, we are ready to listen. Every great space
            begins with a single dialogue.
          </p>
        </div>

        {/* ===== FORM BLOCK ===== */}
        <div className="[grid-area:form] flex w-full flex-col justify-center items-center lg:items-end">
          <div
            className="w-full max-w-md rounded-xl border p-8 sm:p-10 backdrop-blur-md"
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.45)',
              borderColor: 'rgba(255, 255, 255, 0.15)',
              color: '#ffffff'
            }}
          >
            <h3 className="font-aboreto text-2xl mb-8">Inquire</h3>

            <form className="font-worksans flex flex-col gap-6" onSubmit={handleSubmit}>

              {/* Added required honeypot field to prevent spam */}
              <input type="checkbox" name="botcheck" className="hidden" style={{ display: 'none' }} />

              <div className="relative">
                <input
                  type="text"
                  id="name"
                  name="name" // Required for Web3Forms
                  required
                  placeholder=" "
                  className="peer w-full bg-transparent border-b border-white/20 py-3 text-sm focus:border-white focus:outline-none transition-colors"
                />
                <label
                  htmlFor="name"
                  className="absolute left-0 top-3 text-sm text-white/50 transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-3 peer-focus:-top-3 peer-focus:text-[10px] peer-focus:text-white uppercase tracking-widest peer-valid:-top-3 peer-valid:text-[10px]"
                >
                  Your Name
                </label>
              </div>

              <div className="relative mt-2">
                <input
                  type="email"
                  id="email"
                  name="email" // Required for Web3Forms
                  required
                  placeholder=" "
                  className="peer w-full bg-transparent border-b border-white/20 py-3 text-sm focus:border-white focus:outline-none transition-colors"
                />
                <label
                  htmlFor="email"
                  className="absolute left-0 top-3 text-sm text-white/50 transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-3 peer-focus:-top-3 peer-focus:text-[10px] peer-focus:text-white uppercase tracking-widest peer-valid:-top-3 peer-valid:text-[10px]"
                >
                  Email Address
                </label>
              </div>

              <div className="relative mt-2">
                <input
                  type="tel"
                  id="phone"
                  name="phone" // Required for Web3Forms
                  required
                  placeholder=" "
                  className="peer w-full bg-transparent border-b border-white/20 py-3 text-sm focus:border-white focus:outline-none transition-colors"
                />
                <label
                  htmlFor="phone"
                  className="absolute left-0 top-3 text-sm text-white/50 transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-3 peer-focus:-top-3 peer-focus:text-[10px] peer-focus:text-white uppercase tracking-widest peer-valid:-top-3 peer-valid:text-[10px]"
                >
                  Contact No.
                </label>
              </div>

              <div className="relative mt-2">
                <textarea
                  id="message"
                  name="message" // Required for Web3Forms
                  required
                  rows={4}
                  placeholder=" "
                  className="peer w-full resize-none bg-transparent border-b border-white/20 py-3 text-sm focus:border-white focus:outline-none transition-colors"
                />
                <label
                  htmlFor="message"
                  className="absolute left-0 top-3 text-sm text-white/50 transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-3 peer-focus:-top-4 peer-focus:text-[10px] peer-focus:text-white uppercase tracking-widest peer-valid:-top-4 peer-valid:text-[10px]"
                >
                  Message
                </label>
              </div>

              <button
                type="submit"
                disabled={status === "submitting" || status === "success"}
                className={`font-aboreto mt-6 w-full border py-4 text-xs uppercase tracking-[0.2em] transition-all ${
                  status === "success"
                    ? "border-green-500/50 bg-green-500/10 text-green-400"
                    : status === "error"
                    ? "border-red-500/50 bg-red-500/10 text-red-400"
                    : "border-white/30 hover:bg-white hover:text-black disabled:opacity-50"
                }`}
              >
                {status === "idle" && "Send Message"}
                {status === "submitting" && "Sending..."}
                {status === "success" && "Message Sent"}
                {status === "error" && "Error Sending"}
              </button>
            </form>
          </div>
        </div>

        {/* ===== INFO BLOCK ===== */}
        <div className="[grid-area:info] grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-1 lg:gap-12 content-center">
          <div>
            <h4 className="font-aboreto mb-3 text-xs uppercase tracking-[0.2em] text-white/50">
              Location
            </h4>
            <p className="font-worksans text-sm leading-relaxed sm:text-base text-white/90">
              1st Floor, Anzar Residency
              <br />
              Madhavrao Gangan St., Agripada
              <br />
              Mumbai-400011.
            </p>
          </div>

          <div>
            <h4 className="font-aboreto mb-3 text-xs uppercase tracking-[0.2em] text-white/50">
              Direct
            </h4>
            <p className="font-worksans text-sm leading-relaxed sm:text-base text-white/90">
              <a href="tel:+919167577544" className="hover:text-white/60 transition-colors">
                +91 9167577544
              </a>
              <br />
              <a href="mailto:contact@architectshahbazahmed.com" className="hover:text-white/60 transition-colors">
                contact@architectshahbazahmed.com
              </a>
            </p>
          </div>

          <div>
            <h4 className="font-aboreto mb-3 text-xs uppercase tracking-[0.2em] text-white/50">
              Socials
            </h4>
            <div className="font-worksans flex gap-6 text-sm sm:text-base text-white/90">
              <a href="#" className="hover:text-white/60 transition-colors">Facebook</a>
              <a href="#" className="hover:text-white/60 transition-colors">LinkedIn</a>
              <a href="#" className="hover:text-white/60 transition-colors">Instagram</a>
            </div>
          </div>
        </div>
      </div>

      {/* ===== 3. Custom Image Switcher Arrow ===== */}
      <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center justify-center sm:bottom-10">
        <button
          type="button"
          onClick={() => {
            const nextBtn = document.querySelectorAll('.morph-slider-btn')[1] as HTMLButtonElement;
            if (nextBtn) nextBtn.click();
          }}
          className="group flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-black/20 text-white backdrop-blur-md transition-all hover:bg-white hover:text-black"
          aria-label="Next Image"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-5 w-5 transition-transform group-hover:translate-x-0.5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      </div>
    </section>
  );
}