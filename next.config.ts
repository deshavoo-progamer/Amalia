import type { NextConfig } from "next";

// Public assets keep stable names (re-imported from Salla), so cache for a month
// and revalidate in the background rather than marking them immutable.
const assetCache = "public, max-age=2592000, stale-while-revalidate=86400";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    // Trimmed from the defaults (up to 3840px): the largest photo here is 1600px,
    // and shorter srcsets keep the 97-card shop HTML lean.
    deviceSizes: [640, 828, 1080, 1440, 1920],
    imageSizes: [128, 256, 384],
    // Product photos uploaded from /admin are stored on Vercel Blob.
    remotePatterns: [{ protocol: "https", hostname: "*.public.blob.vercel-storage.com" }],
  },
  experimental: {
    // Admin product photos are posted through server actions.
    serverActions: { bodySizeLimit: "10mb" },
  },
  async headers() {
    return ["/brand/:path*", "/images/:path*", "/products/:path*"].map((source) => ({
      source,
      headers: [{ key: "Cache-Control", value: assetCache }],
    }));
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
