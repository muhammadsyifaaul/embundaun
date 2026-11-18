"use client";

/**
 * Sunbeams.tsx — Phase 5 patch
 *
 * Fix: switched shaft ShaderMaterial from AdditiveBlending to NormalBlending.
 * AdditiveBlending added colour on bright backgrounds and made the rectangular
 * quad edges visible as muddy outlines.  NormalBlending with the strict
 * power-sine UV envelope below produces clean, border-free wisps.
 *
 * Shaft fragment shader enforces zero-alpha on ALL four UV edges via:
 *   edgeX = pow(sin(uv.x * PI), 2.8)        — smooth arch, zero at x=0 and x=1
 *   edgeY = smoothstep(0,0.28,y) * smoothstep(1,0.25,y) — fade in/out vertically
 *   streakNoise                                — a cheap value-noise streak
 *   alpha  = edgeX * edgeY * streakNoise * uOpacity
 *
 * The caustic ring keeps AdditiveBlending (it sits on the dark saucer ceramic
 * surface so additive is correct there).
 *
 * Full .dispose() on unmount (AGENTS.md GPU hygiene).
 */

import {
  useRef, useMemo, useEffect,
  forwardRef, useImperativeHandle,
} from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/* ═══════════════════════════════════════════════════════════════
   LIGHT SHAFT — shaders
   NormalBlending + strict power-sine envelope = zero quad edges
═══════════════════════════════════════════════════════════════ */
const SHAFT_VERT = /* glsl */`
  varying vec2 vUv;
  void main() {
    vUv         = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const SHAFT_FRAG = /* glsl */`
  uniform float uTime;
  uniform vec3  uColor;
  uniform float uOpacity;    // replaces uIntensity — drives the final alpha cap

  varying vec2 vUv;

  /* ── cheap value noise for streak texture ── */
  float hash(vec2 p) {
    p = fract(p * vec2(127.1, 311.7));
    p += dot(p, p + 19.19);
    return fract(p.x * p.y);
  }
  float vnoise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i),            hash(i + vec2(1,0)), u.x),
      mix(hash(i+vec2(0,1)),  hash(i + vec2(1,1)), u.x),
      u.y
    );
  }

  void main() {
    /* ── Edge X: power-sine arch — zero at uv.x = 0 and 1 ── */
    float edgeX = pow(sin(clamp(vUv.x, 0.0, 1.0) * 3.14159265), 2.8);

    /* ── Edge Y: fade in at base, dissolve at tip ── */
    float edgeY = smoothstep(0.0, 0.28, vUv.y) * smoothstep(1.0, 0.25, vUv.y);

    /* ── Streak noise: scrolling vertically, low frequency ── */
    vec2  nuv        = vec2(vUv.x * 1.8, vUv.y * 2.4 - uTime * 0.18);
    float streakNoise = mix(0.55, 1.0, vnoise(nuv));

    /* ── Slow breath ── */
    float breathe = 0.78 + 0.22 * sin(uTime * 0.52);

    /* ── Final alpha: strict product — any zero factor kills the pixel ── */
    float alpha = edgeX * edgeY * streakNoise * breathe * uOpacity;
    alpha       = clamp(alpha, 0.0, 1.0);

    /* Colour: slightly brighter at peak alpha for a glowing centre */
    vec3 col = uColor * (0.85 + edgeX * 0.35);

    gl_FragColor = vec4(col, alpha);
  }
