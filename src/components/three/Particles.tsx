"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { SectionState } from "./Model";

interface ParticlesProps {
  section: SectionState;
  /** Phones/tablets get fewer points so the scene holds 60fps. */
  count?: number;
}

/**
 * Tiny deterministic PRNG (mulberry32).
 *
 * The scatter should look random, but it must not call Math.random() during
 * render: that is impure (React's compiler rules reject it, and a re-render
 * would regenerate the whole cloud). A fixed seed gives the same cloud on every
 * mount while staying a pure function of the seed.
 */
function seededRandom(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export default function Particles({
  section,
  count: requestedCount = 300,
}: ParticlesProps) {
  const pointsRef = useRef<THREE.Points>(null);

  const { positions, colors, speeds, count } = useMemo(() => {
    const rand = seededRandom(0x5eed1c);
    const positions = new Float32Array(requestedCount * 3);
    const colors = new Float32Array(requestedCount * 3);
    const speeds = new Array<number>(requestedCount);
    const color = new THREE.Color("#ffffff");

    for (let i = 0; i < requestedCount; i++) {
      const radius = 2 + rand() * 2.5;
      const theta = rand() * Math.PI * 2;
      const phi = Math.acos(2 * rand() - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      // Monochrome - varying shades of white/gray
      color.setHSL(0, 0, 0.3 + rand() * 0.5);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;

      speeds[i] = 0.1 + rand() * 0.4;
    }

    return { positions, colors, speeds, count: requestedCount };
  }, [requestedCount]);

  useFrame((state) => {
    if (!pointsRef.current) return;

    const time = state.clock.elapsedTime;
    const positions = pointsRef.current.geometry.attributes.position
      .array as Float32Array;

    let orbitalSpeed = 0.08;
    let pulse = 1;
    let radiusOffset = 0;

    switch (section) {
      case "home":
        orbitalSpeed = 0.06;
        break;
      case "about":
        orbitalSpeed = 0.15;
        pulse = 1.2;
        break;
      case "experience":
        orbitalSpeed = 0.2;
        break;
      case "projects":
        orbitalSpeed = 0.3;
        radiusOffset = Math.sin(time * 0.5) * 0.5;
        break;
      case "skills":
        orbitalSpeed = 0.35;
        pulse = 1 + Math.sin(time * 2) * 0.15;
        break;
      case "contact":
        orbitalSpeed = 0.02;
        break;
    }

    for (let i = 0; i < count; i++) {
      const angle = time * orbitalSpeed * speeds[i];
      const radius = 2 + Math.sin(time + i) * 0.3 + radiusOffset;

      const baseX = positions[i * 3];
      const baseY = positions[i * 3 + 1];
      const baseZ = positions[i * 3 + 2];

      positions[i * 3] = baseX * Math.cos(angle) - baseZ * Math.sin(angle);
      positions[i * 3 + 1] = baseY * pulse;
      positions[i * 3 + 2] = baseX * Math.sin(angle) + baseZ * Math.cos(angle);

      // Normalize to sphere shell
      const len = Math.sqrt(
        positions[i * 3] ** 2 +
          positions[i * 3 + 1] ** 2 +
          positions[i * 3 + 2] ** 2
      );
      const scale = radius / len;
      positions[i * 3] *= scale;
      positions[i * 3 + 1] *= scale;
      positions[i * 3 + 2] *= scale;
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;

    // Opacity via material
    const mat = pointsRef.current.material as THREE.PointsMaterial;
    mat.opacity = section === "contact" ? 0.3 : 0.8;
    mat.size = section === "skills" ? 0.05 : 0.03;
  });

  return (
    <points ref={pointsRef} position={[0, 0, 0]}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        vertexColors
        transparent
        opacity={0.8}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}