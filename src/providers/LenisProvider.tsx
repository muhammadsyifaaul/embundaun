"use client";

/**
 * LenisProvider.tsx
 *
 * Mounts one Lenis instance for the page and drives it exclusively
 * through GSAP's ticker — the standard pattern for GSAP + Lenis.
 *
 *   gsap.ticker.add((time) => lenis.raf(time * 1000))
 *   gsap.ticker.lagSmoothing(0)   ← prevents large dt spikes
 *
 * Full cleanup on unmount: ticker removed, lenis.destroy() called.
 * Children render immediately; Lenis initialises only on the client.
 */

import { createContext, useContext, useEffect, useRef } from "react";
import Lenis from "lenis";
import gsap from "gsap";

const LenisContext = createContext<Lenis | null>(null);

/** Access the Lenis instance from any client component if needed. */
export function useLenis() {
  return useContext(LenisContext);
}

export default function LenisProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration:   1.2,
      easing:     (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      autoRaf:    false,          // we drive raf manually via GSAP ticker
    });

    lenisRef.current = lenis;

    // Sync Lenis with GSAP ticker — time arrives in seconds, lenis.raf wants ms
    const onTick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);  // prevent large delta spikes after tab blur

    return () => {
      gsap.ticker.remove(onTick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return (
    <LenisContext.Provider value={lenisRef.current}>
      {children}
    </LenisContext.Provider>
  );
}
