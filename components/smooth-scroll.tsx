"use client";

import { ReactNode, useEffect } from "react";
import { ReactLenis, useLenis } from "lenis/react";
import { usePathname } from "next/navigation";

function LenisRouteSync() {
  const lenis = useLenis();
  const pathname = usePathname();

  useEffect(() => {
    if (!lenis) return;

    // New page content can be a different height than whatever was
    // previously mounted. Lenis caches scroll bounds internally, so
    // without this it keeps using the old (now stale) height — that's
    // what causes scroll to "stick" partway down after navigating.
    lenis.resize();

    // Also reset to top, otherwise you can land on the new page already
    // scrolled to wherever the old page's scroll position was.
    lenis.scrollTo(0, { immediate: true });
  }, [pathname, lenis]);

  return null;
}

export default function SmoothScroll({ children }: { children: ReactNode }) {
  return (
    <ReactLenis
      root
      options={{
        duration: 1.8,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: "vertical",
        gestureOrientation: "vertical",
        smoothWheel: true,
        wheelMultiplier: 0.9,
        touchMultiplier: 1.5,
      }}
    >
      <LenisRouteSync />
      {children}
    </ReactLenis>
  );
}