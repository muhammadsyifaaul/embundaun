"use client";

/**
 * SceneContainer.tsx — Phase 5
 *
 * Additions vs Phase 4:
 *  • Pointer acceleration (delta-velocity) → uSlosh sent to TeaLiquid
 *  • Magnetic cup tilt: cupGroupRef rotates gently toward the cursor
 *  • triggerVortex() fired on brew switch AND when Craft section is active
 *  • Craft section flag written by ScrollChoreographer via setCraftActive()
 *    into useTeaStore (zero React state in frame loop)
 *
 * AGENTS.md guardrails — all Zustand reads via .subscribe() into refs,
 * all mutations in useFrame, no React state touched inside frame loop.
 */

import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Environment, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";

import Teacup                              from "./Teacup";
import TeaLiquid,  { type TeaLiquidRef }   from "./TeaLiquid";
import SteamShader, {
  type SteamShaderRef,
  STEAM_COLOR_MORNING,
  STEAM_COLOR_DUSK,
}                                          from "./SteamShader";
import DustMotes,  { type DustMotesRef }   from "./DustMotes";
import FloatingLeaves                      from "./FloatingLeaves";
import Sunbeams,   { type SunbeamsRef }    from "./Sunbeams";
import {
  useTeaStore,
  DEFAULT_CUP_TARGET,
  type CupTarget,
}                                          from "@/store/useTeaStore";

/* ─── Helpers ────────────────────────────────────────────────── */
const hex2col  = (h: string) => new THREE.Color(h);
const lerpN    = (a: number, b: number, t: number) => a + (b - a) * t;

/* ─── Pointer tracking — position + velocity + acceleration ──── */
let _mouseX    = 0;
let _mouseY    = 0;
let _velX      = 0;
let _velY      = 0;
let _accelX    = 0;
let _accelY    = 0;
let _prevVelX  = 0;
let _prevVelY  = 0;
let _dampWind  = 0;
let _rawWind   = 0;

function trackPointer(e: MouseEvent) {
  const nx = (e.clientX / window.innerWidth)  * 2 - 1;   // -1..1
  const ny = (e.clientY / window.innerHeight) * 2 - 1;

  _velX   = nx - _mouseX;
  _velY   = ny - _mouseY;
  _accelX = _velX - _prevVelX;
  _accelY = _velY - _prevVelY;
  _prevVelX = _velX;
  _prevVelY = _velY;
  _mouseX = nx;
  _mouseY = ny;
  _rawWind = _velX * 5.0;
}

