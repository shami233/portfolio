"use client";

import { Suspense, useRef, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows, AdaptiveDpr } from "@react-three/drei";
import { EffectComposer, Vignette } from "@react-three/postprocessing";
import Model, { type SectionState } from "./Model";
import Particles from "./Particles";
import EnergyRings from "./EnergyRings";

function useActiveSection(): SectionState {
  const [section, setSection] = useState<SectionState>("home");

  useEffect(() => {
    const ids: SectionState[] = [
      "home",
      "about",
      "skills",
      "experience",
      "projects",
      "contact",
    ];

    const handleScroll = () => {
      let current: SectionState = "home";
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= window.innerHeight * 0.5) {
          current = id;
        }
      }
      setSection(current);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return section;
}

interface ThreeSceneProps {
  /** "low" = phones/tablets: no post-processing, fewer particles, lower DPR. */
  tier?: "low" | "high";
  /** Renders a single static frame instead of animating (reduced motion). */
  reduceMotion?: boolean;
}

export default function ThreeScene({
  tier = "high",
  reduceMotion = false,
}: ThreeSceneProps) {
  const mouse = useRef({ x: 0, y: 0 });
  const section = useActiveSection();
  const isLow = tier === "low";

  useEffect(() => {
    // Touch devices have no pointer to follow — skip the listener entirely.
    if (window.matchMedia("(hover: none)").matches) return;

    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="absolute inset-0 z-[5] flex items-center justify-center">
      <Canvas
        dpr={isLow ? [1, 1.25] : [1, 1.5]}
        frameloop={reduceMotion ? "demand" : "always"}
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{
          antialias: !isLow,
          alpha: true,
          powerPreference: isLow ? "default" : "high-performance",
        }}
        className="h-full w-full"
      >
        <Suspense fallback={null}>
          <ambientLight intensity={isLow ? 0.7 : 0.4} />
          <directionalLight
            position={[5, 5, 5]}
            intensity={isLow ? 1.3 : 1.2}
            color="#ffffff"
          />
          {/* Rim light from behind so the silhouette never disappears into the
              near-black background on a dim phone screen. */}
          <directionalLight
            position={[-6, -2, -4]}
            intensity={isLow ? 0.7 : 0.45}
            color="#c9a96e"
          />

          <Model section={section} mouse={mouse} />

          {/* Particles, contact shadows and post-processing are the three things
              that make phones drop frames or render nothing — desktop only. */}
          <Particles section={section} count={isLow ? 120 : 300} />
          <EnergyRings section={section} />

          {!isLow && (
            <>
              <ContactShadows
                position={[0, -0.8, 0]}
                opacity={0.25}
                scale={3}
                blur={2}
                far={3}
                color="#000000"
              />

              <EffectComposer>
                <Vignette eskil={false} offset={0.1} darkness={0.8} />
              </EffectComposer>

              <AdaptiveDpr pixelated={false} />
            </>
          )}
        </Suspense>
      </Canvas>
    </div>
  );
}