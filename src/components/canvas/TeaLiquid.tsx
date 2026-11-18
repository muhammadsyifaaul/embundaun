"use client";

/**
 * TeaLiquid.tsx — Phase 5
 *
 * New uniforms:
 *   uSlosh  vec2  — damped pointer-velocity / cup-accel tilts the meniscus
 *                   plane so the tea visibly sloshes when the cursor moves.
 *   uVortex float — 0→1 swirl that accelerates the floating leaves in a
 *                   clockwise vortex (triggered on brew switch + Craft section).
 *
 * Public API additions:
 *   setSlosh(x, y)    — called every frame by SceneContainer
 *   setVortex(v)      — called every frame by SceneContainer
 *   triggerVortex()   — fires a 1.0 vortex pulse that decays naturally
 */

import {
  useRef, useMemo, useEffect,
  forwardRef, useImperativeHandle,
} from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/* ─── Volume shader ──────────────────────────────────────────── */
const VOLUME_VERT = /* glsl */`
  uniform float uTime;
  uniform vec2  uSlosh;      // (x, y) lateral accel — tilts volume
  varying float vY;
  varying vec2  vUv;

  void main() {
    vY  = position.y;
    vUv = uv;
    vec3 pos = position;
    // Tilt the volume geometry to match the meniscus tilt
    pos.x += uSlosh.x * pos.y * 0.18;
    pos.z += uSlosh.y * pos.y * 0.18;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const VOLUME_FRAG = /* glsl */`
  uniform vec3  uColor;
  uniform float uFillMax;
  uniform float uRipple;
  uniform float uTime;

  varying float vY;
  varying vec2  vUv;

  void main() {
    float h       = clamp(vY / uFillMax, 0.0, 1.0);
    float caustic = smoothstep(0.6, 1.0, h);
    vec3 causticCol = mix(uColor * 2.2, vec3(1.0, 0.95, 0.5), 0.35);
    vec3 col      = mix(uColor * 0.55, causticCol, caustic * 0.75);
    float pulse   = uRipple * sin(h * 18.0 - uTime * 8.0) * 0.08;
    col          += pulse;
    float alpha   = mix(0.92, 0.72, h) * 0.86;
    gl_FragColor  = vec4(col, alpha);
  }
