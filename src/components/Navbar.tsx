"use client";

import { useState, useEffect, useCallback } from "react";
import { useTeaStore } from "@/store/useTeaStore";

/* ─── Leaf-mark SVG ──────────────────────────────────────────── */
function LeafMark() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <path
        d="M14 2C14 2 4 8 4 16a10 10 0 0018 0C22 8 14 2 14 2Z"
        fill="var(--color-green-accent)"
        opacity="0.85"
      />
      <path
        d="M14 2C14 2 10 10 10 16"
        stroke="var(--color-green-deep)"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <circle cx="14" cy="24" r="1.5" fill="var(--color-green-deep)" />
    </svg>
  );
}

const NAV_LINKS = [
  { label: "Craft",      href: "#craft"      },
  { label: "Menu",       href: "#menu"       },
  { label: "Atmosphere", href: "#atmosphere" },
  { label: "Visit",      href: "#visit"      },
] as const;

export default function Navbar() {
  const [scrolled,  setScrolled]  = useState(false);
  const [isDusk,    setIsDusk]    = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);

  const setLighting = useTeaStore((s) => s.setLighting);

  /* Glass-on-scroll */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Toggle CSS tokens on <html> AND notify Zustand */
  const toggleLighting = useCallback(() => {
    setIsDusk((prev) => {
      const next = !prev;
      document.documentElement.classList.toggle("dusk", next);
      setLighting(next ? "dusk" : "morning");
      return next;
    });
  }, [setLighting]);

  return (
    <header
      className={[
        "fixed top-0 inset-x-0 z-50 transition-all duration-300",
        scrolled
          ? "glass-card rounded-none border-t-0 border-x-0 shadow-sm"
          : "bg-transparent",
      ].join(" ")}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10 h-16 flex items-center justify-between gap-6">

        {/* Logo */}
        <a href="#" className="flex items-center gap-2.5 shrink-0" aria-label="Embun & Daun home">
          <LeafMark />
          <span
            className="text-sm font-semibold tracking-[0.18em] uppercase"
            style={{ fontFamily: "var(--font-jakarta)", color: "var(--color-green-deep)" }}
          >
            Embun &amp; Daun
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8" aria-label="Site sections">
          {NAV_LINKS.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className="text-sm font-medium transition-opacity duration-200 hover:opacity-60"
              style={{ color: "var(--color-muted)" }}
            >
              {label}
            </a>
          ))}
        </nav>

        {/* Controls */}
        <div className="flex items-center gap-4">
          <LightingPill isDusk={isDusk} onToggle={toggleLighting} className="hidden sm:flex" />

          <button
            className="md:hidden flex flex-col gap-1.5 p-1"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle mobile menu"
            aria-expanded={menuOpen}
          >
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="block w-5 h-0.5 rounded-full"
                style={{ background: "var(--color-green-deep)" }}
              />
            ))}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden glass-card rounded-none border-t border-x-0 border-b-0 px-6 py-4 flex flex-col gap-4">
          {NAV_LINKS.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              onClick={() => setMenuOpen(false)}
              className="text-sm font-medium py-1"
              style={{ color: "var(--color-muted)" }}
            >
              {label}
            </a>
          ))}
          <LightingPill isDusk={isDusk} onToggle={toggleLighting} className="self-start mt-1" />
        </div>
      )}
    </header>
  );
}

/* Reusable toggle pill ─────────────────────────────────────── */
function LightingPill({
  isDusk,
  onToggle,
  className = "",
}: {
  isDusk: boolean;
  onToggle: () => void;
  className?: string;
}) {
  return (
    <button
      onClick={onToggle}
      aria-pressed={isDusk}
      aria-label={isDusk ? "Switch to Morning Mist" : "Switch to Dusk Pavilion"}
      className={`flex items-center rounded-full border text-xs font-mono-spec font-medium overflow-hidden transition-all duration-300 ${className}`}
      style={{ borderColor: "var(--glass-border)", background: "var(--glass-bg)", backdropFilter: "blur(8px)" }}
    >
      {(["Morning", "Dusk"] as const).map((label) => {
        const active = label === "Morning" ? !isDusk : isDusk;
        return (
          <span
            key={label}
            className="px-3.5 py-1.5 transition-all duration-300"
            style={{
              background: active ? "var(--color-green-deep)" : "transparent",
              color:      active ? "#F4F7F2" : "var(--color-muted)",
            }}
          >
            {label}
          </span>
        );
      })}
    </button>
  );
}
