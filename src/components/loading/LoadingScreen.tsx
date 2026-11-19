"use client";

import { useEffect, useRef, useState } from "react";
import { getLenis } from "@/lib/utils";

export default function LoadingScreen() {
  const screenRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const text = textRef.current;
    if (!text) return;

    // Split "SHAMI" into letters for reveal
    const letters = "SHAMI MUKASA".split("").map((char, i) => {
      const span = document.createElement("span");
      span.textContent = char === " " ? "\u00A0" : char;
      span.style.display = "inline-block";
      span.style.opacity = "0";
      span.style.transform = "translateY(30px) rotate(10deg)";
      span.style.transition = "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)";
      span.style.transitionDelay = `${i * 0.04}s`;
      span.style.fontSize = "clamp(2rem, 6vw, 4rem)";
      span.style.fontWeight = "200";
      span.style.letterSpacing = "0.3em";
      span.style.color = "#ffffff";
      text.appendChild(span);
      return span;
    });

    // Animate progress
    const duration = 2400; // 2.4 seconds
    const startTime = performance.now();

    const updateProgress = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const rawProgress = Math.min(elapsed / duration, 1);
      // Ease the progress
      const eased = 1 - Math.pow(1 - rawProgress, 3);
      setProgress(Math.round(eased * 100));

      if (rawProgress < 1) {
        requestAnimationFrame(updateProgress);
      } else {
        // Reveal letters
        letters.forEach((letter) => {
          letter.style.opacity = "1";
          letter.style.transform = "translateY(0) rotate(0deg)";
        });

        // Fade out after a moment
        setTimeout(() => {
          if (screenRef.current) {
            screenRef.current.classList.add("hidden");
            setLoaded(true);
            // Resume Lenis — SmoothScroll stopped it while the loader was up.
            getLenis()?.start();
          }
        }, 600);
      }
    };

    // Stop Lenis during loading. It may not exist yet on the very first render
    // (SmoothScroll stops it itself in that case), so this is a no-op then.
    getLenis()?.stop();

    requestAnimationFrame(updateProgress);

    return () => {
      letters.forEach((letter) => letter.remove());
    };
  }, []);

  return (
    <div ref={screenRef} className="loading-screen">
      {/* Animated logo circle */}
      <div className="relative mb-12">
        <div
          className="w-28 h-28 rounded-full border border-white/20 animate-spin-slow"
          style={{
            borderTopColor: "#ffffff",
            borderRightColor: "transparent",
            boxShadow: "0 0 40px rgba(255, 255, 255, 0.1)",
          }}
        />
        <div className="absolute inset-3 rounded-full border border-white/15 animate-spin-slow" style={{ animationDirection: "reverse", animationDuration: "8s" }} />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-white animate-pulse glow-silver" />
        </div>
      </div>

      {/* Animated logo text */}
      <div ref={textRef} className="flex mb-8" />

      {/* Progress percentage */}
      <div className="flex items-center gap-4 mb-4">
        <div className="w-32 h-px bg-white/10 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-white to-gray-400 transition-all duration-150 ease-out"
            style={{ width: `${progress}%` }}
            aria-hidden="true"
          />
        </div>
        <span className="text-2xl font-light text-white tabular-nums">
          {progress}%
        </span>
      </div>

      <p className="text-xs text-gray-500 font-light tracking-[0.3em] uppercase">
        {loaded ? "Welcome" : "Loading Experience"}
      </p>

      {/* Noise overlay on loading screen */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")",
        }}
        aria-hidden="true"
      />
    </div>
  );
}