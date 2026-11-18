import type { Metadata, Viewport } from "next";
import { Fraunces, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

import TeaCanvasLoader from "@/components/canvas/TeaCanvasLoader";
import LenisProvider   from "@/providers/LenisProvider";

/* ─── Fonts ──────────────────────────────────────────────────── */
const fraunces = Fraunces({
  subsets:  ["latin"],
  variable: "--font-fraunces",
  display:  "swap",
  axes:     ["opsz", "SOFT", "WONK"],
});

const jakarta = Plus_Jakarta_Sans({
  subsets:  ["latin"],
  variable: "--font-jakarta",
  display:  "swap",
  weight:   ["300", "400", "500", "600", "700"],
});

const jetbrains = JetBrains_Mono({
  subsets:  ["latin"],
  variable: "--font-jetbrains",
  display:  "swap",
  weight:   ["400", "500"],
});

/* ─── Viewport (theme-color, mobile scale) ───────────────────── */
export const viewport: Viewport = {
  themeColor:    "#1E462F",
  width:         "device-width",
  initialScale:  1,
  maximumScale:  5,
};

/* ─── Page metadata ──────────────────────────────────────────── */
const BASE_URL = "https://embun-daun.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),

  title: {
    default:  "Embun & Daun — Artisanal Botanical Tea House",
    template: "%s · Embun & Daun",
  },
  description:
    "A quiet tasting room dedicated to single-origin whole-leaf teas from Indonesian highlands. Slow steeping, mindful craft.",
  keywords: [
    "tea", "artisanal", "botanical", "Indonesia",
    "single-origin", "specialty tea", "tea house", "Bali",
  ],
  authors:  [{ name: "Embun & Daun" }],
  creator:  "Embun & Daun",
  publisher:"Embun & Daun",

  /* ── Canonical ── */
  alternates: { canonical: "/" },

  /* ── Open Graph ── */
  openGraph: {
    type:        "website",
    url:         BASE_URL,
    siteName:    "Embun & Daun",
    title:       "Embun & Daun — Artisanal Botanical Tea House",
    description: "Single-origin whole-leaf teas from Indonesian highlands, brewed at precision temperature.",
    images: [
      {
        url:    "/og-image.svg",
        width:  1200,
        height: 630,
        alt:    "Embun & Daun — a steaming glass teacup surrounded by floating tea leaves",
      },
    ],
    locale: "en_US",
  },

  /* ── Twitter / X card ── */
  twitter: {
    card:        "summary_large_image",
    title:       "Embun & Daun — Artisanal Botanical Tea House",
    description: "Single-origin whole-leaf teas from Indonesian highlands.",
    images:      ["/og-image.svg"],
  },

  /* ── Robots ── */
  robots: {
    index:               true,
    follow:              true,
    googleBot: {
      index:              true,
      follow:             true,
      "max-image-preview": "large",
    },
  },

  /* ── Icons ── */
  icons: {
    icon:        [{ url: "/favicon.svg", type: "image/svg+xml" }],
    shortcut:    "/favicon.svg",
    apple:       "/favicon.svg",
  },
};

/* ─── Root layout ────────────────────────────────────────────── */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${jakarta.variable} ${jetbrains.variable}`}
    >
      {/*
        suppressHydrationWarning: browser extensions (Grammarly, MetaMask)
        inject data-* attributes onto <body> before React hydrates —
        the mismatch is harmless but noisy in dev.
      */}
      <body suppressHydrationWarning>
        <TeaCanvasLoader />
        <div style={{ position: "relative", zIndex: 1 }}>
          <LenisProvider>
            {children}
          </LenisProvider>
        </div>
      </body>
    </html>
  );
}
