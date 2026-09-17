"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const LOCATIONS = [
  { id: 1, type: "office" as const, name: "Anzar Residency", city: "Mumbai", status: "Office", lat: 18.974137560541465, lng: 72.82568127587717 },
];

// Minimal structural types for the pieces of the Leaflet API this component
// touches. Leaflet is loaded at runtime from a CDN script rather than
// imported, so we describe just enough of its shape instead of depending on
// @types/leaflet being installed.
interface LeafletToggle {
  enable: () => void;
  disable: () => void;
}

interface LeafletPopupLike {
  getElement: () => HTMLElement | null;
}

interface LeafletPopupOpenEvent {
  popup: LeafletPopupLike;
}

interface LeafletMap {
  on: (event: string, handler: (e: unknown) => void) => void;
  remove: () => void;
  invalidateSize: () => void;
  scrollWheelZoom: LeafletToggle;
  dragging: LeafletToggle;
  touchZoom: LeafletToggle;
  doubleClickZoom: LeafletToggle;
  boxZoom: LeafletToggle;
  keyboard: LeafletToggle;
}

interface LeafletLayer {
  addTo: (map: LeafletMap) => LeafletLayer;
}

interface LeafletMarker {
  addTo: (map: LeafletMap) => LeafletMarker;
  bindPopup: (html: string, options?: { maxWidth?: number; className?: string }) => LeafletMarker;
  openPopup: () => void;
}

interface LeafletStatic {
  map: (
    el: HTMLElement,
    options: {
      center: [number, number];
      zoom: number;
      zoomControl: boolean;
      scrollWheelZoom: boolean;
      dragging: boolean;
      touchZoom: boolean;
      doubleClickZoom: boolean;
      boxZoom: boolean;
      keyboard: boolean;
    }
  ) => LeafletMap;
  tileLayer: (url: string, options: { attribution: string; maxZoom: number }) => LeafletLayer;
  control: {
    zoom: (options: { position: string }) => LeafletLayer;
  };
  marker: (latlng: [number, number], options: { icon: unknown }) => LeafletMarker;
  divIcon: (options: {
    html: string;
    className: string;
    iconSize: [number, number];
    iconAnchor: [number, number];
    popupAnchor: [number, number];
  }) => unknown;
}

declare global {
  interface Window {
    L?: LeafletStatic;
  }
}

