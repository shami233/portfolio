"use client";

import { useEffect, useRef, type ReactNode } from "react";
import Lenis from "lenis";
import { setLenis } from "@/lib/utils";

export default function SmoothScroll({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5,
      // Lenis runs its own frame loop. (The old manual requestAnimationFrame
      // was scheduled only once and never re-requested, so lenis.raf() never
      // ran again — wheel events were preventDefault()'d and nothing scrolled.)
      autoRaf: true,
    });

    lenisRef.current = lenis;

    // Lock scrolling while the loading screen is visible. LoadingScreen calls
    // lenis.start() when it fades out — it can't call stop() itself because it
    // mounts before Lenis exists.
    if (document.querySelector(".loading-screen:not(.hidden)")) {
      lenis.stop();
    }

    // Expose lenis globally for other components
    setLenis(lenis);

    return () => {
      lenis.destroy();
      lenisRef.current = null;
      setLenis(null);
    };
  }, []);

  return <>{children}</>;
}