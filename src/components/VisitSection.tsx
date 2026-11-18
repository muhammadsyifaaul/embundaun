/* Visit & Hours — Static Closing Section */

const HOURS = [
  { days: "Tuesday – Friday", time: "09:00 – 21:00" },
  { days: "Saturday – Sunday", time: "08:00 – 21:00" },
  { days: "Monday",            time: "Closed" },
] as const;

/* ─── Map pin SVG ───────────────────────────────────────────── */
function PinIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M10 1.5C7.1 1.5 4.75 3.85 4.75 6.75c0 4.19 5.25 11.75 5.25 11.75s5.25-7.56 5.25-11.75C15.25 3.85 12.9 1.5 10 1.5Z"
        stroke="var(--color-green-accent)"
        strokeWidth="1.4"
        fill="var(--color-green-accent)"
        fillOpacity="0.15"
      />
      <circle cx="10" cy="6.75" r="1.75" fill="var(--color-green-accent)" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="7.5" stroke="var(--color-green-accent)" strokeWidth="1.4" />
      <path d="M10 6.5v3.75l2.5 1.5" stroke="var(--color-green-accent)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LeafIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M10 2C10 2 3 7 3 12.5a7 7 0 0014 0C17 7 10 2 10 2Z"
        stroke="var(--color-green-accent)"
        strokeWidth="1.4"
        fill="var(--color-green-accent)"
        fillOpacity="0.15"
      />
      <path d="M10 2C10 2 8 8 8 12.5" stroke="var(--color-green-deep)" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

export default function VisitSection() {
  return (
    <section
      id="visit"
      className="section-pad section-overlay"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10">

        {/* Section header */}
        <div className="max-w-xl mb-14">
          <p
            className="font-mono-spec text-xs tracking-[0.2em] uppercase mb-4"
            style={{ color: "var(--color-green-accent)" }}
          >
            Visit &amp; Hours
          </p>
          <h2
            className="text-4xl sm:text-5xl"
            style={{ fontFamily: "var(--font-fraunces)", color: "var(--color-ink)" }}
          >
            Find us in the<br />morning fog.
          </h2>
        </div>

        {/* 2-column info grid — items-stretch per AGENTS.md */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch mb-16">

          {/* ── Address card ── */}
          <div className="glass-card flex flex-col gap-6 p-8">
            <div className="flex items-center gap-3">
              <span
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: "var(--color-bg-secondary)" }}
              >
                <PinIcon />
              </span>
              <h3
                className="text-lg"
                style={{ fontFamily: "var(--font-fraunces)", color: "var(--color-ink)" }}
              >
                Location
              </h3>
            </div>

            <div className="flex flex-col gap-1">
              <p className="text-base font-semibold" style={{ color: "var(--color-ink)" }}>
                Embun &amp; Daun Tea House
              </p>
              <p style={{ color: "var(--color-muted)" }}>Jl. Raya Kintamani No. 14</p>
              <p style={{ color: "var(--color-muted)" }}>Kintamani, Bangli Regency</p>
              <p style={{ color: "var(--color-muted)" }}>Bali 80652 · Indonesia</p>
            </div>

            {/* Map placeholder */}
            <div
              className="relative rounded-xl overflow-hidden flex items-center justify-center"
              style={{
                background: "var(--color-bg-secondary)",
                height: "160px",
                border: "1px solid var(--glass-border)",
              }}
            >
              <MapPlaceholder />
            </div>

            <a
              href="https://maps.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium transition-opacity hover:opacity-70"
              style={{ color: "var(--color-green-accent)" }}
            >
              Open in Maps
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>

          {/* ── Hours card ── */}
          <div className="flex flex-col gap-5">
            <div className="glass-card flex flex-col gap-5 p-8">
              <div className="flex items-center gap-3">
                <span
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: "var(--color-bg-secondary)" }}
                >
                  <ClockIcon />
                </span>
                <h3
                  className="text-lg"
                  style={{ fontFamily: "var(--font-fraunces)", color: "var(--color-ink)" }}
                >
                  Opening Hours
                </h3>
              </div>

              <ul className="flex flex-col gap-3">
                {HOURS.map(({ days, time }) => (
                  <li
                    key={days}
                    className="flex items-center justify-between py-3 border-b last:border-b-0"
                    style={{ borderColor: "var(--glass-border)" }}
                  >
                    <span className="text-sm" style={{ color: "var(--color-muted)" }}>
                      {days}
                    </span>
                    <span
                      className="font-mono-spec text-sm font-medium"
                      style={{
                        color:
                          time === "Closed"
                            ? "var(--color-muted)"
                            : "var(--color-green-deep)",
                        opacity: time === "Closed" ? 0.5 : 1,
                      }}
                    >
                      {time}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quiet-space etiquette note */}
            <div
              className="glass-card flex gap-4 p-6"
              style={{ border: "1px solid var(--glass-border)" }}
            >
              <span
                className="mt-0.5 w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: "var(--color-bg-secondary)" }}
              >
                <LeafIcon />
              </span>
              <div>
                <p
                  className="text-sm font-semibold mb-1"
                  style={{ color: "var(--color-ink)" }}
                >
                  Quiet-Space Etiquette
                </p>
                <p className="text-sm leading-relaxed" style={{ color: "var(--color-muted)" }}>
                  We ask guests to keep voices soft and devices face-down. The
                  space is designed for slowness — please allow at least 45 minutes
                  to let the first steep settle before you rush anywhere.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Footer ── */}
      <footer
        className="border-t"
        style={{ borderColor: "var(--glass-border)" }}
      >
        <div className="max-w-6xl mx-auto px-6 sm:px-10 py-8 flex flex-col sm:flex-row items-center justify-between gap-5">
          {/* Logo mark */}
          <div className="flex items-center gap-2.5">
            <svg width="22" height="22" viewBox="0 0 28 28" fill="none" aria-hidden="true">
              <path d="M14 2C14 2 4 8 4 16a10 10 0 0018 0C22 8 14 2 14 2Z"
                fill="var(--color-green-accent)" opacity="0.85" />
              <path d="M14 2C14 2 10 10 10 16"
                stroke="var(--color-green-deep)" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
            <span
              className="text-xs font-semibold tracking-[0.18em] uppercase"
              style={{ fontFamily: "var(--font-jakarta)", color: "var(--color-green-deep)" }}
            >
              Embun &amp; Daun
            </span>
          </div>

          <p
            className="font-mono-spec text-xs text-center"
            style={{ color: "var(--color-muted)" }}
          >
            © 2026 Embun &amp; Daun · Kintamani, Bali
          </p>

          <p
            className="font-mono-spec text-xs"
            style={{ color: "var(--color-muted)", opacity: 0.6 }}
          >
            Brewed with intention.
          </p>
        </div>
      </footer>
    </section>
  );
}

