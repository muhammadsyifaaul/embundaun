"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useTeaStore } from "@/store/useTeaStore";

/* ─── Tea data ──────────────────────────────────────────────── */
interface Tea {
  id: string;
  name: string;
  origin: string;
  style: string;
  temp: string;
  steep: string;        // "MM:SS min" format
  steepSeconds: number; // numeric for the progress bar animation
  notes: string[];
  pairing: string;
  description: string;
  color: string;        // accent hex (UI only — 3D colour lives in useTeaStore)
}

const TEAS: Tea[] = [
  {
    id: "sencha",
    name: "Ciwidey First-Flush Sencha",
    origin: "Ciwidey, West Java — 1,450 m",
    style: "Green",
    temp: "75°C",
    steep: "02:00 min",
    steepSeconds: 120,
    notes: ["Fresh cut grass", "Umami", "Sweet melon finish"],
    pairing: "Light rice crackers · young coconut",
    description:
      "Harvested on the first morning of the spring flush from Ciwidey's misty upper terraces. Needle-rolled and pan-dried within hours of picking, it brews into a vivid jade liquor with a silky, vegetal sweetness.",
    color: "#4C7A24",
  },
  {
    id: "jasmine",
    name: "Wonosobo Jasmine Pearl",
    origin: "Wonosobo, Central Java — 1,200 m",
    style: "Green / Scented",
    temp: "80°C",
    steep: "02:30 min",
    steepSeconds: 150,
    notes: ["Night-blooming jasmine", "Honey dew", "Lingering floral"],
    pairing: "Light cheesecake · pandan mochi",
    description:
      "Hand-rolled pearls of green tea scented overnight with fresh jasmine blossoms harvested at dusk. Each pearl unfurls in the cup releasing three successive waves of floral aroma.",
    color: "#7C9A23",
  },
  {
    id: "peony",
    name: "Jatiluwih White Peony",
    origin: "Jatiluwih, Bali — 850 m",
    style: "White",
    temp: "80°C",
    steep: "03:00 min",
    steepSeconds: 180,
    notes: ["Ripe white peach", "Hay", "Mild mineral sweetness"],
    pairing: "Fresh lychee · mild white cheese",
    description:
      "Minimally processed buds and two young leaves, sun-withered on bamboo mats above Jatiluwih's terraced rice fields. The liquor is pale gold — delicate, almost transparent — with a soft lingering sweetness.",
    color: "#B8862D",
  },
  {
    id: "hojicha",
    name: "Kintamani Roasted Hojicha",
    origin: "Kintamani, Bali — 1,100 m",
    style: "Roasted Green",
    temp: "90°C",
    steep: "01:30 min",
    steepSeconds: 90,
    notes: ["Toasted caramel", "Cedar wood", "Warm cocoa undertone"],
    pairing: "Dark chocolate · roasted banana cake",
    description:
      "Late-season stems and leaves slow-roasted over volcanic charcoal in a traditional clay pot. The roasting strips away caffeine and bitterness, leaving a warming amber cup with the gentle toasted character of an open hearth.",
    color: "#6E3210",
  },
];

/* ─── Animated steeping progress bar ────────────────────────── */
function SteepingBar({ tea, isNew }: { tea: Tea; isNew: boolean }) {
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);
  const DURATION = 1800; // 1.8 s animation across the full bar

  useEffect(() => {
    if (!isNew) { setProgress(1); return; }
    setProgress(0);
    startRef.current = null;

    const animate = (now: number) => {
      if (!startRef.current) startRef.current = now;
      const p = Math.min((now - startRef.current) / DURATION, 1);
      // Ease out — fast start, smooth finish
      setProgress(1 - Math.pow(1 - p, 3));
      if (p < 1) rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [tea.id, isNew]);

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <span
          className="font-mono-spec text-[10px] tracking-widest uppercase"
          style={{ color: "var(--color-muted)" }}
        >
          Steep Progress
        </span>
        <span
          className="font-mono-spec text-[10px]"
          style={{ color: tea.color }}
        >
          {tea.steep}
        </span>
      </div>
      <div
        className="relative h-1.5 rounded-full overflow-hidden"
        style={{ background: `${tea.color}20` }}
        role="progressbar"
        aria-valuenow={Math.round(progress * 100)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{
            width:      `${progress * 100}%`,
            background: `linear-gradient(90deg, ${tea.color}88, ${tea.color})`,
            transition: isNew ? "none" : undefined,
            boxShadow:  `0 0 8px ${tea.color}60`,
          }}
        />
      </div>
    </div>
  );
}

