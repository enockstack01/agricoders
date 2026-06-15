import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  serverExternalPackages: ["mongoose"],
  experimental: {},
  async headers() {
    return [
      // Public apps discovery endpoint — any origin can call this
      {
        source: "/api/apps",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET, OPTIONS" },
          { key: "Access-Control-Allow-Headers", value: "Content-Type" },
          { key: "Cache-Control", value: "public, max-age=3600, stale-while-revalidate=86400" },
        ],
      },
      // Allow the app to be embedded in iframes from any origin.
      // Clerk auth still works because it uses cookies from this domain's session.
      // Remove X-Frame-Options so browsers honour Content-Security-Policy frame-ancestors instead.
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: "frame-ancestors *" },
        ],
      },
    ];
  },
};

export default nextConfig;