`;

/* ─── Meniscus shaders — now tilts via uSlosh ────────────────── */
const MENISCUS_VERT = /* glsl */`
  uniform float uTime;
  uniform float uRipple;
  uniform vec2  uSlosh;      // (x, z) lateral tilt of meniscus plane

  varying vec2  vUv;

  void main() {
    vUv = uv;
    vec3 pos = position;

    // Idle concentric ripple
    float r   = length(pos.xz);
    pos.y    += sin(r * 20.0 - uTime * 2.4) * 0.0035
              + sin(r * 13.0 - uTime * 1.7) * 0.0025;

    // Brew-switch extra swirl
    pos.y    += uRipple * sin(r * 32.0 - uTime * 14.0) * 0.012;

    // Physical slosh tilt — the meniscus plane tilts toward cursor accel
    // Uses dot product of position with slosh direction
    pos.y    += (pos.x * uSlosh.x + pos.z * uSlosh.y) * 0.22;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const MENISCUS_FRAG = /* glsl */`
  uniform vec3  uColor;
  uniform float uTime;
  varying vec2  vUv;
  void main() {
    float r   = length(vUv - 0.5) * 2.0;
    float rim = smoothstep(0.5, 1.0, r);
    vec3  col = mix(uColor * 1.35, uColor * 0.65, rim);
    float a   = mix(0.95, 0.60, rim);
    gl_FragColor = vec4(col, a);
  }
`;

/* ─── Liquid volume profile ──────────────────────────────────── */
const VOLUME_PTS: THREE.Vector2[] = [
  new THREE.Vector2(0.00, 0.03),
  new THREE.Vector2(0.08, 0.03),
  new THREE.Vector2(0.11, 0.07),
  new THREE.Vector2(0.16, 0.18),
  new THREE.Vector2(0.21, 0.32),
  new THREE.Vector2(0.25, 0.46),
  new THREE.Vector2(0.28, 0.58),
  new THREE.Vector2(0.00, 0.60),
];

function leafShape(): THREE.Shape {
  const s = new THREE.Shape();
  s.moveTo(0, 0);
  s.bezierCurveTo( 0.028,  0.038,  0.052,  0.062,  0.056,  0.088);
  s.bezierCurveTo( 0.052,  0.112,  0.028,  0.138,  0,       0.138);
  s.bezierCurveTo(-0.028,  0.138, -0.052,  0.112, -0.056,  0.088);
  s.bezierCurveTo(-0.052,  0.062, -0.028,  0.038,  0,       0    );
  return s;
}

/* ─── Leaf base positions (xz offsets on the meniscus) ──────── */
const LEAF_XZ = [
  [-0.055,  0.040],
  [ 0.075, -0.030],
  [-0.020, -0.090],
] as const;

/* ─── Public API ─────────────────────────────────────────────── */
export interface TeaLiquidRef {
  setColor:      (c: THREE.Color) => void;
  setSlosh:      (x: number, z: number) => void;
  setVortex:     (v: number) => void;
  triggerRipple: () => void;
  triggerVortex: () => void;
}

/* ─── Component ─────────────────────────────────────────────── */
const TeaLiquid = forwardRef<TeaLiquidRef>(function TeaLiquid(_, ref) {
  const leaf0 = useRef<THREE.Mesh>(null);
  const leaf1 = useRef<THREE.Mesh>(null);
  const leaf2 = useRef<THREE.Mesh>(null);
  const rippleRef = useRef(0);
  const vortexRef = useRef(0);    // 0→1, decays over time
  const sloshRef  = useRef(new THREE.Vector2(0, 0));

  const geoVolume   = useMemo(() => new THREE.LatheGeometry(VOLUME_PTS, 48), []);
  const geoMeniscus = useMemo(() => new THREE.CircleGeometry(0.280, 56), []);
  const shape       = useMemo(leafShape, []);
  const geoLeaf     = useMemo(() => new THREE.ExtrudeGeometry(shape, {
    depth: 0.004, bevelEnabled: true,
    bevelSize: 0.003, bevelThickness: 0.002, bevelSegments: 2,
  }), [shape]);

  const matVolume = useMemo(() => new THREE.ShaderMaterial({
    vertexShader:   VOLUME_VERT,
    fragmentShader: VOLUME_FRAG,
    uniforms: {
      uColor:   { value: new THREE.Color("#4C7A24") },
      uFillMax: { value: 0.60 },
      uRipple:  { value: 0 },
      uTime:    { value: 0 },
      uSlosh:   { value: new THREE.Vector2(0, 0) },
    },
    transparent: true,
    depthWrite:  false,
    side:        THREE.FrontSide,
  }), []);

  const matMeniscus = useMemo(() => new THREE.ShaderMaterial({
    vertexShader:   MENISCUS_VERT,
    fragmentShader: MENISCUS_FRAG,
    uniforms: {
      uTime:   { value: 0 },
      uColor:  { value: new THREE.Color("#4C7A24") },
      uRipple: { value: 0 },
      uSlosh:  { value: new THREE.Vector2(0, 0) },
    },
    transparent: true,
    depthWrite:  false,
    side:        THREE.DoubleSide,
  }), []);

  const matLeaf = useMemo(() => new THREE.MeshStandardMaterial({
    color:     new THREE.Color("#3A6B2F"),
    roughness: 0.65,
    metalness: 0.02,
  }), []);

  useImperativeHandle(ref, () => ({
    setColor: (c) => {
      (matVolume.uniforms.uColor.value   as THREE.Color).copy(c);
      (matMeniscus.uniforms.uColor.value as THREE.Color).copy(c);
    },
    setSlosh: (x, z) => {
      sloshRef.current.set(x, z);
    },
    setVortex: (v) => {
      vortexRef.current = Math.max(vortexRef.current, v);
    },
    triggerRipple: () => { rippleRef.current = 1.0; },
    triggerVortex: () => { vortexRef.current = 1.0; },
  }), [matVolume, matMeniscus]);

  useEffect(() => () => {
    geoVolume.dispose(); geoMeniscus.dispose(); geoLeaf.dispose();
    matVolume.dispose(); matMeniscus.dispose(); matLeaf.dispose();
  }, [geoVolume, geoMeniscus, geoLeaf, matVolume, matMeniscus, matLeaf]);

  useFrame(({ clock }, delta) => {
    const t = clock.getElapsedTime();

    // Decay transients
    rippleRef.current = Math.max(0, rippleRef.current - delta * 1.8);
    vortexRef.current = Math.max(0, vortexRef.current - delta * 0.6);

    // Push slosh to shaders
    const slosh = sloshRef.current;
    (matVolume.uniforms.uSlosh.value   as THREE.Vector2).copy(slosh);
    (matMeniscus.uniforms.uSlosh.value as THREE.Vector2).copy(slosh);

    matVolume.uniforms.uTime.value     = t;
    matVolume.uniforms.uRipple.value   = rippleRef.current;
    matMeniscus.uniforms.uTime.value   = t;
    matMeniscus.uniforms.uRipple.value = rippleRef.current;

    const vortex = vortexRef.current;
    const baseOrbR = 0.055;
    const leaves   = [
      { r: leaf0, freq: 0.70, phase: 0.0, idx: 0 },
      { r: leaf1, freq: 0.90, phase: 2.1, idx: 1 },
      { r: leaf2, freq: 0.60, phase: 4.2, idx: 2 },
    ];
    for (const { r, freq, phase, idx } of leaves) {
      if (!r.current) continue;
      const [bx, bz] = LEAF_XZ[idx];

      // Vortex: orbit leaves around the meniscus centre at growing speed
      const vortexAngle = t * (freq + vortex * 3.5) + phase;
      const vr = baseOrbR + vortex * 0.08;
      r.current.position.x = bx + Math.cos(vortexAngle) * vr * vortex;
      r.current.position.z = bz + Math.sin(vortexAngle) * vr * vortex;
      // Height bob
      r.current.position.y = 0.605 + Math.sin(t * freq + phase) * 0.005;
      // Spin accelerates during vortex
      r.current.rotation.y += (0.003 + vortex * 0.08) * (1 + delta * 10);
    }
  });

  return (
    <group>
      <mesh geometry={geoVolume}   material={matVolume}   renderOrder={1} />
      <mesh
        geometry={geoMeniscus}
        material={matMeniscus}
        position={[0, 0.600, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        renderOrder={1}
      />
      {LEAF_XZ.map(([bx, bz], i) => (
        <mesh
          key={i}
          ref={i === 0 ? leaf0 : i === 1 ? leaf1 : leaf2}
          geometry={geoLeaf}
          material={matLeaf}
          position={[bx, 0.605, bz]}
          rotation={[Math.PI / 2, 0, [0.3, -0.5, 1.1][i]]}
          scale={[1.00, 0.75, 0.65][i]}
          renderOrder={1}
        />
      ))}
    </group>
  );
});

export default TeaLiquid;