/* ─── Tea row with spring hover + colour ripple wave ────────── */
function TeaRow({
  tea,
  isActive,
  onSelect,
}: {
  tea: Tea;
  isActive: boolean;
  onSelect: (id: string) => void;
}) {
  const [hovered,    setHovered]    = useState(false);
  const [rippling,   setRippling]   = useState(false);
  const rippleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleClick = useCallback(() => {
    if (!isActive) {
      setRippling(true);
      if (rippleTimer.current) clearTimeout(rippleTimer.current);
      rippleTimer.current = setTimeout(() => setRippling(false), 650);
    }
    onSelect(tea.id);
  }, [isActive, onSelect, tea.id]);

  useEffect(() => () => {
    if (rippleTimer.current) clearTimeout(rippleTimer.current);
  }, []);

  return (
    <li>
      <button
        onClick={handleClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        aria-pressed={isActive}
        className="relative w-full text-left rounded-2xl px-6 py-5 overflow-hidden"
        style={{
          background:  isActive ? "var(--color-green-deep)" : "var(--glass-bg)",
          border:      `1px solid ${isActive ? "transparent" : "var(--glass-border)"}`,
          boxShadow:   isActive ? "0 4px 20px rgba(30,70,47,0.22)" : "none",
          /* Spring-like scale: tiny overshoot feel via cubic-bezier */
          transform:   hovered && !isActive ? "scale(1.018) translateY(-1px)" : "scale(1) translateY(0)",
          transition:  "transform 0.28s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.28s ease, background 0.25s ease",
          display:     "flex",
          alignItems:  "center",
          justifyContent: "space-between",
          gap:         "1rem",
        }}
      >
        {/* Colour-wave ripple — expands from swatch corner on click */}
        {rippling && (
          <span
            aria-hidden="true"
            style={{
              position:        "absolute",
              right:           "1.5rem",
              top:             "50%",
              width:           "10px",
              height:          "10px",
              borderRadius:    "50%",
              background:      `${tea.color}55`,
              transform:       "translate(50%, -50%) scale(0)",
              animation:       "brew-wave 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards",
              pointerEvents:   "none",
            }}
          />
        )}

        <div className="flex flex-col gap-1 min-w-0">
          <span
            className="text-base font-semibold truncate"
            style={{ color: isActive ? "#F4F7F2" : "var(--color-ink)" }}
          >
            {tea.name}
          </span>
          <span
            className="font-mono-spec text-xs"
            style={{ color: isActive ? "rgba(244,247,242,0.65)" : "var(--color-muted)" }}
          >
            {tea.origin}
          </span>
        </div>

        {/* Swatch with spring scale */}
        <span
          aria-hidden="true"
          style={{
            flexShrink:  0,
            width:       "1.5rem",
            height:      "1.5rem",
            borderRadius:"50%",
            background:  tea.color,
            border:      `2px solid ${isActive ? "rgba(244,247,242,0.4)" : "var(--glass-border)"}`,
            transform:   hovered ? "scale(1.22)" : "scale(1)",
            transition:  "transform 0.28s cubic-bezier(0.34, 1.56, 0.64, 1)",
            /* Accent ring on hover */
            boxShadow:   hovered ? `0 0 0 3px ${tea.color}44` : "none",
          }}
        />
      </button>
    </li>
  );
}

/* ─── Component ─────────────────────────────────────────────── */
export default function MenuSection() {
  const [activeId, setActiveId] = useState<string>(TEAS[0].id);
  const [isNewSelection, setIsNewSelection] = useState(false);
  const active = TEAS.find((t) => t.id === activeId) ?? TEAS[0];
  const setActiveTea = useTeaStore((s) => s.setActiveTea);

  function handleSelect(id: string) {
    if (id === activeId) return;
    setIsNewSelection(true);
    setActiveId(id);
    setActiveTea(id);
    // Reset the "new selection" flag after the bar animation completes
    setTimeout(() => setIsNewSelection(false), 2200);
  }

  return (
    <section id="menu" className="section-pad section-overlay">
      <div className="max-w-7xl mx-auto px-6 md:px-10">

        {/* Section header */}
        <div className="max-w-xl mb-12">
          <p
            className="font-mono-spec text-xs tracking-[0.2em] uppercase mb-4"
            style={{ color: "var(--color-green-accent)" }}
          >
            House Menu
          </p>
          <h2
            className="text-4xl sm:text-5xl"
            style={{ fontFamily: "var(--font-fraunces)", color: "var(--color-ink)" }}
          >
            Four signature<br />brews.
          </h2>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-6 items-stretch">

          {/* Left: tea list */}
          <ul className="flex flex-col gap-2" role="list" aria-label="Tea list">
            {TEAS.map((tea) => (
              <TeaRow
                key={tea.id}
                tea={tea}
                isActive={tea.id === activeId}
                onSelect={handleSelect}
              />
            ))}
          </ul>

          {/* Right: detail panel */}
          <div
            className="glass-card flex flex-col gap-5 p-8"
            key={active.id}
            style={{ borderTop: `4px solid ${active.color}` }}
          >
            {/* Name + style badge */}
            <div className="flex items-start justify-between gap-4">
              <h3
                className="text-2xl sm:text-3xl leading-tight"
                style={{ fontFamily: "var(--font-fraunces)", color: "var(--color-ink)" }}
              >
                {active.name}
              </h3>
              <span
                className="shrink-0 font-mono-spec text-xs px-3 py-1.5 rounded-full border mt-1"
                style={{
                  borderColor: active.color,
                  color:       active.color,
                  background:  `${active.color}18`,
                }}
              >
                {active.style}
              </span>
            </div>

            {/* Animated steeping progress bar */}
            <SteepingBar tea={active} isNew={isNewSelection} />

            {/* Brewing specs */}
            <div
              className="flex flex-wrap gap-6 py-4 border-y"
              style={{ borderColor: "var(--glass-border)" }}
            >
              {[
                { label: "Temperature", value: active.temp  },
                { label: "Steep Time",  value: active.steep },
                { label: "Origin",      value: active.origin.split("—")[1]?.trim() ?? "" },
              ].map(({ label, value }) => (
                <div key={label} className="flex flex-col gap-0.5">
                  <span
                    className="font-mono-spec text-[10px] tracking-widest uppercase"
                    style={{ color: "var(--color-muted)" }}
                  >
                    {label}
                  </span>
                  <span
                    className="font-mono-spec text-sm font-medium"
                    style={{ color: "var(--color-green-deep)" }}
                  >
                    {value}
                  </span>
                </div>
              ))}
            </div>

            {/* Description */}
            <p className="text-base leading-relaxed" style={{ color: "var(--color-muted)" }}>
              {active.description}
            </p>

            {/* Tasting notes */}
            <div>
              <p
                className="font-mono-spec text-[10px] tracking-widest uppercase mb-3"
                style={{ color: "var(--color-muted)" }}
              >
                Tasting Notes
              </p>
              <div className="flex flex-wrap gap-2">
                {active.notes.map((note) => (
                  <span
                    key={note}
                    className="px-3 py-1 rounded-full text-xs font-medium border"
                    style={{
                      borderColor: "var(--glass-border)",
                      color:       "var(--color-ink)",
                      background:  "var(--color-bg-secondary)",
                    }}
                  >
                    {note}
                  </span>
                ))}
              </div>
            </div>

            {/* Pairing */}
            <div
              className="flex items-center gap-3 rounded-xl px-4 py-3"
              style={{ background: `${active.color}14`, border: `1px solid ${active.color}30` }}
            >
              <span style={{ color: active.color }} aria-hidden="true">✦</span>
              <div>
                <span
                  className="font-mono-spec text-[10px] tracking-widest uppercase block mb-0.5"
                  style={{ color: "var(--color-muted)" }}
                >
                  Pairs well with
                </span>
                <span className="text-sm" style={{ color: "var(--color-ink)" }}>
                  {active.pairing}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
