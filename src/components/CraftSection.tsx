/* The Craft & Harvest Origins
   3-column botanical metrics + editorial story */

const METRICS = [
  {
    value: "1,450",
    unit: "m",
    label: "Highland Altitude",
    sub: "Ciwidey & Wonosobo terroir",
    icon: (
      <svg viewBox="0 0 36 36" fill="none" className="w-8 h-8" aria-hidden="true">
        <path
          d="M18 4 L6 28 h24 Z"
          stroke="var(--color-green-accent)"
          strokeWidth="1.5"
          strokeLinejoin="round"
          fill="var(--color-green-accent)"
          fillOpacity="0.12"
        />
        <path
          d="M18 4 L18 28"
          stroke="var(--color-green-deep)"
          strokeWidth="1"
          strokeDasharray="2 2"
        />
      </svg>
    ),
  },
  {
    value: "78",
    unit: "°C",
    label: "Ideal Extraction",
    sub: "Temperature-controlled steeping",
    icon: (
      <svg viewBox="0 0 36 36" fill="none" className="w-8 h-8" aria-hidden="true">
        <circle
          cx="18"
          cy="18"
          r="10"
          stroke="var(--color-green-accent)"
          strokeWidth="1.5"
          fill="var(--color-brew)"
          fillOpacity="0.15"
        />
        <path
          d="M18 10 v8 l5 3"
          stroke="var(--color-green-deep)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    value: "100",
    unit: "%",
    label: "Whole-Leaf Harvest",
    sub: "No fragments, no dust",
    icon: (
      <svg viewBox="0 0 36 36" fill="none" className="w-8 h-8" aria-hidden="true">
        <path
          d="M18 4 C18 4 8 12 8 20 a10 10 0 0020 0 C28 12 18 4 18 4Z"
          stroke="var(--color-green-accent)"
          strokeWidth="1.5"
          fill="var(--color-green-accent)"
          fillOpacity="0.12"
        />
        <path
          d="M18 4 C18 4 14 14 14 20"
          stroke="var(--color-green-deep)"
          strokeWidth="1"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
] as const;

export default function CraftSection() {
  return (
    <section
      id="craft"
      className="section-pad section-overlay"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10">

        {/* Section header */}
        <div className="max-w-2xl mb-14">
          <p
            className="font-mono-spec text-xs tracking-[0.2em] uppercase mb-4"
            style={{ color: "var(--color-green-accent)" }}
          >
            The Craft &amp; Origins
          </p>
          <h2
            className="text-4xl sm:text-5xl mb-6"
            style={{ fontFamily: "var(--font-fraunces)", color: "var(--color-ink)" }}
          >
            Grown slowly.<br />
            Steeped with patience.
          </h2>
          <p className="text-base leading-relaxed" style={{ color: "var(--color-muted)" }}>
            Our teas travel from mist-covered Indonesian highland gardens to your
            cup without detour. Every lot is tasted, graded by hand, and paired
            with a steeping temperature calibrated to its specific cultivar.
          </p>
        </div>

        {/* 3-column metrics — items-stretch per AGENTS.md guardrail */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 items-stretch mb-16">
          {METRICS.map(({ value, unit, label, sub, icon }) => (
            <div
              key={label}
              className="glass-card card-lift flex flex-col gap-4 p-7"
            >
              {/* Icon */}
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ background: "var(--color-bg-primary)" }}
              >
                {icon}
              </div>

              {/* Metric value */}
              <p
                className="font-mono-spec text-4xl font-medium leading-none"
                style={{ color: "var(--color-green-deep)" }}
              >
                {value}
                <span
                  className="text-2xl ml-0.5"
                  style={{ color: "var(--color-green-accent)" }}
                >
                  {unit}
                </span>
              </p>

              {/* Labels */}
              <div>
                <p
                  className="text-base font-semibold mb-1"
                  style={{ color: "var(--color-ink)" }}
                >
                  {label}
                </p>
                <p className="text-sm" style={{ color: "var(--color-muted)" }}>
                  {sub}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Two-column editorial story */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch">
          <div className="flex flex-col gap-5">
            <h3
              className="text-2xl"
              style={{ fontFamily: "var(--font-fraunces)", color: "var(--color-ink)" }}
            >
              The discipline of the first flush
            </h3>
            <p className="text-base leading-relaxed" style={{ color: "var(--color-muted)" }}>
              The first flush — the initial spring harvest after winter dormancy — yields
              leaves with the highest concentration of amino acids and the most delicate
              aromatic compounds. Harvested by hand in the early morning fog of Ciwidey,
              these leaves are withered, rolled, and dried within hours of picking to
              lock in their ephemeral character.
            </p>
            <p className="text-base leading-relaxed" style={{ color: "var(--color-muted)" }}>
              We brew each variety at a specific temperature window — sencha at 75°C,
              white peony at 80°C, roasted hojicha at 90°C — because even a 5°C
              variance can tip a silky umami cup toward bitter astringency.
            </p>
          </div>

          <div
            className="glass-card flex flex-col justify-between gap-6 p-7"
          >
            <p
              className="text-xl italic leading-snug"
              style={{ fontFamily: "var(--font-fraunces)", color: "var(--color-ink)" }}
            >
              "A good cup of tea is not brewed — it is coaxed. The water
              speaks to the leaf, and the leaf answers in its own time."
            </p>
            <div className="flex flex-col gap-1">
              <p
                className="font-mono-spec text-xs tracking-widest uppercase"
                style={{ color: "var(--color-green-accent)" }}
              >
                Steeping Guidelines
              </p>
              {[
                ["Sencha",       "75°C", "02:00 min"],
                ["Jasmine Pearl","80°C", "02:30 min"],
                ["White Peony",  "80°C", "03:00 min"],
                ["Hojicha",      "90°C", "01:30 min"],
              ].map(([tea, temp, time]) => (
                <div
                  key={tea}
                  className="flex items-center justify-between py-2 border-b last:border-b-0"
                  style={{ borderColor: "var(--glass-border)" }}
                >
                  <span className="text-sm" style={{ color: "var(--color-ink)" }}>
                    {tea}
                  </span>
                  <div className="flex gap-4">
                    <span
                      className="font-mono-spec text-xs"
                      style={{ color: "var(--color-green-accent)" }}
                    >
                      {temp}
                    </span>
                    <span
                      className="font-mono-spec text-xs"
                      style={{ color: "var(--color-muted)" }}
                    >
                      {time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