/* Schematic map placeholder */
function MapPlaceholder() {
  return (
    <svg viewBox="0 0 320 160" fill="none" className="w-full h-full" aria-hidden="true">
      {/* Road grid */}
      <line x1="0" y1="80" x2="320" y2="80" stroke="var(--glass-border)" strokeWidth="6" />
      <line x1="160" y1="0" x2="160" y2="160" stroke="var(--glass-border)" strokeWidth="6" />
      <line x1="0" y1="40" x2="320" y2="40" stroke="var(--glass-border)" strokeWidth="2" />
      <line x1="0" y1="120" x2="320" y2="120" stroke="var(--glass-border)" strokeWidth="2" />
      <line x1="80" y1="0" x2="80" y2="160" stroke="var(--glass-border)" strokeWidth="2" />
      <line x1="240" y1="0" x2="240" y2="160" stroke="var(--glass-border)" strokeWidth="2" />

      {/* Terrain blocks */}
      <rect x="10" y="10" width="60" height="25" rx="4"
        fill="var(--color-green-accent)" fillOpacity="0.1" />
      <rect x="90" y="50" width="60" height="20" rx="4"
        fill="var(--color-green-accent)" fillOpacity="0.08" />
      <rect x="170" y="90" width="60" height="20" rx="4"
        fill="var(--color-green-accent)" fillOpacity="0.1" />
      <rect x="250" y="10" width="55" height="25" rx="4"
        fill="var(--color-green-accent)" fillOpacity="0.08" />

      {/* Location pin */}
      <circle cx="160" cy="80" r="10" fill="var(--color-green-deep)" fillOpacity="0.15" />
      <circle cx="160" cy="80" r="5" fill="var(--color-green-deep)" />
      <circle cx="160" cy="80" r="2.5" fill="#F4F7F2" />

      {/* Label */}
      <rect x="110" y="50" width="100" height="22" rx="4"
        fill="var(--glass-bg)" />
      <text x="160" y="65"
        textAnchor="middle"
        fontSize="9"
        fontFamily="var(--font-jetbrains)"
        fill="var(--color-green-deep)"
      >
        Embun &amp; Daun
      </text>
    </svg>
  );
}
