/**
 * HeroSection.tsx  — Phase 2
 * Left column: editorial copy, sensory badges, CTA.
 * Right column: transparent void — the fixed R3F canvas (z-0)
 *   renders the 3D teacup exactly here through the transparent bg.
 */

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center pt-16"
      style={{ background: "transparent" }}  /* let canvas show through */
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-20">

        {/* ── Left: editorial copy ── */}
        <div className="flex flex-col gap-8 max-w-xl hero-copy">

          {/* Eyebrow */}
          <p
            className="font-mono-spec text-xs tracking-[0.2em] uppercase"
            style={{ color: "var(--color-green-accent)" }}
          >
            Single-Origin · Highland Indonesia
          </p>

          {/* Headline */}
          <h1
            className="text-5xl sm:text-6xl xl:text-7xl leading-[1.0] tracking-tight"
            style={{ fontFamily: "var(--font-fraunces)", color: "var(--color-ink)" }}
          >
            Where the{" "}
            <em className="not-italic" style={{ color: "var(--color-green-accent)" }}>
              leaf
            </em>{" "}
            meets the{" "}
            <em className="not-italic" style={{ color: "var(--color-brew)" }}>
              dew.
            </em>
          </h1>

          {/* Subcopy */}
          <p className="text-lg leading-relaxed" style={{ color: "var(--color-muted)" }}>
            A quiet tasting room devoted to whole-leaf teas from Indonesian
            highlands. Each cup is brewed at precision temperature, steeped in
            silence, and served with unhurried intention.
          </p>

          {/* Sensory badges */}
          <div className="flex flex-wrap gap-2.5">
            {[
              "Single-Origin Leaves",
              "75°C – 90°C Precision Brew",
              "Whole-Leaf Only",
              "1,450 m Altitude",
            ].map((badge) => (
              <span key={badge} className="sensory-badge">
                {badge}
              </span>
            ))}
          </div>

          {/* CTA row */}
          <div className="flex items-center gap-4 pt-2">
            <a
              href="#menu"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5"
              style={{
                background: "var(--color-green-deep)",
                color: "#F4F7F2",
                fontFamily: "var(--font-jakarta)",
              }}
            >
              Explore the Menu
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
            <a
              href="#craft"
              className="text-sm font-medium underline underline-offset-4 transition-opacity hover:opacity-60"
              style={{ color: "var(--color-muted)" }}
            >
              Our Craft
            </a>
          </div>
        </div>

        {/* ── Right: empty — 3D canvas shows through here ── */}
        <div className="hidden lg:block" aria-hidden="true" />
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
        <span
          className="font-mono-spec text-[10px] tracking-widest uppercase"
          style={{ color: "var(--color-muted)" }}
        >
          Scroll
        </span>
        <div
          className="w-px h-10 animate-pulse"
          style={{ background: "var(--color-green-accent)" }}
        />
      </div>
    </section>
  );
}
