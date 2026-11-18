/* Tea House Atmosphere — Bento Grid
   3 cards with bespoke botanical SVG architectural illustrations.
   All grids use items-stretch per AGENTS.md guardrail. */

/* ─── Illustration: Tatami Corner ───────────────────────────── */
function TatamiIllustration() {
  return (
    <svg viewBox="0 0 240 180" fill="none" className="w-full h-full" aria-hidden="true">
      {/* Floor mat */}
      <rect x="20" y="130" width="200" height="30" rx="3"
        fill="var(--color-green-deep)" fillOpacity="0.08"
        stroke="var(--glass-border)" strokeWidth="1" />
      {/* Mat grid lines */}
      <line x1="80" y1="130" x2="80" y2="160" stroke="var(--glass-border)" strokeWidth="0.5" />
      <line x1="140" y1="130" x2="140" y2="160" stroke="var(--glass-border)" strokeWidth="0.5" />
      <line x1="20" y1="145" x2="220" y2="145" stroke="var(--glass-border)" strokeWidth="0.5" />

      {/* Low table */}
      <rect x="70" y="110" width="100" height="8" rx="2"
        fill="var(--color-green-deep)" fillOpacity="0.6" />
      <rect x="78" y="118" width="4" height="12" rx="1"
        fill="var(--color-green-deep)" fillOpacity="0.5" />
      <rect x="158" y="118" width="4" height="12" rx="1"
        fill="var(--color-green-deep)" fillOpacity="0.5" />

      {/* Teacup on table */}
      <ellipse cx="120" cy="111" rx="10" ry="4"
        fill="var(--color-bg-primary)" stroke="var(--glass-border)" strokeWidth="0.8" />
      <path d="M110 111 L111 120 Q120 123 129 120 L130 111"
        fill="var(--glass-bg)" stroke="var(--glass-border)" strokeWidth="0.8" />
      <ellipse cx="120" cy="113" rx="8" ry="2"
        fill="var(--color-brew)" fillOpacity="0.5" />

      {/* Shoji window */}
      <rect x="30" y="20" width="80" height="90" rx="2"
        fill="var(--color-bg-primary)" fillOpacity="0.6"
        stroke="var(--glass-border)" strokeWidth="1" />
      {/* Window grid */}
      <line x1="30" y1="50" x2="110" y2="50" stroke="var(--glass-border)" strokeWidth="0.6" />
      <line x1="30" y1="80" x2="110" y2="80" stroke="var(--glass-border)" strokeWidth="0.6" />
      <line x1="70" y1="20" x2="70" y2="110" stroke="var(--glass-border)" strokeWidth="0.6" />
      {/* Window light bleed */}
      <rect x="31" y="21" width="38" height="28"
        fill="var(--color-brew)" fillOpacity="0.08" />

      {/* Hanging scroll */}
      <rect x="130" y="15" width="2" height="85" fill="var(--color-green-deep)" fillOpacity="0.4" />
      <rect x="122" y="20" width="18" height="70" rx="1"
        fill="var(--color-bg-primary)" stroke="var(--glass-border)" strokeWidth="0.8" />
      {/* Ink brushstroke on scroll */}
      <path d="M128 35 Q134 50 130 65 Q127 75 131 80"
        stroke="var(--color-green-deep)" strokeWidth="1.5" strokeLinecap="round" fillOpacity="0" />

      {/* Bamboo branch */}
      <path d="M185 10 Q188 40 183 70 Q180 90 185 110"
        stroke="var(--color-green-accent)" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      <path d="M185 30 Q200 25 205 32" stroke="var(--color-green-accent)" strokeWidth="1" strokeLinecap="round" fill="none" />
      <path d="M183 55 Q170 48 168 56" stroke="var(--color-green-accent)" strokeWidth="1" strokeLinecap="round" fill="none" />
      <path d="M185 80 Q198 75 202 83" stroke="var(--color-green-accent)" strokeWidth="1" strokeLinecap="round" fill="none" />

      {/* Soft floor shadow */}
      <ellipse cx="120" cy="162" rx="80" ry="6" fill="var(--color-green-deep)" fillOpacity="0.06" />
    </svg>
  );
}

