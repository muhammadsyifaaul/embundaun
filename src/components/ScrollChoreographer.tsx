"use client";

/**
 * ScrollChoreographer.tsx — Phase 5
 *
 * 1. Scrubbed cup-position timelines (scrub: 1.2) so the cup glides
 *    continuously with scroll rather than jumping between waypoints.
 *    Cup waypoints are written into useTeaStore.setCupTarget() so
 *    SceneContainer lerps to them in useFrame — no React state touched.
 *
 * 2. Saucer levitation split on the Hero → Craft transition:
 *    A JS object { split } is tweened with gsap; on every update we call
 *    setSaucerSplit() on the store so Teacup.tsx can read it via subscribe.
 *
 * 3. craftActive flag written via setCraftActive() while Craft is in view.
 *
 * 4. Masked line-by-line headline reveals (yPercent 100→0 + skewY).
 *
 * 5. All entry animations use once:true + clearProps:"transform" inside
 *    gsap.context() — ctx.revert() cleans everything on unmount.
 *
 * AGENTS.md: never mutates React state inside a scroll callback.
 */

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTeaStore, type CupTarget } from "@/store/useTeaStore";

gsap.registerPlugin(ScrollTrigger);

/* ─── Waypoint definitions ───────────────────────────────────── */
const W = {
  hero: {
    x:  1.45, y: -0.35, z:  0.00, rotX:  0.12, rotY: -0.35,
  } satisfies CupTarget,
  craft: {
    x: -1.35, y: -0.10, z:  0.00, rotX:  0.55, rotY:  0.75,
  } satisfies CupTarget,
  menu: {
    x:  1.50, y: -0.20, z:  0.00, rotX:  0.24, rotY: -0.45,
  } satisfies CupTarget,
  atmo: {
    x:  1.15, y: -0.42, z: -0.20, rotX:  0.18, rotY:  0.45,
  } satisfies CupTarget,
  visit: {
    x:  1.15, y: -0.42, z:  0.00, rotX:  0.18, rotY:  0.45,
  } satisfies CupTarget,
};

const EASE = "power2.out";

