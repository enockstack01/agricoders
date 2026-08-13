import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  serverExternalPackages: ["mongoose"],
  experimental: {},
  async redirects() {
    return [
      { source: "/app", destination: "/plan", permanent: false },
      { source: "/dashboard", destination: "/plan/dashboard", permanent: false },
      { source: "/dashboard/:path*", destination: "/plan/dashboard/:path*", permanent: false },
      { source: "/form", destination: "/plan/form", permanent: false },
      { source: "/form/:path*", destination: "/plan/form/:path*", permanent: false },
      { source: "/admin", destination: "/plan/admin", permanent: false },
      { source: "/admin/:path*", destination: "/plan/admin/:path*", permanent: false },
      { source: "/super-admin", destination: "/plan/super-admin", permanent: false },
      { source: "/super-admin/:path*", destination: "/plan/super-admin/:path*", permanent: false },
      { source: "/profile", destination: "/plan/profile", permanent: false },
      { source: "/profile/:path*", destination: "/plan/profile/:path*", permanent: false },
      { source: "/sign-in", destination: "/plan/sign-in", permanent: false },
      { source: "/sign-in/:path*", destination: "/plan/sign-in/:path*", permanent: false },
      { source: "/sign-up", destination: "/plan/sign-up", permanent: false },
      { source: "/sign-up/:path*", destination: "/plan/sign-up/:path*", permanent: false },
    ];
  },
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
