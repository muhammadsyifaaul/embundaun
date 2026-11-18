"use client";

/**
 * TeaCanvas.tsx
 * Persistent fixed full-viewport R3F Canvas.
 * Mounted once at layout level — sits behind all page sections.
 * pointer-events-none so scroll and clicks pass through to HTML.
 *
 * AGENTS.md: dpr={[1, 2]} clamped.
 * Camera is controlled by <PerspectiveCamera makeDefault /> inside SceneContainer;
 * we omit the `camera` prop here so R3F does not create a competing default.
 */

import dynamic from "next/dynamic";
import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";

const SceneContainer = dynamic(() => import("./SceneContainer"), { ssr: false });

export default function TeaCanvas() {
  return (
    <div
      aria-hidden="true"
      style={{
        position:      "fixed",
        inset:         0,
        width:         "100vw",
        height:        "100vh",
        pointerEvents: "none",
        zIndex:        0,
      }}
    >
      <Canvas
        dpr={[1, 2]}
        gl={{
          alpha:                 true,
          antialias:             true,
          preserveDrawingBuffer: false,
          powerPreference:       "high-performance",
        }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <SceneContainer />
        </Suspense>
      </Canvas>
    </div>
  );
}
