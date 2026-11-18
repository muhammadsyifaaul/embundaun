"use client";

/**
 * AtmosphereParallax.tsx
 *
 * Attaches scroll-scrubbed GSAP parallax (y: -18 → 18) to the three
 * illustration containers inside AtmosphereSection, identified by
 * [data-atmo-illus] attributes.
 *
 * Uses scrub: true so the parallax tracks the scroll position continuously.
 * Runs inside gsap.context() — ctx.revert() cleans up all ScrollTriggers
 * and tweens on unmount.
 *
 * AGENTS.md: no React state mutations, clearProps on completion.
 */

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function AtmosphereParallax() {
  useEffect(() => {
    const ctx = gsap.context(() => {
      const illusts = document.querySelectorAll<HTMLElement>("[data-atmo-illus]");

      illusts.forEach((el) => {
        // Each illustration scrubs from y:-18 (enters viewport) to y:18 (exits)
        // giving a layered depth impression without overflowing the card.
        gsap.fromTo(
          el,
          { y: -18 },
          {
            y: 18,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start:   "top bottom",
              end:     "bottom top",
              scrub:   true,
            },
          },
        );
      });
    });

    return () => ctx.revert();
  }, []);

  return null;
}