export default function ContactMapSection() {
  const wrapRef    = useRef<HTMLDivElement>(null);
  const mapRef     = useRef<HTMLDivElement>(null);
  const leafletRef = useRef<LeafletMap | null>(null);
  const [active, setActive] = useState(false);

  const initMap = useCallback((L: LeafletStatic) => {
    if (!mapRef.current || leafletRef.current) return;

    const map = L.map(mapRef.current, {
      center: [18.974137560541465, 72.82568127587717],
      zoom: 17,
      zoomControl: false,
      // Every interaction that can hijack a scroll/swipe gesture starts
      // disabled. They're only turned on once the visitor deliberately
      // activates the map (see the `active` effect below), which is what
      // stops the page from "catapulting" when a mouse-wheel scroll or a
      // touch-scroll passes over the embedded map.
      scrollWheelZoom: false,
      dragging: false,
      touchZoom: false,
      doubleClickZoom: false,
      boxZoom: false,
      keyboard: false,
    });

    leafletRef.current = map;

    // Warm-toned map tiles via OpenStreetMap
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    L.control.zoom({ position: "bottomright" }).addTo(map);

    // Leaflet's popup class always attaches a 'wheel' listener to the popup
    // content that calls stopPropagation() (to stop scrolling inside a
    // popup from also zooming the map) — but it never calls
    // preventDefault(). That means: while the cursor is over an open
    // popup, the wheel event never bubbles up to window (where Lenis
    // listens), so Lenis never finds out a scroll happened, while the
    // browser's native (non-smoothed) scroll runs anyway. The instant the
    // cursor leaves the popup, Lenis's rAF loop forces the scroll position
    // back to its own last-known value — that's the catapult. The fix:
    // intercept the wheel event ourselves on the same node (this still
    // fires — stopPropagation doesn't block other listeners on the same
    // element, only further bubbling), block the native scroll, and
    // re-dispatch an equivalent event on window so Lenis processes it
    // normally and its internal position never drifts from reality.
    const forwardWheelToWindow = (e: Event) => {
      const wheelEvent = e as WheelEvent;
      wheelEvent.preventDefault();
      window.dispatchEvent(
        new WheelEvent("wheel", {
          deltaX: wheelEvent.deltaX,
          deltaY: wheelEvent.deltaY,
          deltaZ: wheelEvent.deltaZ,
          deltaMode: wheelEvent.deltaMode,
          clientX: wheelEvent.clientX,
          clientY: wheelEvent.clientY,
          bubbles: true,
          cancelable: true,
        })
      );
    };

    map.on("popupopen", (e) => {
      const { popup } = e as LeafletPopupOpenEvent;
      const content = popup.getElement()?.querySelector<HTMLElement>(".leaflet-popup-content");
      content?.addEventListener("wheel", forwardWheelToWindow, { passive: false });
    });

    LOCATIONS.forEach((loc) => {
      const isOffice = loc.type === "office";

      const color       = isOffice ? "#412c17" : "#C2A170";
      const borderColor = isOffice ? "#6b4a30" : "#d4b88a";
      const statusColor = loc.status === "Completed" ? "#412c17" : loc.status === "Ongoing" ? "#C2A170" : "#F8F0E5";
      const statusBg    = loc.status === "Completed" ? "#f1ece7" : loc.status === "Ongoing" ? "#fdf7f0" : "#412c17";

      const svgPin = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="42" viewBox="0 0 32 42">
        <defs><filter id="sh${loc.id}" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="rgba(65,44,23,0.4)"/>
        </filter></defs>
        <path d="M16 2 C8.3 2 2 8.3 2 16 C2 24 16 40 16 40 C16 40 30 24 30 16 C30 8.3 23.7 2 16 2Z"
          fill="${color}" stroke="${borderColor}" stroke-width="1.5" filter="url(#sh${loc.id})"/>
        <circle cx="16" cy="16" r="5" fill="rgba(248,240,229,0.92)"/>
      </svg>`;

      const icon = L.divIcon({
        html: svgPin,
        className: "",
        iconSize: [32, 42],
        iconAnchor: [16, 42],
        popupAnchor: [0, -44],
      });

      // Conditional Button Logic
      const directionsButton = isOffice ? `
        <a href="https://maps.app.goo.gl/R3BCs938KdcjXGSX8" target="_blank" rel="noopener noreferrer" 
           style="display:block;text-align:center;background:#c2a170;color:#ffffff;text-decoration:none;font-size:0.75rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;padding:12px;border-radius:6px;transition:background 0.3s ease;margin-top:4px;">
          Get Directions
        </a>
      ` : "";

      // Dynamic sizing based on type
      const popupMinWidth = isOffice ? "240px" : "180px";
      const titleFontSize = isOffice ? "1.25rem" : "1.05rem";
      const popupPadding = isOffice ? "10px 6px" : "6px 4px";
      const leafMaxWidth = isOffice ? 300 : 240;

      const popup = `
        <div style="font-family:'Lato',sans-serif;padding:${popupPadding};min-width:${popupMinWidth};display:flex;flex-direction:column;gap:12px;">
          <div>
            <p style="font-size:0.55rem;font-weight:700;letter-spacing:0.22em;text-transform:uppercase;color:${isOffice ? "#412c17" : "#C2A170"};margin:0 0 6px;">
              ${isOffice ? "Head Office" : "Project"}
            </p>
            <p style="font-family:'Playfair Display',serif;font-size:${titleFontSize};font-weight:600;color:#412c17;margin:0 0 3px;">${loc.name}</p>
            <p style="font-size:0.75rem;color:#776251;font-style:italic;margin:0 0 10px;">${loc.city}, Maharashtra</p>
            <span style="display:inline-block;font-size:0.52rem;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;padding:4px 12px;border-radius:20px;background:${statusBg};color:${statusColor};">
              ${loc.status}
            </span>
          </div>
          ${directionsButton}
        </div>`;

      const marker = L.marker([loc.lat, loc.lng], { icon })
        .addTo(map)
        .bindPopup(popup, { maxWidth: leafMaxWidth, className: "numara-popup" });

      if (loc.type === "office") {
        marker.openPopup();
      }
    });
  }, []);

  // Boot Leaflet during idle time shortly after mount, rather than waiting
  // until the section scrolls into view. With Lenis driving scroll via a
  // requestAnimationFrame loop, any main-thread stall (script parse, tile
  // requests, building marker/popup DOM) that happens to land *during* the
  // scroll into this section shows up as a dropped frame — and because
  // Lenis's easing is time-based, it then jumps ("catapults") to where it
  // calculates the scroll should be once the thread frees up. Doing this
  // work earlier, while the page is idle and nobody is actively scrolling,
  // means it's finished long before Lenis ever animates through here.
  useEffect(() => {
    let cancelled = false;

    const boot = () => {
      if (cancelled) return;

      if (!document.getElementById("leaflet-css")) {
        const link = document.createElement("link");
        link.id   = "leaflet-css";
        link.rel  = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(link);
      }

      if (window.L) { initMap(window.L); return; }
      const script  = document.createElement("script");
      script.src    = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      script.onload = () => { if (!cancelled && window.L) initMap(window.L); };
      document.head.appendChild(script);
    };

    const hasIdleCallback = "requestIdleCallback" in window;
    const handle = hasIdleCallback
      ? window.requestIdleCallback(boot, { timeout: 2000 })
      : window.setTimeout(boot, 300);

    return () => {
      cancelled = true;
      if (hasIdleCallback) window.cancelIdleCallback(handle);
      else window.clearTimeout(handle);
    };
  }, [initMap]);

  useEffect(() => {
    const onResize = () => leafletRef.current?.invalidateSize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Turn the scroll/swipe-stealing interactions on only while the map is
  // "active" (deliberately clicked/tapped into), and back off the moment the
  // visitor clicks elsewhere. This is what stops the page from jumping
  // ("catapulting") when a scroll gesture starts on top of the map.
  useEffect(() => {
    const map = leafletRef.current;
    if (!map) return;

    const toggles: LeafletToggle[] = [
      map.dragging,
      map.touchZoom,
      map.doubleClickZoom,
      map.boxZoom,
      map.keyboard,
      map.scrollWheelZoom,
    ];

    toggles.forEach((t) => (active ? t.enable() : t.disable()));
  }, [active]);

  useEffect(() => {
    if (!active) return;

    const handlePointerDown = (e: PointerEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setActive(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [active]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;1,400&family=Lato:wght@300;400;700&display=swap');

        :root {
          --cm-bg:      #F2E8D4;
          --cm-heading: #412c17;
          --cm-body:    #776251;
          --cm-accent:  #C2A170;
          --cm-border:  #DBD3CB;
          --cm-muted:   #F1ECE7;
        }

        .cm-section {
          width: 100%;
          position: relative;
          background: var(--cm-bg);
          padding: clamp(60px, 8vw, 120px) clamp(20px, 5vw, 80px);
          box-sizing: border-box;
        }

        .cm-map-wrap {
          position: relative;
          width: 100%;
          max-width: 1400px;
          margin: 0 auto;
          height: clamp(600px, 80vh, 900px); 
          z-index: 1;
          border-radius: 20px;
          overflow: hidden;
          border: 1px solid rgba(194, 161, 112, 0.2);
          box-shadow: 0 24px 48px rgba(65, 44, 23, 0.08);
          transform: translateZ(0);
          /* Let vertical scroll/swipe gestures pass straight through to the
             page while the map isn't actively engaged. */
          touch-action: pan-y;
        }

        .cm-map-wrap.is-active {
          touch-action: none;
        }

        .cm-map-el {
          width: 100%;
          height: 100%;
        }

        .cm-map-activate {
          position: absolute;
          inset: 0;
          z-index: 2;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(65, 44, 23, 0.06);
          border: none;
          padding: 0;
          margin: 0;
          cursor: pointer;
          opacity: 1;
          transition: opacity 0.25s ease;
        }

        .cm-map-activate span {
          font-family: 'Lato', sans-serif;
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #412c17;
          background: rgba(255, 255, 255, 0.92);
          padding: 10px 20px;
          border-radius: 999px;
          box-shadow: 0 8px 24px rgba(65, 44, 23, 0.18);
        }

        .cm-map-activate.is-hidden {
          opacity: 0;
          pointer-events: none;
        }

        /* ─── Leaflet overrides ─── */
        .numara-popup .leaflet-popup-content-wrapper {
          border-radius: 12px !important;
          box-shadow: 0 16px 40px rgba(65,44,23,0.18) !important;
          border: 1px solid var(--cm-border) !important;
          background: #ffffff !important; 
          padding: 0 !important;
        }
        .numara-popup .leaflet-popup-content {
          margin: 18px !important;
        }
        .numara-popup .leaflet-popup-tip {
          background: #ffffff !important;
        }
        .numara-popup .leaflet-popup-close-button {
          font-size: 20px !important;
          color: #776251 !important;
          top: 10px !important;
          right: 12px !important;
        }
        
        .numara-popup a:hover {
          background: #a3865a !important;
        }

        .leaflet-control-zoom {
          border: 1px solid var(--cm-border) !important;
          border-radius: 8px !important;
          overflow: hidden;
          margin-right: 20px !important;
          margin-bottom: 20px !important;
          box-shadow: 0 8px 24px rgba(65, 44, 23, 0.1) !important;
        }
        .leaflet-control-zoom a {
          color: var(--cm-heading) !important;
          background: #ffffff !important;
          border-color: var(--cm-border) !important;
          font-size: 16px !important;
          line-height: 36px !important;
          width: 36px !important;
          height: 36px !important;
        }
        .leaflet-control-zoom a:hover {
          background: var(--cm-muted) !important;
          color: var(--cm-accent) !important;
        }
        .leaflet-attribution-flag { display: none !important; }
        .leaflet-control-attribution {
          font-family: 'Lato', sans-serif !important;
          font-size: 10px !important;
          background: rgba(255,255,255,0.85) !important;
          color: var(--cm-body) !important;
          padding: 4px 10px !important;
          border-top-left-radius: 8px;
        }
        .leaflet-control-attribution a {
          color: var(--cm-accent) !important;
        }

        @media (max-width: 760px) {
          .cm-section {
             padding: clamp(40px, 6vw, 60px) clamp(16px, 4vw, 24px);
          }
          .cm-map-wrap {
            height: clamp(500px, 70vh, 700px);
            border-radius: 16px;
          }
        }
      `}</style>

      <section className="cm-section">
        <div
          ref={wrapRef}
          className={`cm-map-wrap${active ? " is-active" : ""}`}
          data-lenis-prevent={active ? true : undefined}
        >
          <div ref={mapRef} className="cm-map-el" />
          <button
            type="button"
            className={`cm-map-activate${active ? " is-hidden" : ""}`}
            onClick={() => setActive(true)}
            aria-label="Activate map to pan, zoom, and scroll"
          >
            <span>Click or tap to explore the map</span>
          </button>
        </div>
      </section>
    </>
  );
}