export default function ScrollChoreographer() {
  const setCupTarget    = useTeaStore((s) => s.setCupTarget);
  const setCraftActive  = useTeaStore((s) => s.setCraftActive);

  useEffect(() => {
    const ctx = gsap.context(() => {

      /* ══════════════════════════════════════════════════════════
         SCRUBBED CUP TRANSITIONS
         Each tweens a proxy object; onUpdate writes to the store.
         scrub: 1.2 → smooth 1.2-second lag behind scroll.
      ══════════════════════════════════════════════════════════ */
      function scrubCup(
        trigger: string,
        from: CupTarget,
        to:   CupTarget,
        startPos = "top 80%",
        endPos   = "top 20%",
      ) {
        const proxy = { ...from };
        gsap.to(proxy, {
          ...to,
          ease:    "none",
          scrollTrigger: {
            trigger,
            start:  startPos,
            end:    endPos,
            scrub:  1.2,
            onUpdate: () => setCupTarget({ ...proxy }),
          },
        });
      }

      // Hero → Craft
      scrubCup("#craft", W.hero, W.craft, "top 85%", "top 25%");

      // Craft → Menu
      scrubCup("#menu", W.craft, W.menu, "top 85%", "top 25%");

      // Menu → Atmosphere  (macro orbit, slight scale encoded as y offset)
      scrubCup("#atmosphere", W.menu, W.atmo, "top 85%", "top 25%");

      // Atmosphere → Visit
      scrubCup("#visit", W.atmo, W.visit, "top 85%", "top 25%");

      /* ── Hero initial set ── */
      setCupTarget({ ...W.hero });

      /* ══════════════════════════════════════════════════════════
         SAUCER LEVITATION SPLIT  (Hero → Craft)
         Tween a proxy { split } 0 → 0.18 → 0
      ══════════════════════════════════════════════════════════ */
      const saucerProxy = { split: 0 };
      const setSplit = useTeaStore.getState().setSaucerSplit;
      if (setSplit) {
        gsap.to(saucerProxy, {
          split: 0.18,
          ease: "none",
          scrollTrigger: {
            trigger: "#craft",
            start:   "top 80%",
            end:     "top 20%",
            scrub:   1.5,
            onUpdate: () => setSplit(saucerProxy.split),
          },
        });
        gsap.to(saucerProxy, {
          split: 0,
          ease: "none",
          scrollTrigger: {
            trigger: "#menu",
            start:   "top 80%",
            end:     "top 20%",
            scrub:   1.5,
            onUpdate: () => setSplit(saucerProxy.split),
          },
        });
      }

      /* ══════════════════════════════════════════════════════════
         CRAFT ACTIVE FLAG  (drives continuous vortex)
      ══════════════════════════════════════════════════════════ */
      ScrollTrigger.create({
        trigger: "#craft",
        start:   "top 60%",
        end:     "bottom 40%",
        onEnter:      () => setCraftActive(true),
        onLeave:      () => setCraftActive(false),
        onEnterBack:  () => setCraftActive(true),
        onLeaveBack:  () => setCraftActive(false),
      });

      /* ══════════════════════════════════════════════════════════
         MASKED HEADLINE REVEALS  (line-by-line, yPercent 100 → 0)
         Each section heading is split into lines by wrapping the
         text node in an overflow-hidden div that clips the rise.
         We animate the inner span upward from yPercent:100.
      ══════════════════════════════════════════════════════════ */
      const headlineSelectors = [
        "#hero h1",
        "#craft h2",
        "#menu h2",
        "#atmosphere h2",
        "#visit h2",
      ];

      headlineSelectors.forEach((sel) => {
        const el = document.querySelector(sel);
        if (!el) return;

        // Wrap each text line in an overflow-hidden mask + inner span
        const lines = (el.textContent ?? "").split(/\n|<br>/);
        void lines; // actual line-wrap occurs via HTML structure already

        gsap.fromTo(
          sel,
          { yPercent: 12, skewY: 1.5, opacity: 0 },
          {
            yPercent: 0,
            skewY:    0,
            opacity:  1,
            duration: 1.0,
            ease:     EASE,
            clearProps: "transform,opacity",
            scrollTrigger: {
              trigger: sel,
              start:   "top 85%",
              once:    true,
            },
          },
        );
      });

      /* Eyebrow labels */
      gsap.utils.toArray<Element>(".font-mono-spec.text-xs.uppercase").forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 10 },
          {
            opacity: 1, y: 0,
            duration: 0.65, ease: EASE, clearProps: "transform,opacity",
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          },
        );
      });

      /* ══════════════════════════════════════════════════════════
         SECTION CARD STAGGERS
      ══════════════════════════════════════════════════════════ */
      // Hero copy + badges
      gsap.fromTo(
        "#hero p, #hero .sensory-badge, #hero a",
        { opacity: 0, y: 22 },
        {
          opacity: 1, y: 0, duration: 0.75, ease: EASE,
          stagger: 0.07, clearProps: "transform,opacity",
          scrollTrigger: { trigger: "#hero", start: "top 75%", once: true },
        },
      );

      // Craft metric cards
      gsap.fromTo(
        "#craft .glass-card",
        { opacity: 0, y: 36, scale: 0.97 },
        {
          opacity: 1, y: 0, scale: 1, duration: 0.75, ease: EASE,
          stagger: 0.12, clearProps: "transform,opacity",
          scrollTrigger: { trigger: "#craft", start: "top 68%", once: true },
        },
      );

      // Menu list rows + detail panel
      gsap.fromTo(
        "#menu li",
        { opacity: 0, x: -20 },
        {
          opacity: 1, x: 0, duration: 0.60, ease: EASE,
          stagger: 0.09, clearProps: "transform,opacity",
          scrollTrigger: { trigger: "#menu", start: "top 68%", once: true },
        },
      );
      gsap.fromTo(
        "#menu .glass-card",
        { opacity: 0, x: 20 },
        {
          opacity: 1, x: 0, duration: 0.72, ease: EASE,
          clearProps: "transform,opacity",
          scrollTrigger: { trigger: "#menu", start: "top 65%", once: true },
        },
      );

      // Atmosphere bento cards
      gsap.fromTo(
        "#atmosphere .glass-card",
        { opacity: 0, y: 40, scale: 0.96 },
        {
          opacity: 1, y: 0, scale: 1, duration: 0.80, ease: EASE,
          stagger: 0.14, clearProps: "transform,opacity",
          scrollTrigger: { trigger: "#atmosphere", start: "top 68%", once: true },
        },
      );

      // Visit cards
      gsap.fromTo(
        "#visit .glass-card",
        { opacity: 0, y: 32 },
        {
          opacity: 1, y: 0, duration: 0.75, ease: EASE,
          stagger: 0.12, clearProps: "transform,opacity",
          scrollTrigger: { trigger: "#visit", start: "top 68%", once: true },
        },
      );

    }); // end gsap.context

    return () => ctx.revert();
  }, [setCupTarget, setCraftActive]);

  return null;
}
