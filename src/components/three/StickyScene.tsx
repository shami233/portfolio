"use client";

import dynamic from "next/dynamic";
import { useSceneTier } from "./useSceneTier";

const ThreeScene = dynamic(() => import("./ThreeScene"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="h-12 w-12 animate-spin rounded-full border-2 border-white/20 border-t-white" />
    </div>
  ),
});

/**
 * 3D overlay scene.
 * - On desktop: fixed full-viewport canvas behind content (sticky model).
 * - On mobile/tablet: in-flow block inside the hero, above the text,
 *   so the 3D model is always visible regardless of screen size.
 *
 * Both components read the same capability hook, so exactly one canvas mounts.
 */
export default function StickyScene() {
  const { tier, isMobileLayout, reduceMotion } = useSceneTier();

  // Map "off" to "low" since ThreeScene only supports "low" | "high"
  const threeTier = tier === "off" ? "low" : tier;

  // Always render ThreeScene — on desktop it's fixed, on mobile it's in-flow.
  return (
    <div
      className={`absolute inset-0 z-[5] ${
        isMobileLayout ? "flex flex-col items-center justify-center" : "pointer-events-none canvas-locked"
      }`}
      aria-hidden="true"
    >
      <ThreeScene tier={threeTier} reduceMotion={reduceMotion} />
    </div>
  );
}