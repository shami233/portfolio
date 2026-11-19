"use client";

/* eslint-disable react-hooks/immutability --
   three.js scenes are imperative by design: centring the model, adjusting PBR
   materials and assigning an IBL environment map all mean writing directly to
   objects owned by the canvas. React's compiler rules flag every one of those
   writes, so the rule is off for this file — nothing here mutates React props
   or state. */
import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

/** Single source of truth so the model can be preloaded in one place. */
export const MODEL_URL =
  "https://cdn.jsdelivr.net/gh/mrdoob/three.js@r128/examples/models/gltf/DamagedHelmet/glTF/DamagedHelmet.gltf";

interface SectionTargets {
  rotation: { x: number; y: number; z: number };
  position: { y: number; scale: number };
  camera: { zoom: number; position: [number, number, number] };
}

/* Per-section pose table.
   This used to be a mutable object that a section effect kept rewriting, which
   meant each section inherited whatever the previous one left behind (e.g.
   "experience" slid in still carrying the rotation from "about"). Deriving the
   pose from the section keeps every value explicit and the render pass pure. */
const SECTION_TARGETS: Record<SectionState, SectionTargets> = {
  home: {
    rotation: { x: 0, y: -Math.PI / 4, z: 0 },
    position: { y: 0, scale: 1 },
    camera: { zoom: 1, position: [0, 0, 5] },
  },
  about: {
    rotation: { x: Math.PI / 2, y: -Math.PI / 4 + Math.PI, z: 0 },
    position: { y: 0, scale: 1 },
    camera: { zoom: 1.3, position: [0, 0, 5] },
  },
  experience: {
    rotation: { x: 0, y: -Math.PI / 4, z: 0 },
    position: { y: 0, scale: 1 },
    camera: { zoom: 1.1, position: [0.8, 0, 5.5] },
  },
  projects: {
    rotation: { x: 0, y: -Math.PI / 4 + Math.PI / 3, z: 0 },
    position: { y: -0.2, scale: 1 },
    camera: { zoom: 1, position: [-0.8, 0, 5.5] },
  },
  skills: {
    rotation: { x: 0, y: -Math.PI / 4, z: 0 },
    position: { y: 0, scale: 1 },
    camera: { zoom: 1.2, position: [0, 0.3, 5.8] },
  },
  contact: {
    rotation: { x: Math.PI, y: -Math.PI / 4, z: 0 },
    position: { y: 0, scale: 1 },
    camera: { zoom: 1.4, position: [0, 0.2, 4.8] },
  },
};

export type SectionState =
  | "home"
  | "about"
  | "experience"
  | "projects"
  | "skills"
  | "contact";

interface ModelProps {
  section: SectionState;
  mouse: React.MutableRefObject<{ x: number; y: number }>;
}

export default function Model({ section, mouse }: ModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const innerRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF(MODEL_URL);
  const { gl, scene: canvasScene } = useThree();

  // Pose for the current section — a pure lookup, no shared mutable state.
  const targets = SECTION_TARGETS[section];

  /* Lighting. PBR materials have nothing to reflect without an environment map,
     so the model rendered almost black on the #050505 background — which reads
     as "the 3D model is missing" on a dimmed phone screen. This builds a small
     room environment locally with PMREM (no CDN HDRI, so nothing extra to
     download and nothing to fail on a slow mobile connection). */
  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const room = new RoomEnvironment();
    let envTarget: THREE.WebGLRenderTarget | null = null;

    try {
      envTarget = pmrem.fromScene(room, 0.04);
      canvasScene.environment = envTarget.texture;
    } catch (error) {
      console.warn("[3D] environment map unavailable:", error);
    }

    room.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.geometry.dispose();
        (mesh.material as THREE.Material).dispose();
      }
    });
    pmrem.dispose();

    return () => {
      canvasScene.environment = null;
      envTarget?.dispose();
    };
  }, [gl, canvasScene]);

  // Apply materials and center the model
  useEffect(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (mesh.material) {
          const material = mesh.material as THREE.MeshStandardMaterial;
          material.metalness = Math.min(material.metalness ?? 0, 0.6);
          material.roughness = Math.max(material.roughness ?? 1, 0.35);
          material.envMapIntensity = 1.35;
        }
      }
    });

    const box = new THREE.Box3().setFromObject(scene);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = 2.5 / maxDim;
    scene.scale.setScalar(scale);
    scene.position.sub(center.multiplyScalar(scale));
    scene.rotation.y = -Math.PI / 4;
  }, [scene]);

  // Section poses come from SECTION_TARGETS above — nothing to sync here.

  useFrame((state, delta) => {
    if (!groupRef.current || !innerRef.current) return;

    const time = state.clock.elapsedTime;
    const r = targets.rotation;
    const p = targets.position;
    const cam = targets.camera;

    let targetRotY = r.y;
    let targetRotX = r.x;
    const targetRotZ = r.z;
    let targetY = p.y;
    let targetScale = p.scale;

    // Per-section behavior
    switch (section) {
      case "home":
        // Slow rotation - one full rotation every ~42 seconds
        targetRotY = r.y + time * 0.15;
        targetY = Math.sin(time * 0.8) * 0.1;
        break;
      case "about":
        break;
      case "experience":
        targetRotY = r.y + time * 0.4;
        break;
      case "projects":
        targetRotY = r.y + Math.sin(time * 0.3) * 0.3;
        break;
      case "skills":
        targetScale = p.scale + Math.sin(time * 2) * 0.05;
        targetRotY = r.y + time * 0.2;
        break;
      case "contact":
        break;
    }

    // Mouse influence - subtle
    targetRotY += mouse.current.x * 0.15;
    targetRotX += mouse.current.y * 0.1;

    // Smooth interpolate
    const lerp = 1 - Math.pow(0.001, delta);
    innerRef.current.rotation.y += (targetRotY - innerRef.current.rotation.y) * lerp;
    innerRef.current.rotation.x += (targetRotX - innerRef.current.rotation.x) * lerp * 0.5;
    innerRef.current.rotation.z += (targetRotZ - innerRef.current.rotation.z) * lerp * 0.3;
    innerRef.current.scale.y += (targetScale - innerRef.current.scale.y) * lerp;

    // Floating
    const floatY = Math.sin(time * 0.8) * 0.08;
    groupRef.current.position.y = THREE.MathUtils.lerp(
      groupRef.current.position.y,
      targetY + floatY,
      lerp
    );

    // Camera interpolation
    const camera = state.camera as THREE.PerspectiveCamera;
    camera.position.x = THREE.MathUtils.lerp(
      camera.position.x,
      cam.position[0] + mouse.current.x * 0.3,
      lerp * 0.3
    );
    camera.position.y = THREE.MathUtils.lerp(
      camera.position.y,
      cam.position[1] - mouse.current.y * 0.2,
      lerp * 0.3
    );
    camera.position.z = THREE.MathUtils.lerp(
      camera.position.z,
      cam.position[2],
      lerp * 0.3
    );
    camera.lookAt(0, 0, 0);
  });

  return (
    <group ref={groupRef}>
      <group ref={innerRef}>
        <primitive object={scene} frustumCulled={false} />
      </group>
    </group>
  );
}

/* Warm the model cache as soon as the client bundle loads, so the phone scene
   shows geometry instead of a spinner. */
useGLTF.preload(MODEL_URL);





