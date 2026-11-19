"use client";

import dynamic from "next/dynamic";
import { useProgress } from "@react-three/drei";
import { cn } from "@/lib/utils";
import { useSceneTier } from "./useSceneTier";
import SceneErrorBoundary from "./SceneErrorBoundary";

const ThreeScene = dynamic(() => import("./ThreeScene"), { ssr: false });

/** Mobile / tablet 3D model.
 * StickyScene cannot be reused here: it is a `fixed inset-0` layer parked
 * *behind* the content, and it only reads as intentional because the desktop
 * hero reserves an empty right-hand column for it. Stacked into one column on a
 * phone the model would just hide behind the hero copy — which is exactly why
 * the phone build appeared to have no 3D model at all.
 *
 * So on small screens the (lighter) scene is mounted as a real block inside the
 * hero, above the text, with a placeholder that covers the load.
 */
export default function HeroScene() {
  const { tier, isMobileLayout, reduceMotion } = useSceneTier();
  const { active, progress } = useProgress();

  // "off" = no WebGL context at all: keep the ambient placeholder, no canvas.
  const enabled = isMobileLayout && tier !== "off";
  const modelLoaded = !active && progress === 100;

  return (
    <div aria-hidden="true" className="relative h-full w-full">
      {/* Placeholder sits behind the alpha canvas and fades out once the model
        really is on screen, so the space is never empty. */}
      <div
        className={cn(
          "absolute inset-0 grid place-items-center transition-opacity duration-700",
          enabled && modelLoaded ? "opacity-0" : "opacity-100"
        )}
      >
        <div
          className="h-40 w-40 rounded-full opacity-50 blur-2xl"
          style={{
            background:
              "radial-gradient(circle, rgba(201,169,110,0.35) 0%, rgba(255,255,255,0.08) 45%, transparent 70%)",
          }}
        />
        {enabled && (
          <div className="absolute h-9 w-9 animate-spin rounded-full border border-white/15 border-t-white/70" />
        )}

        {enabled && (
          <SceneErrorBoundary
            fallback={
              <div className="absolute inset-0 grid place-items-center bg-[#0a0a0a]/80 text-[10px] tracking-[0.3em] text-gray-500 uppercase">
                3D preview unavailable
              </div>
            }
          >
            <ThreeScene tier={tier} reduceMotion={reduceMotion} />
          </SceneErrorBoundary>
        )}
      </div>
    </div>
  );
}