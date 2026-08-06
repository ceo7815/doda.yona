import type { NextConfig } from "next";

/**
 * לאחר יצירת פרויקט Supabase, הוסיפו את hostname המדויק
 * (למשל xyzcompany.supabase.co) לרשימת remotePatterns.
 */
const supabaseHost = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : null;

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
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
};

export default nextConfig;
