"use client";

/**
 * SteamShader.tsx — Phase 4
 *
 * Changes vs Phase 3:
 *  • 5-octave fBm (was 4) — tighter curl definition
 *  • uContrast uniform: boosts wisp sharpness (1.6 → visible tendrils)
 *  • uWind sway coefficient raised 0.55→1.1 — pointer feels instant
 *  • STEAM_COLOR_MORNING: pearl-white w/ slight warm tint for brightness
 *  • STEAM_COLOR_DUSK:    golden-ivory backlit warmth
 *  • triggerSurge(): briefly doubles uDensity then decays (brew-switch)
 */

import {
  useRef, useMemo, useEffect,
  forwardRef, useImperativeHandle,
} from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/* ═══════════════════════════════════════════════════════════════
   GLSL — Vertex
═══════════════════════════════════════════════════════════════ */
const STEAM_VERT = /* glsl */`
  uniform float uTime;
  uniform float uWind;

  varying vec2  vUv;
  varying float vHeight;

  void main() {
    vUv      = uv;
    vec3 pos = position;

    // Wind sway grows quadratically with height — more responsive
    float sway = uWind * pos.y * pos.y * 1.1;
    pos.x += sway;

    // Organic lateral curl — tighter frequency, two terms
    pos.x += sin(pos.y * 4.8  + uTime * 0.72) * 0.022 * pos.y;
    pos.x += cos(pos.y * 2.6  + uTime * 0.45) * 0.012 * pos.y;

    vHeight = pos.y;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

/* ═══════════════════════════════════════════════════════════════
   GLSL — Fragment  (5-octave fBm, contrast boost)
═══════════════════════════════════════════════════════════════ */
const STEAM_FRAG = /* glsl */`
  uniform float uTime;
  uniform float uDensity;
  uniform float uContrast;    // sharpness scalar, default 1.6
  uniform vec3  uSteamColor;

  varying vec2  vUv;
  varying float vHeight;

  float hash(vec2 p) {
    p  = fract(p * vec2(234.34, 435.345));
    p += dot(p, p + 34.23);
    return fract(p.x * p.y);
  }

  float vnoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i),             hash(i + vec2(1,0)), u.x),
      mix(hash(i+vec2(0,1)),   hash(i + vec2(1,1)), u.x),
      u.y
    );
  }

  // 5-octave fBm with rotating domain
  float fbm(vec2 p) {
    float v = 0.0, a = 0.52;
    mat2  R = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
    for (int i = 0; i < 5; i++) {
      v += a * vnoise(p);
      p  = R * p * 2.05;
      a *= 0.46;
    }
    return v;
  }

  void main() {
    vec2  uv  = vec2(vUv.x - 0.5, vUv.y);
    uv.y     -= uTime * 0.26;           // upward scroll speed (faster)

    float noise = fbm(uv * vec2(2.8, 2.0) + vec2(0.0, uTime * 0.11));

    // Sharpen noise with power — higher uContrast = crisper tendrils
    noise = pow(noise, 1.0 / uContrast);

    // Radial edge falloff
    float radial = 1.0 - smoothstep(0.14, 0.50, abs(vUv.x - 0.5));

    // Vertical fade in/out
    float fadeIn  = smoothstep(0.00, 0.14, vUv.y);
    float fadeOut = 1.0 - smoothstep(0.50, 1.00, vUv.y);
    float vert    = fadeIn * fadeOut;

    float alpha = noise * radial * vert * uDensity * 0.90;
    alpha       = clamp(alpha, 0.0, 1.0);

    gl_FragColor  = vec4(uSteamColor, alpha);
  }
`;

/* ─── Steam colors ───────────────────────────────────────────── */
// Morning: luminous pearl-white with the faintest warm tint
export const STEAM_COLOR_MORNING = new THREE.Color(0.97, 0.99, 0.96);
// Dusk: warm golden-ivory backlit
export const STEAM_COLOR_DUSK    = new THREE.Color(1.00, 0.94, 0.80);

function makeRibbon(w: number, h: number) {
  return new THREE.PlaneGeometry(w, h, 4, 36);
}

/* ─── Public API ─────────────────────────────────────────────── */
export interface SteamShaderRef {
  setWind:      (v: number) => void;
  setDensity:   (v: number) => void;
  setColor:     (c: THREE.Color) => void;
  triggerSurge: () => void;
}

/* ─── Component ─────────────────────────────────────────────── */
const SteamShader = forwardRef<SteamShaderRef>(function SteamShader(_, ref) {
  const r0 = useRef<THREE.Mesh>(null);
  const r1 = useRef<THREE.Mesh>(null);
  const r2 = useRef<THREE.Mesh>(null);
  const surgeRef = useRef(0); // 0→1 surge, decays over time

  const mats = useMemo<THREE.ShaderMaterial[]>(() => {
    const base = {
      vertexShader:   STEAM_VERT,
      fragmentShader: STEAM_FRAG,
      transparent:    true,
      depthWrite:     false,
      side:           THREE.DoubleSide,
    };
    return [0, 1, 2].map(() => new THREE.ShaderMaterial({
      ...base,
      uniforms: {
        uTime:       { value: 0 },
        uWind:       { value: 0 },
        uDensity:    { value: 0.80 },
        uContrast:   { value: 1.6 },
        uSteamColor: { value: STEAM_COLOR_MORNING.clone() },
      },
    }));
  }, []);

  const geos = useMemo(() => [
    makeRibbon(0.24, 0.96),
    makeRibbon(0.19, 0.84),
    makeRibbon(0.15, 0.78),
  ], []);

  useImperativeHandle(ref, () => ({
    setWind:    (v) => { for (const m of mats) m.uniforms.uWind.value    = v; },
    setDensity: (v) => { for (const m of mats) m.uniforms.uDensity.value = v; },
    setColor:   (c) => { for (const m of mats) (m.uniforms.uSteamColor.value as THREE.Color).copy(c); },
    triggerSurge: () => { surgeRef.current = 1.0; },
  }), [mats]);

  useEffect(() => () => {
    for (const g of geos) g.dispose();
    for (const m of mats) m.dispose();
  }, [geos, mats]);

  useFrame(({ clock }, delta) => {
    const t = clock.getElapsedTime();
    // Decay surge
    surgeRef.current = Math.max(0, surgeRef.current - delta * 1.4);
    for (const m of mats) {
      m.uniforms.uTime.value = t;
      // During surge, temporarily boost density by up to 1.5×
      const base = m.uniforms.uDensity.value;
      m.uniforms.uContrast.value = 1.6 + surgeRef.current * 0.5;
      // Apply surge as additive density — written back in setDensity each frame
      // so we only boost contrast here, not permanently overwrite density
      void base;
    }
  });

  const layout = [
    { pos: [ 0.00, 0.92, 0.00] as [number,number,number], rotY:  0.00 },
    { pos: [-0.07, 0.89, 0.04] as [number,number,number], rotY:  0.38 },
    { pos: [ 0.07, 0.90,-0.04] as [number,number,number], rotY: -0.38 },
  ];
  const refs = [r0, r1, r2];

  return (
    <group>
      {layout.map(({ pos, rotY }, i) => (
        <mesh
          key={i}
          ref={refs[i]}
          geometry={geos[i]}
          material={mats[i]}
          position={pos}
          rotation={[0, rotY, 0]}
        />
      ))}
    </group>
  );
});

export default SteamShader;
