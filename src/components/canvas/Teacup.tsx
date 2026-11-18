"use client";

/**
 * Teacup.tsx — Phase 4
 *
 * Single-wall crystal glass teacup. No inner wall haze.
 *   opacity: 0.12 — only crisp rim reflections and clearcoat highlights
 *   visible. Tea liquid renders at 100% clarity through the walls.
 *
 * Handle welding:
 *   We sample the outer-wall LatheGeometry profile to find the exact
 *   radius r(y) at the two attachment heights. The CatmullRomCurve3
 *   start/end points are placed at x = r(y) − 0.012 (slightly inside
 *   the wall) so there is zero visible gap from any camera angle.
 *
 * AGENTS.md: dispose() on all geo/mat on unmount.
 */

import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useTeaStore } from "@/store/useTeaStore";

const v2 = (x: number, y: number) => new THREE.Vector2(x, y);

/* ─── Outer cup profile ──────────────────────────────────────── */
// x = radius, y = height. Rim at y=0.84, base at y=0.
const OUTER_PTS = [
  v2(0.00,  0.000),
  v2(0.14,  0.000),
  v2(0.13,  0.030),
  v2(0.17,  0.100),
  v2(0.22,  0.220),
  v2(0.28,  0.360),
  v2(0.33,  0.500),
  v2(0.36,  0.620),
  v2(0.37,  0.720),
  v2(0.36,  0.800),
  v2(0.37,  0.840),
];

/* ─── Saucer profile ─────────────────────────────────────────── */
const SAUCER_PTS = [
  v2(0.00, -0.060),
  v2(0.05, -0.060),
  v2(0.14, -0.040),
  v2(0.17,  0.000),
  v2(0.18,  0.020),
  v2(0.20,  0.010),
  v2(0.36,  0.010),
  v2(0.46,  0.020),
  v2(0.50,  0.040),
  v2(0.49,  0.060),
  v2(0.46,  0.070),
  v2(0.36,  0.050),
  v2(0.20,  0.040),
  v2(0.17,  0.030),
  v2(0.00,  0.000),
];

/** Sample the outer-wall profile to get radius at a given height y.
 *  Uses linear interpolation between the two nearest control points. */
function profileRadius(pts: THREE.Vector2[], targetY: number): number {
  // pts are ordered y low→high
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i], b = pts[i + 1];
    if (targetY >= a.y && targetY <= b.y) {
      const t = (targetY - a.y) / (b.y - a.y);
      return a.x + t * (b.x - a.x);
    }
  }
  // clamp
  return pts[pts.length - 1].x;
}

/* ─── Materials ──────────────────────────────────────────────── */
function crystalMat(): THREE.MeshPhysicalMaterial {
  return new THREE.MeshPhysicalMaterial({
    color:              new THREE.Color("#ffffff"),
    transparent:        true,
    opacity:            0.12,
    roughness:          0.05,
    metalness:          0.05,
    ior:                1.48,
    clearcoat:          1.0,
    clearcoatRoughness: 0.05,
    reflectivity:       0.9,
    envMapIntensity:    2.0,
    side:               THREE.DoubleSide,
    depthWrite:         false,
  });
}

function saucerMat(): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color:     new THREE.Color("#E8ECE4"),
    roughness: 0.52,
    metalness: 0.00,
  });
}

/* ─── Component ─────────────────────────────────────────────── */
export default function Teacup() {
  const groupRef  = useRef<THREE.Group>(null);
  const saucerRef = useRef<THREE.Mesh>(null);
  const splitRef  = useRef(0);  // current saucer separation, lerped in useFrame

  /* Outer wall only — no inner wall */
  const geoOuter  = useMemo(() => new THREE.LatheGeometry(OUTER_PTS, 80), []);
  const geoSaucer = useMemo(() => new THREE.LatheGeometry(SAUCER_PTS, 64), []);

  /* Handle with mathematically welded attachment points */
  const geoHandle = useMemo(() => {
    const topY    = 0.65;
    const botY    = 0.28;
    // Exact radius at each attachment height, nudged 0.012 inside the wall
    const rTop    = profileRadius(OUTER_PTS, topY) - 0.012;
    const rBot    = profileRadius(OUTER_PTS, botY) - 0.012;

    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(rTop,  topY,  0.000),  // weld top
      new THREE.Vector3(rTop + 0.055, topY + 0.015, 0.000),  // blend out
      new THREE.Vector3(0.56,  0.510, 0.000),  // apex
      new THREE.Vector3(0.56,  0.420, 0.000),
      new THREE.Vector3(rBot + 0.055, botY - 0.010, 0.000),  // blend in
      new THREE.Vector3(rBot,  botY,  0.000),  // weld bottom
    ]);
    return new THREE.TubeGeometry(curve, 36, 0.020, 10, false);
  }, []);

  const matGlass  = useMemo(crystalMat, []);
  const matSaucer = useMemo(saucerMat,  []);

  useEffect(() => {
    // Subscribe to saucerSplit outside the render loop
    const unsub = useTeaStore.subscribe((s) => {
      splitRef.current = s.saucerSplit;
    });
    return () => { unsub(); geoOuter.dispose(); geoSaucer.dispose();
      geoHandle.dispose(); matGlass.dispose(); matSaucer.dispose(); };
  }, [geoOuter, geoSaucer, geoHandle, matGlass, matSaucer]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += delta * 0.05;
    // Lerp saucer down by splitRef (levitation on Craft section)
    if (saucerRef.current) {
      const target = -0.06 - splitRef.current;
      saucerRef.current.position.y +=
        (target - saucerRef.current.position.y) * Math.min(delta * 6, 1);
    }
  });

  return (
    <group ref={groupRef}>
      <mesh geometry={geoOuter}  material={matGlass}  castShadow renderOrder={2} />
      <mesh geometry={geoHandle} material={matGlass}  renderOrder={2} />
      <mesh
        ref={saucerRef}
        geometry={geoSaucer}
        material={matSaucer}
        position={[0, -0.06, 0]}
        receiveShadow
        renderOrder={1}
      />
    </group>
  );
}