`;

/* ═══════════════════════════════════════════════════════════════
   CAUSTIC RING — shaders (AdditiveBlending kept — sits on saucer)
═══════════════════════════════════════════════════════════════ */
const RING_VERT = /* glsl */`
  varying vec2 vUv;
  void main() {
    vUv         = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const RING_FRAG = /* glsl */`
  uniform float uTime;
  uniform vec3  uColor;
  uniform float uIntensity;

  varying vec2 vUv;

  void main() {
    vec2  uvc = vUv - 0.5;
    float r   = length(uvc) * 2.0;

    float ring1 = smoothstep(0.04,  0.0, abs(r - (0.45 + sin(uTime * 0.80) * 0.04)));
    float ring2 = smoothstep(0.03,  0.0, abs(r - (0.65 + sin(uTime * 0.60 + 1.0) * 0.03)));
    float ring3 = smoothstep(0.025, 0.0, abs(r - (0.82 + sin(uTime * 1.10 + 2.1) * 0.02)));
    float rings = ring1 * 0.9 + ring2 * 0.65 + ring3 * 0.45;

    float edge  = smoothstep(1.0, 0.65, r);
    float alpha = rings * edge * uIntensity * 0.55;
    gl_FragColor = vec4(uColor * 1.8, alpha);
  }
`;

/* ─── Colour presets ─────────────────────────────────────────── */
const MORNING_SHAFT = new THREE.Color(1.00, 0.95, 0.80);
const DUSK_SHAFT    = new THREE.Color(1.00, 0.68, 0.30);
const MORNING_RING  = new THREE.Color(0.90, 0.95, 0.65);
const DUSK_RING     = new THREE.Color(1.00, 0.75, 0.30);

/* ─── Public API ─────────────────────────────────────────────── */
export interface SunbeamsRef {
  setDusk: (isDusk: boolean) => void;
}

/* ─── Component ─────────────────────────────────────────────── */
const Sunbeams = forwardRef<SunbeamsRef>(function Sunbeams(_, ref) {

  const shaftGeos = useMemo<THREE.PlaneGeometry[]>(() => [
    new THREE.PlaneGeometry(0.60, 2.4, 1, 24),
    new THREE.PlaneGeometry(0.44, 2.0, 1, 20),
    new THREE.PlaneGeometry(0.32, 1.8, 1, 16),
  ], []);

  /* NormalBlending — no additive colour blowout on bright backgrounds */
  const shaftMats = useMemo<THREE.ShaderMaterial[]>(() =>
    [0, 1, 2].map(() => new THREE.ShaderMaterial({
      vertexShader:   SHAFT_VERT,
      fragmentShader: SHAFT_FRAG,
      uniforms: {
        uTime:    { value: 0 },
        uColor:   { value: MORNING_SHAFT.clone() },
        uOpacity: { value: 0.28 },            // keep shafts subtle
      },
      transparent: true,
      depthWrite:  false,
      blending:    THREE.NormalBlending,      // ← the fix
      side:        THREE.DoubleSide,
    })),
  []);

  /* Caustic ring — AdditiveBlending is correct on the dark ceramic saucer */
  const ringGeo = useMemo(() => new THREE.PlaneGeometry(0.95, 0.95, 1, 1), []);
  const ringMat = useMemo(() => new THREE.ShaderMaterial({
    vertexShader:   RING_VERT,
    fragmentShader: RING_FRAG,
    uniforms: {
      uTime:      { value: 0 },
      uColor:     { value: MORNING_RING.clone() },
      uIntensity: { value: 1.0 },
    },
    transparent: true,
    depthWrite:  false,
    blending:    THREE.AdditiveBlending,
    side:        THREE.DoubleSide,
  }), []);

  useImperativeHandle(ref, () => ({
    setDusk: (isDusk) => {
      const sc = isDusk ? DUSK_SHAFT : MORNING_SHAFT;
      const rc = isDusk ? DUSK_RING  : MORNING_RING;
      for (const m of shaftMats)
        (m.uniforms.uColor.value as THREE.Color).copy(sc);
      (ringMat.uniforms.uColor.value as THREE.Color).copy(rc);
    },
  }), [shaftMats, ringMat]);

  useEffect(() => () => {
    for (const g of shaftGeos) g.dispose();
    for (const m of shaftMats) m.dispose();
    ringGeo.dispose();
    ringMat.dispose();
  }, [shaftGeos, shaftMats, ringGeo, ringMat]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    for (const m of shaftMats) m.uniforms.uTime.value = t;
    ringMat.uniforms.uTime.value = t;
  });

  const shaftLayout = [
    { pos: [ 0.30,  0.90, -0.25] as [number,number,number],
      rot: [0.15,  0.52, -0.22]  as [number,number,number] },
    { pos: [-0.10,  0.70, -0.35] as [number,number,number],
      rot: [0.10,  0.80, -0.18]  as [number,number,number] },
    { pos: [ 0.55,  0.60, -0.15] as [number,number,number],
      rot: [0.20,  0.30, -0.28]  as [number,number,number] },
  ];

  return (
    <group>
      {shaftLayout.map(({ pos, rot }, i) => (
        <mesh
          key={i}
          geometry={shaftGeos[i]}
          material={shaftMats[i]}
          position={pos}
          rotation={rot}
        />
      ))}
      <mesh
        geometry={ringGeo}
        material={ringMat}
        position={[0, -0.055, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      />
    </group>
  );
});

export default Sunbeams;
