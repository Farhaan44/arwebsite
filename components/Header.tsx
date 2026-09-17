"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Navbar,
  NavBody,
  NavItems,
  NavbarButton,
  MobileNav,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/resizable-navbar";

const navLinks = [
  { name: "Home", link: "/" },
  { name: "Services", link: "/service" },
  { name: "Projects", link: "/project" },
  { name: "About", link: "/about" },
];

export default function Header() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (link: string) =>
    link === "/" ? pathname === "/" : pathname === link || pathname.startsWith(`${link}/`);

  // Navbar is now permanently in the "scrolled" pill state,
  // so these are constants instead of scroll-derived values.
  const logoSrc = "/asawhite.svg";
  const textColorClass = "text-white";

  return (
    <Navbar className="top-0 fixed">
      {/* Desktop Navigation */}
      <NavBody>
        <Link href="/" className="relative z-20 mr-4 flex items-center px-2 py-1">
          <Image
            src={logoSrc}
            alt="Logo"
            width={563}
            height={223}
            className="w-auto h-8 transition-all duration-300"
            priority
          />
        </Link>

        <NavItems
          items={navLinks}
          activePath={pathname}
          className={cn("text-base font-sans", textColorClass)}
        />

        <div className="flex items-center space-x-2">
          <NavbarButton
            as={Link}
            variant="primary"
            href="/contact"
            className="text-base text-sm [-webkit-text-stroke:0.4px_currentColor] font-aboreto"
          >
            Contact Now
          </NavbarButton>
        </div>
      </NavBody>

      {/* Mobile Navigation */}
      <MobileNav>
        <MobileNavHeader>
          <Link href="/" className="relative z-20 flex items-center px-2 py-1">
            <Image
              src={logoSrc}
              alt="Logo"
              width={563}
              height={223}
              className="w-auto h-8 transition-all duration-300"
              priority
            />
          </Link>

          <MobileNavToggle
            isOpen={isMobileOpen}
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className={textColorClass}
          />
        </MobileNavHeader>

        <MobileNavMenu
          isOpen={isMobileOpen}
          onClose={() => setIsMobileOpen(false)}
        >
          <div className="flex flex-col space-y-4 w-full">
            {navLinks.map((item, idx) => (
              <Link
                key={idx}
                href={item.link}
                onClick={() => setIsMobileOpen(false)}
                className={cn(
                  "text-lg font-sans font-medium transition-colors",
                  isActive(item.link)
                    ? "text-[#db7210]"
                    : "text-neutral-800 dark:text-neutral-200 hover:text-black dark:hover:text-white",
                )}
              >
                {item.name}
              </Link>
            ))}
            <hr className="border-neutral-200/50 dark:border-neutral-800/50 my-2" />
            <NavbarButton
              as={Link}
              variant="primary"
              href="/contact"
              onClick={() => setIsMobileOpen(false)}
              className="w-full text-lg font-sans"
            >
              Contact Now
            </NavbarButton>
          </div>
        </MobileNavMenu>
      </MobileNav>
    </Navbar>
  );
}