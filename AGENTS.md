# AGENTS.md — Embun & Daun (Interactive 3D Tea House Portfolio)

## 1. PROJECT OVERVIEW & PORTFOLIO GOAL
- **Brand Concept:** **Embun & Daun** — An artisanal botanical tea house & quiet tasting room (Static Portfolio Showcase).
- **Goal:** Demonstrate high-craft WebGL shaders, procedural 3D modeling, sunlit botanical UI design, and fluid GSAP scroll choreography without any backend or e-commerce complexity.
- **Signature Interactive Features:**
  1. **Interactive GLSL Hot Steam (`SteamShader`):** Curling, translucent vapor rising from a glass teacup that bends and swirls in real time when the user's cursor moves through it (`uWind` velocity uniform).
  2. **Live Menu-to-3D Brew Sync:** Clicking any tea on the static house menu smoothly lerps the 3D tea liquid color, steam density, and floating leaf hue.
  3. **Ambiance Lighting Toggle (`Morning Mist` | `Dusk Pavilion`):** Switches the 3D scene and UI tokens between fresh morning sunlight and warm late-afternoon tea house lighting.

## 2. VISUAL IDENTITY & DESIGN TOKENS
- **Aesthetic Direction:** Sunlit Botanical Minimalism — fresh, airy, organic, and tactile.
- **Color Palette (Morning Mist Default):**
  - Primary Background: `#F4F7F2` (Morning Dew Alabaster)
  - Secondary Section Tint: `#E9F0E5` (Soft Leaf Mist)
  - Translucent Glass Cards: `rgba(255, 255, 255, 0.72)` with `backdrop-filter: blur(14px)` and `1px solid rgba(30, 70, 47, 0.12)`
  - Primary Botanical Green: `#1E462F` (Deep Sencha Leaf)
  - Fresh Sprout Accent: `#4F8A53` (Vibrant Young Leaf)
  - Tea Liquid Base Color: `#94B84E` (Luminous Golden-Green Brew)
  - Primary Text / Ink: `#122118` (Forest Charcoal)
  - Muted Text: `#4A6153` (Sage Slate)
- **Typography:**
  - Editorial Headings: `Fraunces` (Soft, organic high-contrast serif)
  - Body & Navigation: `Plus Jakarta Sans`
  - Technical Specs (`75°C`, `02:30 MIN`, Origin Altitude): `JetBrains Mono`

## 3. 3D SCENE ARCHITECTURE (THREE.JS / REACT THREE FIBER)
- **Fixed Persistent Canvas (`/src/components/canvas/`):**
  - Mounted once as `fixed inset-0 w-screen h-screen pointer-events-none z-0` behind transparent/translucent sections.
- **3D Scene Elements:**
  1. **Handcrafted Double-Walled Glass Teacup & Coaster (`LatheGeometry`):** Smooth sculpted glass vessel (`MeshPhysicalMaterial` with subtle transmission/roughness) resting on a minimalist dark-wood/stoneware saucer.
  2. **Brewed Tea Liquid & Floating Leaves:** Translucent liquid mesh inside the cup with gentle vertex surface ripples + 3 small curved procedural tea leaves (`ExtrudeGeometry`) bobbing slowly on the surface.
  3. **Interactive Hot Steam (`SteamShader.tsx`):**
     - 3 layered curved ribbon planes rising above the cup rim using a custom GLSL `ShaderMaterial` (`transparent: true`, `depthWrite: false`).
     - Fragment shader animates upward-scrolling fBm/Simplex noise with soft radial and vertical `smoothstep` edge falloff so steam wisps dissolve cleanly with zero hard borders.
     - Vertex/fragment shader displaces horizontally based on damped pointer velocity (`uWind`) so moving the cursor across the cup visibly stirs the hot vapor.
  4. **Sunlit Botanical Dust Motes (`Points`):** ~75 soft warm-green floating particles drifting slowly in depth.
- **Scroll Choreography (GSAP ScrollTrigger + Lenis):**
  - **Hero:** Teacup framed on the right (`x: 1.4`), emitting gentle morning steam that reacts to cursor movement.
  - **The Craft / Origins:** Camera orbits smoothly to an elevated 3/4 inspection angle looking into the translucent tea leaves.
  - **House Menu & Brews:** Cup shifts cleanly alongside the interactive menu list so users see the brew color and steam change as they click different teas.
  - **Atmosphere & Visit:** Cup settles gracefully into a calm closing composition beside the tea house hours & location card.

## 4. STATIC SITE SECTIONS
1. **Airy Floating Header:** Minimalist leaf-mark + `EMBUN & DAUN` wordmark (left), anchor links `Craft`, `Menu`, `Atmosphere`, `Visit` (center), and `[ Morning | Dusk ]` lighting toggle pill (right).
2. **Hero Section (100vh):** Fresh editorial serif headline, concise poetic subcopy, quick sensory badges (`Single-Origin Leaves · 75°C–90°C Precision Brew`), and persistent 3D steaming teacup.
3. **The Craft & Harvest Origins:** 3-column botanical metrics (`1,450m` Highland Altitude, `78°C` Ideal Extraction, `100%` Whole-Leaf Harvest) + editorial story about slow steeping.
4. **Interactive House Menu (Static Showcase):** Curated list of 4 signature brews (*Ciwidey First-Flush Sencha*, *Wonosobo Jasmine Pearl*, *Jatiluwih White Peony*, *Kintamani Roasted Hojicha*). Clicking a brew updates the active state, displays tasting notes & pairing suggestions, and smoothly shifts the 3D tea color and steam intensity.
5. **Tea House Atmosphere (Bento Grid):** 3 clean visual/architectural cards highlighting *The Quiet Tatami Corner*, *Hand-Thrown Stoneware*, and *Morning Garden Terrace* using bespoke vector architectural illustrations and smooth hover elevation.
6. **Visit & Hours (Static Closing Section):** Tea house address, opening hours (`Tue–Sun, 08:00 – 21:00`), quiet-space etiquette note, and clean portfolio footer.

## 5. STRICT ENGINEERING & PERFORMANCE GUARDRAILS
- **Tailwind v4 Production CSS Safety:** Place `@import "tailwindcss";` and `@source "../**/*.{ts,tsx}";` strictly at line 1 of `src/app/globals.css`. Keep all base resets inside `@layer base`.
- **Zero React State Mutations in `useFrame`:** Read Zustand store changes via `.subscribe()` into `useRef`s; update shader uniforms (`uTime`, `uWind`, `uSteamDensity`), liquid color lerping, and camera targets directly inside `useFrame`.
- **Aligned Grids & GSAP Safety:** Always apply `items-stretch` on multi-column card grids and use `gsap.fromTo(..., { clearProps: "transform", scrollTrigger: { once: true } })` inside `gsap.context()` so cards never freeze at uneven heights.
- **GPU Memory Hygiene:** Explicitly call `.dispose()` on all custom geometries, materials, and shaders on unmount. Clamp `<Canvas dpr={[1, 2]}>`.