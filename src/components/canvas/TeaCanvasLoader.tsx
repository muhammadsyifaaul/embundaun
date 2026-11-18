"use client";

/**
 * TeaCanvasLoader.tsx
 * Client Component wrapper — required because `ssr: false` dynamic
 * imports are not allowed in Server Components (Next.js App Router).
 *
 * Suppresses two categories of irrelevant dev-console noise:
 *
 *  1. THREE.Clock deprecation warning — originates inside R3F 9.x using
 *     THREE.Clock against Three r183+.  Harmless; R3F hasn't migrated yet.
 *     Intercepted via console.warn filter.
 *
 *  2. MetaMask unhandledRejection — fired by the MetaMask browser extension
 *     (chrome-extension://ejbalbakoplchlghecdalmeeeajnimhm) on every page load.
 *     Not our code.  Intercepted via window 'unhandledrejection' and
 *     preventDefault() so the Next.js dev overlay doesn't surface it as an
 *     application error.
 *
 * Both handlers restore / remove cleanly on component unmount.
 */

import dynamic from "next/dynamic";
import { useEffect } from "react";

const TeaCanvas = dynamic(() => import("./TeaCanvas"), { ssr: false });

export default function TeaCanvasLoader() {
  useEffect(() => {
    /* ── 1. THREE.Clock deprecation ── */
    const origWarn = console.warn.bind(console);
    console.warn = (...args: unknown[]) => {
      if (typeof args[0] === "string" && args[0].includes("THREE.Clock")) return;
      origWarn(...args);
    };

    /* ── 2. MetaMask unhandledRejection ── */
    const onUnhandled = (e: PromiseRejectionEvent) => {
      const msg = String(e.reason);
      // Only swallow rejections that come unambiguously from the MetaMask extension.
      if (msg.includes("Failed to connect to MetaMask")) {
        e.preventDefault();   // stops Next.js dev overlay from showing it
        e.stopImmediatePropagation();
      }
    };
    window.addEventListener("unhandledrejection", onUnhandled);

    return () => {
      console.warn = origWarn;
      window.removeEventListener("unhandledrejection", onUnhandled);
    };
  }, []);

  return <TeaCanvas />;
}
