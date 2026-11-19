"use client";

import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { SectionState } from "./Model";

interface EnergyRingsProps {
  section: SectionState;
}

interface RingData {
  mesh: THREE.Mesh;
  speed: number;
}

export default function EnergyRings({ section }: EnergyRingsProps) {
  const groupRef = useRef<THREE.Group>(null);
  const ringsRef = useRef<RingData[]>([]);

  useEffect(() => {
    const group = groupRef.current;
    if (!group) return;

    const configs = [
      { radius: 2.2, tilt: 0.3, speed: 0.4, color: "#ffffff" },
      { radius: 2.8, tilt: -0.4, speed: -0.3, color: "#d4d4d4" },
      { radius: 3.4, tilt: 0.15, speed: 0.25, color: "#a0a0a0" },
    ];

    const rings: RingData[] = configs.map((config) => {
      const geometry = new THREE.TorusGeometry(config.radius, 0.012, 8, 96);
      const material = new THREE.MeshBasicMaterial({
        color: config.color,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.rotation.x = config.tilt;
      group.add(mesh);
      return { mesh, speed: config.speed };
    });

    ringsRef.current = rings;

    return () => {
      rings.forEach(({ mesh }) => {
        group.remove(mesh);
        mesh.geometry.dispose();
        (mesh.material as THREE.Material).dispose();
      });
      ringsRef.current = [];
    };
  }, []);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    const visible = section === "skills" || section === "about";
    const targetOpacity = visible ? 0.5 : 0;

    ringsRef.current.forEach(({ mesh, speed }, i) => {
      if (mesh.parent !== groupRef.current) return;
      const mat = mesh.material as THREE.MeshBasicMaterial;
      mat.opacity += (targetOpacity - mat.opacity) * 0.05;

      // Per-ring animation
      mesh.rotation.z = Math.sin(time * speed * 2 + i) * 0.3;
      mesh.rotation.y += 0.002;

      // Scale pulse in skills
      if (section === "skills") {
        const pulse = 1 + Math.sin(time * 1.5 + i * 2) * 0.05;
        mesh.scale.setScalar(pulse);
      } else {
        mesh.scale.setScalar(1);
      }
    });
  });

  return <group ref={groupRef} position={[0, 0, 0]} />;
}