/* ─── Component ─────────────────────────────────────────────── */
export default function SceneContainer() {
  const liquidRef   = useRef<TeaLiquidRef>(null);
  const steamRef    = useRef<SteamShaderRef>(null);
  const motesRef    = useRef<DustMotesRef>(null);
  const sunbeamsRef = useRef<SunbeamsRef>(null);
  const cupGroupRef = useRef<THREE.Group>(null);

  /* Colour/density lerp targets */
  const targetColor    = useRef(hex2col("#4C7A24"));
  const targetDensity  = useRef(0.80);
  const targetSteamCol = useRef(STEAM_COLOR_MORNING.clone());
  const currentColor   = useRef(hex2col("#4C7A24"));
  const currentDensity = useRef(0.80);

  /* Cup position target */
  const targetCup  = useRef<CupTarget>({ ...DEFAULT_CUP_TARGET });
  const currentCup = useRef<CupTarget>({ ...DEFAULT_CUP_TARGET });

  /* Slosh damping */
  const sloshX = useRef(0);
  const sloshZ = useRef(0);

  /* Magnetic tilt targets */
  const magTiltX = useRef(0);
  const magTiltZ = useRef(0);

  /* Vortex continuity during Craft section */
  const craftActive = useRef(false);

  const { camera } = useThree();
  const camDrift   = useRef(new THREE.Vector3());

  /* ── Zustand subscription ── */
  useEffect(() => {
    const s = useTeaStore.getState();
    targetColor.current    = hex2col(s.activeTea.liquidColor);
    targetDensity.current  = s.activeTea.steamDensity;
    targetSteamCol.current = s.lighting === "dusk"
      ? STEAM_COLOR_DUSK.clone() : STEAM_COLOR_MORNING.clone();
    targetCup.current = { ...s.cupTarget };

    let prevTeaId = s.activeTea.id;

    const unsub = useTeaStore.subscribe((state) => {
      targetColor.current    = hex2col(state.activeTea.liquidColor);
      targetDensity.current  = state.activeTea.steamDensity;
      targetSteamCol.current = state.lighting === "dusk"
        ? STEAM_COLOR_DUSK.clone() : STEAM_COLOR_MORNING.clone();
      motesRef.current?.setBrightness(state.lighting === "dusk" ? 0.55 : 1.0);
      sunbeamsRef.current?.setDusk(state.lighting === "dusk");
      targetCup.current = { ...state.cupTarget };
      craftActive.current = state.craftActive ?? false;

      if (state.activeTea.id !== prevTeaId) {
        prevTeaId = state.activeTea.id;
        liquidRef.current?.triggerRipple();
        liquidRef.current?.triggerVortex();
        steamRef.current?.triggerSurge();
      }
    });

    window.addEventListener("mousemove", trackPointer, { passive: true });
    return () => {
      unsub();
      window.removeEventListener("mousemove", trackPointer);
    };
  }, []);

  /* ── Frame loop ── */
  useFrame((_, delta) => {
    const k  = 1 - Math.pow(0.03, delta);
    const ks = Math.min(delta * 10, 1); // fast slosh damping

    /* Colour lerp */
    currentColor.current.lerp(targetColor.current, k);
    liquidRef.current?.setColor(currentColor.current);

    /* Steam */
    currentDensity.current = lerpN(currentDensity.current, targetDensity.current, k);
    steamRef.current?.setDensity(currentDensity.current);
    steamRef.current?.setColor(targetSteamCol.current);

    /* Wind */
    _dampWind += (_rawWind - _dampWind) * Math.min(delta * 12, 1);
    _rawWind  *= 0.84;
    steamRef.current?.setWind(_dampWind);

    /* Slosh — driven by pointer acceleration, damped */
    sloshX.current += (_accelX * 2.2 - sloshX.current) * ks;
    sloshZ.current += (_accelY * 2.2 - sloshZ.current) * ks;
    sloshX.current *= 0.92;
    sloshZ.current *= 0.92;
    _accelX *= 0.80;
    _accelY *= 0.80;
    liquidRef.current?.setSlosh(sloshX.current, sloshZ.current);

    /* Vortex — continuous during Craft section */
    if (craftActive.current) {
      liquidRef.current?.setVortex(0.55);
    }

    /* Cup group lerp */
    if (cupGroupRef.current) {
      const t = targetCup.current, c = currentCup.current;
      c.x    = lerpN(c.x,    t.x,    k * 0.55);
      c.y    = lerpN(c.y,    t.y,    k * 0.55);
      c.z    = lerpN(c.z,    t.z,    k * 0.55);
      c.rotX = lerpN(c.rotX, t.rotX, k * 0.45);
      c.rotY = lerpN(c.rotY, t.rotY, k * 0.45);

      /* Magnetic pointer tilt — cup leans slightly toward cursor */
      magTiltX.current += (_mouseY * 0.04 - magTiltX.current) * k * 0.5;
      magTiltZ.current += (_mouseX * 0.03 - magTiltZ.current) * k * 0.5;

      cupGroupRef.current.position.set(c.x, c.y, c.z);
      cupGroupRef.current.rotation.x = c.rotX + magTiltX.current;
      cupGroupRef.current.rotation.y = c.rotY;
      cupGroupRef.current.rotation.z = magTiltZ.current;
    }

    /* Camera drift */
    const now = Date.now();
    camDrift.current.x = Math.sin(now * 0.00018) * 0.055;
    camDrift.current.y = Math.cos(now * 0.00011) * 0.028;
    camera.position.x += (camDrift.current.x  - camera.position.x) * 0.012;
    camera.position.y += (camDrift.current.y + 0.28 - camera.position.y) * 0.012;
  });

  return (
    <>
      <Environment preset="dawn" />
      <ambientLight intensity={0.70} color="#F4EDD8" />
      <directionalLight
        position={[3, 5, 2]}
        intensity={1.5}
        color="#FFF8EE"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <directionalLight position={[-2, 2, -1]} intensity={0.35} color="#DCE7D8" />

      <PerspectiveCamera makeDefault position={[0, 0.3, 4.5]} fov={42} />

      <group ref={cupGroupRef}>
        <Teacup />
        <TeaLiquid   ref={liquidRef} />
        <SteamShader ref={steamRef}  />
      </group>

      <DustMotes      ref={motesRef}    />
      <FloatingLeaves />
      <Sunbeams       ref={sunbeamsRef} />
    </>
  );
}
