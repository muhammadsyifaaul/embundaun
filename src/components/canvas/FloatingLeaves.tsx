"use client";

/**
 * FloatingLeaves.tsx
 *
 * 6 small curved tea leaves drifting in 3D space around the cup
 * at different depths, heights and orbit radii.
 * Each leaf uses a shared ExtrudeGeometry but has its own
 * transform animated in useFrame — no React state mutations.
 *
 * Dispose on unmount (AGENTS.md GPU hygiene).
 */

import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/* ─── Leaf shape ─────────────────────────────────────────────── */
function makeLeafShape(): THREE.Shape {
  const s = new THREE.Shape();
  s.moveTo(0, 0);
  s.bezierCurveTo( 0.030,  0.042,  0.055,  0.065,  0.058,  0.092);
  s.bezierCurveTo( 0.055,  0.118,  0.030,  0.145,  0,       0.145);
  s.bezierCurveTo(-0.030,  0.145, -0.055,  0.118, -0.058,  0.092);
  s.bezierCurveTo(-0.055,  0.065, -0.030,  0.042,  0,       0    );
  return s;
}

/* ─── Per-leaf orbital parameters ────────────────────────────── */
// orbitR: orbit radius around Y axis
// orbitY: base height relative to group origin
// orbitZ: depth offset
// phase:  angular phase offset (radians)
// speed:  orbit angular speed (rad/s)
// tilt:   static tilt angle (x rotation, radians)
// scale:  uniform scale
const LEAF_PARAMS = [
  { orbitR: 0.90, orbitY:  0.60, depth:  0.10, phase: 0.0,  speed: 0.28, tilt:  0.4, scale: 0.90 },
  { orbitR: 1.10, orbitY:  0.20, depth: -0.20, phase: 1.1,  speed: 0.22, tilt: -0.3, scale: 0.75 },
  { orbitR: 0.78, orbitY:  0.85, depth:  0.30, phase: 2.3,  speed: 0.34, tilt:  0.6, scale: 0.65 },
  { orbitR: 1.20, orbitY: -0.10, depth: -0.15, phase: 3.5,  speed: 0.19, tilt:  0.2, scale: 0.80 },
  { orbitR: 0.85, orbitY:  0.42, depth:  0.25, phase: 4.6,  speed: 0.30, tilt: -0.5, scale: 0.70 },
  { orbitR: 1.05, orbitY:  0.70, depth: -0.30, phase: 5.8,  speed: 0.25, tilt:  0.3, scale: 0.85 },
] as const;

export default function FloatingLeaves() {
  const meshRefs = useRef<(THREE.Mesh | null)[]>(Array(6).fill(null));

  const shape   = useMemo(makeLeafShape, []);
  const geo     = useMemo(() => new THREE.ExtrudeGeometry(shape, {
    depth: 0.005, bevelEnabled: true,
    bevelSize: 0.003, bevelThickness: 0.002, bevelSegments: 2,
  }), [shape]);

  // Two slightly different green materials for variety
  const mat0 = useMemo(() => new THREE.MeshStandardMaterial({
    color:     new THREE.Color("#3D6E2A"),
    roughness: 0.60,
    metalness: 0.03,
    transparent: true,
    opacity:   0.88,
  }), []);
  const mat1 = useMemo(() => new THREE.MeshStandardMaterial({
    color:     new THREE.Color("#4F8A3A"),
    roughness: 0.65,
    metalness: 0.02,
    transparent: true,
    opacity:   0.80,
  }), []);
  const mats = [mat0, mat1, mat0, mat1, mat0, mat1];

  useEffect(() => () => {
    geo.dispose();
    mat0.dispose();
    mat1.dispose();
  }, [geo, mat0, mat1]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    LEAF_PARAMS.forEach(({ orbitR, orbitY, depth, phase, speed, tilt }, i) => {
      const mesh = meshRefs.current[i];
      if (!mesh) return;
      const angle = t * speed + phase;
      mesh.position.set(
        Math.cos(angle) * orbitR,
        orbitY + Math.sin(t * 0.4 + phase) * 0.08,  // gentle vertical bob
        Math.sin(angle) * orbitR * 0.5 + depth,
      );
      mesh.rotation.set(
        tilt + Math.sin(t * 0.3 + phase) * 0.08,
        angle + Math.PI / 2,
        Math.cos(t * 0.25 + phase) * 0.12,
      );
    });
  });

  return (
    <group>
      {LEAF_PARAMS.map((p, i) => (
        <mesh
          key={i}
          ref={(el) => { meshRefs.current[i] = el; }}
          geometry={geo}
          material={mats[i]}
          scale={p.scale}
        />
      ))}
    </group>
  );
}