/* ─── Illustration: Hand-Thrown Stoneware ────────────────────── */
function StonewareIllustration() {
  return (
    <svg viewBox="0 0 240 180" fill="none" className="w-full h-full" aria-hidden="true">
      {/* Pottery wheel base */}
      <ellipse cx="120" cy="150" rx="60" ry="12"
        fill="var(--color-green-deep)" fillOpacity="0.1"
        stroke="var(--glass-border)" strokeWidth="1" />

      {/* Clay vessel body */}
      <path d="M85 150 Q78 110 82 70 Q90 40 120 38 Q150 40 158 70 Q162 110 155 150 Z"
        fill="var(--color-bg-secondary)"
        stroke="var(--glass-border)" strokeWidth="1" />

      {/* Glaze sheen lines */}
      <path d="M94 80 Q96 100 94 130" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M101 65 Q103 95 101 140" stroke="rgba(255,255,255,0.25)" strokeWidth="1" strokeLinecap="round" />

      {/* Glaze colour band */}
      <path d="M82 95 Q86 90 120 90 Q154 90 158 95 Q162 115 158 130 Q154 135 120 135 Q86 135 82 130 Q78 115 82 95 Z"
        fill="var(--color-green-accent)" fillOpacity="0.18" />

      {/* Vessel neck */}
      <path d="M105 38 Q108 20 120 18 Q132 20 135 38"
        fill="var(--color-bg-secondary)" stroke="var(--glass-border)" strokeWidth="1" />

      {/* Lid */}
      <ellipse cx="120" cy="18" rx="18" ry="5"
        fill="var(--color-bg-secondary)" stroke="var(--glass-border)" strokeWidth="1" />
      <ellipse cx="120" cy="14" rx="6" ry="3"
        fill="var(--color-green-deep)" fillOpacity="0.4" stroke="var(--glass-border)" strokeWidth="0.8" />

      {/* Small cup beside */}
      <path d="M165 135 L166 150 Q175 153 184 150 L185 135 Z"
        fill="var(--color-bg-primary)" stroke="var(--glass-border)" strokeWidth="0.8" />
      <ellipse cx="175" cy="135" rx="10" ry="3.5"
        fill="var(--color-bg-primary)" stroke="var(--glass-border)" strokeWidth="0.8" />
      <ellipse cx="175" cy="137" rx="8" ry="2"
        fill="var(--color-brew)" fillOpacity="0.5" />
      <path d="M185 139 Q192 139 192 145 Q192 151 185 151"
        stroke="var(--glass-border)" strokeWidth="2" strokeLinecap="round" fill="none" />

      {/* Leaf garnish */}
      <path d="M50 140 C50 140 40 120 55 110 C70 100 70 125 50 140Z"
        fill="var(--color-green-accent)" fillOpacity="0.5" />
      <path d="M50 140 C50 140 48 122 55 115"
        stroke="var(--color-green-deep)" strokeWidth="0.8" strokeLinecap="round" fill="none" />
    </svg>
  );
}

