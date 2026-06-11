import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  serverExternalPackages: ["mongoose"],
  experimental: {},
};

export default nextConfig;
