'use client';

import { useEffect, useRef } from 'react';

export default function PhilosophySlide({
  children,
}: {
  children: React.ReactNode;
}) {
  const stageRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    const panel = panelRef.current;

    if (!stage || !panel) return;

    let frame = 0;

    const update = () => {
      frame = 0;

      const rect = stage.getBoundingClientRect();
      const vh = window.innerHeight;

      /*
       * The slide happens over exactly one viewport height.
       */
      const progress = Math.min(
        Math.max(-rect.top / vh, 0),
        1
      );

      /*
       * Start one viewport below the screen.
       * Finish exactly at the top.
       */
      const y = (1 - progress) * 100;

      panel.style.transform = `translate3d(0, ${y}vh, 0)`;
    };

    const onScroll = () => {
      if (!frame) {
        frame = requestAnimationFrame(update);
      }
    };

    update();

    window.addEventListener('scroll', onScroll, {
      passive: true,
    });

    window.addEventListener('resize', onScroll);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);

      if (frame) {
        cancelAnimationFrame(frame);
      }
    };
  }, []);

  return (
    <div
      ref={stageRef}
      className="relative w-full"
      style={{
        height: '100vh',
      }}
    >
      <div
        ref={panelRef}
        className="
          absolute
          left-0
          top-0
          w-full
          will-change-transform
        "
        style={{
          transform: 'translate3d(0, 100vh, 0)',
        }}
      >
        {children}
      </div>
    </div>
  );
}