/* ─── Illustration: Morning Garden Terrace ───────────────────── */
function GardenIllustration() {
  return (
    <svg viewBox="0 0 240 180" fill="none" className="w-full h-full" aria-hidden="true">
      {/* Sky gradient block */}
      <rect x="0" y="0" width="240" height="100" fill="var(--color-brew)" fillOpacity="0.06" />

      {/* Sun */}
      <circle cx="195" cy="30" r="18" fill="var(--color-brew)" fillOpacity="0.25" />
      <circle cx="195" cy="30" r="11" fill="var(--color-brew)" fillOpacity="0.4" />
      {/* Sun rays */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => {
        const r = Math.PI * deg / 180;
        const x1 = 195 + Math.cos(r) * 15;
        const y1 = 30 + Math.sin(r) * 15;
        const x2 = 195 + Math.cos(r) * 22;
        const y2 = 30 + Math.sin(r) * 22;
        return (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
            stroke="var(--color-brew)" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
        );
      })}

      {/* Ground / terrace */}
      <rect x="0" y="130" width="240" height="50"
        fill="var(--color-green-deep)" fillOpacity="0.08" />
      <rect x="0" y="128" width="240" height="4"
        fill="var(--color-green-deep)" fillOpacity="0.15" />

      {/* Stone path */}
      {[20, 60, 100, 140, 180].map((x, i) => (
        <ellipse key={i} cx={x + 10} cy={148} rx="14" ry="6"
          fill="var(--color-green-deep)" fillOpacity="0.12"
          stroke="var(--glass-border)" strokeWidth="0.5" />
      ))}

      {/* Tea table */}
      <rect x="80" y="108" width="80" height="6" rx="2"
        fill="var(--color-green-deep)" fillOpacity="0.5" />
      <rect x="88" y="114" width="4" height="14" rx="1"
        fill="var(--color-green-deep)" fillOpacity="0.4" />
      <rect x="148" y="114" width="4" height="14" rx="1"
        fill="var(--color-green-deep)" fillOpacity="0.4" />

      {/* Teapot on table */}
      <path d="M108 100 Q104 94 108 88 Q120 83 132 88 Q136 94 132 100 Z"
        fill="var(--color-bg-primary)" stroke="var(--glass-border)" strokeWidth="0.8" />
      <circle cx="120" cy="84" r="4"
        fill="var(--color-bg-primary)" stroke="var(--glass-border)" strokeWidth="0.8" />
      <path d="M132 92 Q142 90 142 95 Q142 100 132 98"
        stroke="var(--glass-border)" strokeWidth="2" strokeLinecap="round" fill="none" />

      {/* Tea cups */}
      <ellipse cx="96" cy="109" rx="7" ry="3"
        fill="var(--color-bg-primary)" stroke="var(--glass-border)" strokeWidth="0.8" />
      <ellipse cx="144" cy="109" rx="7" ry="3"
        fill="var(--color-bg-primary)" stroke="var(--glass-border)" strokeWidth="0.8" />

      {/* Trees / shrubs left */}
      <path d="M25 128 Q25 90 35 70 Q40 55 35 40"
        stroke="var(--color-green-deep)" strokeWidth="1.5" strokeLinecap="round" fill="none" fillOpacity="0.6" />
      <circle cx="35" cy="38" r="18" fill="var(--color-green-accent)" fillOpacity="0.25" />
      <circle cx="22" cy="55" r="12" fill="var(--color-green-accent)" fillOpacity="0.2" />

      {/* Trees / shrubs right */}
      <path d="M210 128 Q210 95 205 75 Q202 60 206 45"
        stroke="var(--color-green-deep)" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <circle cx="206" cy="42" r="20" fill="var(--color-green-accent)" fillOpacity="0.2" />
      <circle cx="220" cy="58" r="12" fill="var(--color-green-accent)" fillOpacity="0.18" />

      {/* Floating motes */}
      {[
        [60, 50], [90, 35], [150, 60], [170, 42], [130, 25]
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="1.5"
          fill="var(--color-brew)" fillOpacity="0.5" />
      ))}
    </svg>
  );
}

/* ─── Card data ─────────────────────────────────────────────── */
const ATMOSPHERE_CARDS = [
  {
    id: "tatami",
    title: "The Quiet Tatami Corner",
    description:
      "Shoes off, voices low. Our tatami alcove holds two cushions, a low hinoki table, and a single hanging scroll — a space for unhurried conversation or solo contemplation.",
    illustration: <TatamiIllustration />,
    tag: "Interior",
    wide: true,
  },
  {
    id: "stoneware",
    title: "Hand-Thrown Stoneware",
    description:
      "Every cup and vessel in the room is thrown on a wheel by a ceramic artist from Yogyakarta. The stoneware absorbs and radiates heat gently, keeping your brew at temperature longer.",
    illustration: <StonewareIllustration />,
    tag: "Craft",
    wide: false,
  },
  {
    id: "garden",
    title: "Morning Garden Terrace",
    description:
      "Open Tue–Sun from 08:00, the terrace catches the first soft light. Surrounded by medicinal herbs and low tea shrubs, it is the quietest seat in the house before the day begins.",
    illustration: <GardenIllustration />,
    tag: "Outdoor",
    wide: false,
  },
] as const;

