import type { NextConfig } from "next";

const supabaseHost = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : null;

const WEEK = 60 * 60 * 24 * 7;

const nextConfig: NextConfig = {
  output: "standalone",
  compress: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [390, 640, 828, 1080, 1280, 1600],
    imageSizes: [96, 160, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    // בתצוגה המקדימה על Cloudflare Workers אין שירות אופטימיזציה — התמונות כבר WebP בגודל מתאים
    unoptimized: process.env.NEXT_IMAGE_UNOPTIMIZED === "1",
    remotePatterns: supabaseHost
      ? [
          {
            protocol: "https",
            hostname: supabaseHost,
            pathname: "/storage/v1/object/public/**",
          },
        ]
      : [],
  },
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  async headers() {
    return [
      {
        // תמונות מותג ומנות: שבוע במטמון + רענון ברקע
        source: "/:dir(brand|menu)/:file*",
        headers: [
          {
            key: "Cache-Control",
            value: `public, max-age=${WEEK}, stale-while-revalidate=${WEEK * 4}`,
          },
        ],
      },
      {
        source: "/admin/:path*",
        headers: [
          { key: "Cache-Control", value: "private, no-store" },
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
        ],
      },
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
        ],
      },
    ];
  },
};

export default nextConfig;
