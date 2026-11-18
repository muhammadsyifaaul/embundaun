"use client";

/**
 * DustMotes.tsx
 * ~75 warm-green botanical dust motes drifting slowly in depth.
 * Uses THREE.Points with a custom shader so opacity/size react
 * to the lighting mode without React state inside useFrame.
 *
 * moteBrightnessRef is updated by SceneContainer via subscribe().
 */

import { useRef, useMemo, useEffect, forwardRef, useImperativeHandle } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const COUNT = 75;

const MOTE_VERT = /* glsl */`
  uniform float uTime;
  uniform float uSize;
  attribute float aSpeed;
  attribute float aOffset;
  varying float vAlpha;

  void main() {
    vec3 pos = position;
    // each mote drifts upward at its own speed, looping when it escapes top
    float t   = mod(aOffset + uTime * aSpeed, 6.0);
    pos.y    += t * 0.18 - 0.5;
    // gentle horizontal drift
    pos.x    += sin(aOffset * 3.7 + uTime * aSpeed * 0.4) * 0.12;
    pos.z    += cos(aOffset * 2.3 + uTime * aSpeed * 0.3) * 0.10;

    // fade in/out at top and bottom of travel range
    float cycle = t / 6.0;
    vAlpha = smoothstep(0.0, 0.15, cycle) * smoothstep(1.0, 0.75, cycle);

    vec4 mvPos   = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = uSize * (1.0 / -mvPos.z);
    gl_Position  = projectionMatrix * mvPos;
  }
`;

const MOTE_FRAG = /* glsl */`
  uniform vec3  uColor;
  uniform float uBrightness;
  varying float vAlpha;

  void main() {
    // soft circular point
    float d = length(gl_PointCoord - 0.5) * 2.0;
    float a = (1.0 - smoothstep(0.5, 1.0, d)) * vAlpha * uBrightness;
    gl_FragColor = vec4(uColor * uBrightness, a * 0.32);
  }
`;

export interface DustMotesRef {
  setBrightness: (v: number) => void;
}

const DustMotes = forwardRef<DustMotesRef>(function DustMotes(_, ref) {
  const pointsRef = useRef<THREE.Points>(null);

  /* Scatter positions & per-mote attributes once */
  const { geo, mat } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3);
    const speeds    = new Float32Array(COUNT);
    const offsets   = new Float32Array(COUNT);

    for (let i = 0; i < COUNT; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 5.0;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 3.5;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 3.0 - 0.5;
      speeds[i]   = 0.18 + Math.random() * 0.22;
      offsets[i]  = Math.random() * 6.0;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("aSpeed",   new THREE.BufferAttribute(speeds,    1));
    geometry.setAttribute("aOffset",  new THREE.BufferAttribute(offsets,   1));

    const material = new THREE.ShaderMaterial({
      vertexShader:   MOTE_VERT,
      fragmentShader: MOTE_FRAG,
      transparent:    true,
      depthWrite:     false,
      uniforms: {
        uTime:       { value: 0 },
        uSize:       { value: 22 },   // was 55 — reduced ~60%
        uColor:      { value: new THREE.Color("#94B84E") },
        uBrightness: { value: 1.0 },
      },
    });

    return { geo: geometry, mat: material };
  }, []);

  /* Expose setBrightness for SceneContainer */
  useImperativeHandle(ref, () => ({
    setBrightness: (v: number) => {
      mat.uniforms.uBrightness.value = v;
    },
  }), [mat]);

  /* Dispose */
  useEffect(() => () => {
    geo.dispose();
    mat.dispose();
  }, [geo, mat]);

  /* Tick */
  useFrame(({ clock }) => {
    mat.uniforms.uTime.value = clock.getElapsedTime();
  });

  return <points ref={pointsRef} geometry={geo} material={mat} />;
});

export default DustMotes;
