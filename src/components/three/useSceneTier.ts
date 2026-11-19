"use client";

import { useEffect, useState } from "react";

export type SceneTier = "off" | "low" | "high";

export interface SceneCapability {
  tier: SceneTier;
  /** true on phones / small tablets — the scene belongs in the hero flow. */
  isMobileLayout: boolean;
  /** true when the user asked for less motion — render one static frame. */
  reduceMotion: boolean;
}

const INITIAL: SceneCapability = {
  tier: "off",
  isMobileLayout: false,
  reduceMotion: false,
};

/**
 * Decides how much 3D a device gets.
 *
 * - "high": hover-capable pointer on a >=1024px viewport → sticky overlay at
 *   full quality (post-processing, contact shadows, 300 particles).
 * - "low" : phones/tablets (coarse pointer), very low-core devices → the same
 *   scene without post-processing or contact shadows, fewer particles and a
 *   lower DPR, rendered in-flow inside the hero.
 * - "off" : no WebGL context available at all.
 *
 * SSR / first paint is "off" on purpose: nothing mounts until we know what the
 * device can handle, so no canvas ever flickers in and out.
 */
export function useSceneTier(): SceneCapability {
  const [capability, setCapability] = useState<SceneCapability>(INITIAL);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarse = window.matchMedia("(hover: none), (pointer: coarse)");
    const desktop = window.matchMedia("(min-width: 1024px) and (hover: hover)");

    const probeWebGL = () => {
      try {
        const probe = document.createElement("canvas");
        return Boolean(
          probe.getContext("webgl2") ?? probe.getContext("webgl")
        );
      } catch {
        return false;
      }
    };

    let hasWebGL = probeWebGL();

    const update = () => {
      const isMobileLayout = !desktop.matches;

      if (!hasWebGL) {
        setCapability({ tier: "off", isMobileLayout, reduceMotion: false });
        return;
      }

      const cores = navigator.hardwareConcurrency ?? 4;
      const memory =
        (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 4;
      const weakDevice = cores <= 2 || memory <= 2;

      setCapability({
        tier: coarse.matches || weakDevice ? "low" : "high",
        isMobileLayout,
        reduceMotion: reduced.matches,
      });
    };

    update();

    // A context can also be lost later (GPU process crash, backgrounding).
    const handleContextLost = () => {
      hasWebGL = false;
      update();
    };
    window.addEventListener("webglcontextlost", handleContextLost, true);

    const queries = [reduced, coarse, desktop];
    queries.forEach((query) => query.addEventListener("change", update));

    return () => {
      window.removeEventListener("webglcontextlost", handleContextLost, true);
      queries.forEach((query) => query.removeEventListener("change", update));
    };
  }, []);

  return capability;
}
