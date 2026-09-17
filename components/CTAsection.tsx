"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"

// Shared brand palette - keep these in sync with the rest of the site
// (AlliancePartners, etc.) so accents match everywhere.
const COLORS = {
  ink: "#1A1A1A",
  gold: "#9C8355",
  goldLight: "#C9AF7E",
}

export function CTASection() {
  const [partnerHovered, setPartnerHovered] = useState(false)
  const [contactHovered, setContactHovered] = useState(false)

  return (
    <section
      style={{
        position: "relative",
        // Fluid height: 60vh on normal screens, never smaller than 400px, caps at 800px on 4K
        minHeight: "clamp(400px, 60vh, 800px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {/* Background Image Wrapper */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        <Image
          // Replace this src with your actual interior image path
          src="/ctabg.png"
          alt="Luxury Interior Design"
          fill
          style={{ objectFit: "cover" }}
          sizes="100vw"
        />

        {/* Darkening Overlay, tinted with brand ink for text readability */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(to bottom, ${COLORS.ink}66, ${COLORS.ink}99)`,
          }}
        />
      </div>

      {/* Content Container */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          textAlign: "center",
          padding: "0 clamp(20px, 5vw, 80px)",
          maxWidth: "1200px",
          width: "100%",
        }}
      >
        {/* Heading - Aboreto, matches the rest of the site's headings */}
        <h2
          className="font-aboreto"
          style={{
            fontWeight: 400,
            fontSize: "clamp(28px, 4vw, 56px)",
            color: "#ffffff",
            letterSpacing: "0.02em",
            marginBottom: "clamp(16px, 2vw, 24px)",
            lineHeight: 1.2,
          }}
        >
          Turn your ideas into reality
        </h2>

        {/* Subheading - stays in the body font, not Aboreto */}
        <p
          style={{
            fontSize: "clamp(13px, 1.5vw, 18px)",
            color: "rgba(255, 255, 255, 0.85)",
            marginBottom: "clamp(40px, 5vw, 64px)",
            lineHeight: 1.6,
            maxWidth: "700px",
            marginInline: "auto",
            fontWeight: 300,
          }}
        >
          We welcome collaborators, investors, and customers to reach out to us.
        </p>

        {/* CTA Buttons Container - font intentionally left as-is (not Aboreto) */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "clamp(32px, 4vw, 64px)", // Scales gap dynamically
            flexWrap: "wrap", // Stacks nicely on tiny mobile screens
          }}
        >
          {/* Contact Us Link */}
          <Link
            href="/contact"
            onMouseEnter={() => setContactHovered(true)}
            onMouseLeave={() => setContactHovered(false)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "0 0 4px 0", // Padding for bottom border
              borderBottom: `1px solid ${contactHovered ? COLORS.goldLight : "rgba(255,255,255,0.4)"}`,
              transition: "border-color 0.4s ease, color 0.4s ease",
              color: contactHovered ? COLORS.goldLight : "#ffffff",
              fontSize: "clamp(12px, 1.4vw, 18px)",
              fontWeight: 400,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              fontFamily: "inherit",
              textDecoration: "none", // Added to remove default link underline
            }}
          >
            Contact
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                transform: contactHovered ? "translate(2px, -2px)" : "translate(0,0)",
                transition: "transform 0.3s ease, color 0.3s ease",
              }}
            >
              <line x1="7" y1="17" x2="17" y2="7" />
              <polyline points="7 7 17 7 17 17" />
            </svg>
          </Link>

          {/* Partner With Us Link */}
          <Link
            href="/about"
            onMouseEnter={() => setPartnerHovered(true)}
            onMouseLeave={() => setPartnerHovered(false)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "0 0 4px 0", // Padding for bottom border
              borderBottom: `1px solid ${partnerHovered ? COLORS.goldLight : "rgba(255,255,255,0.4)"}`,
              transition: "border-color 0.4s ease, color 0.4s ease",
              color: partnerHovered ? COLORS.goldLight : "#ffffff",
              fontSize: "clamp(12px, 1.4vw, 18px)",
              fontWeight: 400,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              fontFamily: "inherit",
              textDecoration: "none", // Added to remove default link underline
            }}
          >
            About
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                transform: partnerHovered ? "translate(2px, -2px)" : "translate(0,0)",
                transition: "transform 0.3s ease, color 0.3s ease",
              }}
            >
              <line x1="7" y1="17" x2="17" y2="7" />
              <polyline points="7 7 17 7 17 17" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}