/* ─── Component ─────────────────────────────────────────────── */
import AtmosphereParallax from "./AtmosphereParallax";

export default function AtmosphereSection() {
  return (
    <section
      id="atmosphere"
      className="section-pad section-overlay-secondary"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10">

        {/* Section header */}
        <div className="max-w-xl mb-12">
          <p
            className="font-mono-spec text-xs tracking-[0.2em] uppercase mb-4"
            style={{ color: "var(--color-green-accent)" }}
          >
            Tea House Atmosphere
          </p>
          <h2
            className="text-4xl sm:text-5xl"
            style={{ fontFamily: "var(--font-fraunces)", color: "var(--color-ink)" }}
          >
            Spaces for<br />stillness.
          </h2>
        </div>

        {/* Bento grid — items-stretch per AGENTS.md guardrail */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch">

          {/* Card 1 — wide (spans 2 cols on lg) */}
          <div className="lg:col-span-2">
            <AtmosphereCard card={ATMOSPHERE_CARDS[0]} illustIdx={0} />
          </div>

          {/* Card 2 */}
          <AtmosphereCard card={ATMOSPHERE_CARDS[1]} illustIdx={1} />

          {/* Card 3 — wide (spans 2 cols on lg) but placed last */}
          <div className="lg:col-span-2">
            <AtmosphereCard card={ATMOSPHERE_CARDS[2]} illustIdx={2} />
          </div>

          {/* Accent stat card */}
          <div
            className="glass-card card-lift flex flex-col justify-between p-7 h-full"
            style={{ background: "var(--color-green-deep)" }}
          >
            <p
              className="font-mono-spec text-[10px] tracking-widest uppercase"
              style={{ color: "rgba(244,247,242,0.5)" }}
            >
              Open Since
            </p>
            <div>
              <p
                className="text-6xl font-semibold mb-2"
                style={{ fontFamily: "var(--font-fraunces)", color: "#F4F7F2" }}
              >
                2019
              </p>
              <p className="text-sm leading-relaxed" style={{ color: "rgba(244,247,242,0.65)" }}>
                Five years of slow cups and quiet mornings on Jl. Raya Kintamani.
              </p>
            </div>
            <div
              className="w-8 h-px mt-4"
              style={{ background: "var(--color-green-accent)" }}
            />
          </div>
        </div>
      </div>
      {/* Client-only: scroll-scrubbed illustration parallax */}
      <AtmosphereParallax />
    </section>
  );
}

/* ─── Reusable card ─────────────────────────────────────────── */
function AtmosphereCard({
  card,
  illustIdx,
}: {
  card: (typeof ATMOSPHERE_CARDS)[number];
  illustIdx: number;
}) {
  return (
    <div className="glass-card card-lift flex flex-col h-full overflow-hidden">
      {/* Illustration area */}
      <div
        className="relative flex items-center justify-center p-6 flex-shrink-0 overflow-hidden"
        style={{ background: "var(--color-bg-primary)", minHeight: "180px" }}
      >
        {/* data-atmo-illus is targeted by AtmosphereParallax client component */}
        <div
          className="w-full h-40"
          data-atmo-illus={illustIdx}
          style={{ willChange: "transform" }}
        >
          {card.illustration}
        </div>
        {/* Tag badge */}
        <span
          className="absolute top-4 right-4 font-mono-spec text-[10px] tracking-widest uppercase px-2.5 py-1 rounded-full"
          style={{
            background: "var(--color-bg-secondary)",
            color: "var(--color-muted)",
            border: "1px solid var(--glass-border)",
          }}
        >
          {card.tag}
        </span>
      </div>

      {/* Text body */}
      <div className="flex flex-col gap-3 p-7 flex-1">
        <h3
          className="text-xl"
          style={{ fontFamily: "var(--font-fraunces)", color: "var(--color-ink)" }}
        >
          {card.title}
        </h3>
        <p className="text-sm leading-relaxed" style={{ color: "var(--color-muted)" }}>
          {card.description}
        </p>
      </div>
    </div>
  );
}
