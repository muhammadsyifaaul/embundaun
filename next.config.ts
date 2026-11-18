import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * Embun & Daun — Next.js config
   *
   * Deployment target: Vercel (or any Node.js server via `next start`).
   * The app is fully static — no API routes, no SSR data fetching —
   * so it also supports `output: "export"` for plain CDN hosting.
   * To enable static export, change the output line below.
   */

  // output: "export",    // uncomment for static CDN / GitHub Pages deploy

  // Compress responses (gzip/brotli) — Vercel does this automatically,
  // but it's cheap insurance for self-hosted Node deploys.
  compress: true,

  images: {
    remotePatterns: [],
    formats: ["image/avif", "image/webp"],
  },

  // Next.js 16 uses Turbopack by default.
  // An empty turbopack config confirms the intent and silences the
  // "webpack config present but no turbopack config" build error.
  turbopack: {},
};

export default nextConfig;
