import type { NextConfig } from "next";

/**
 * Static export: the presentation version needs no server.
 * Remove `output: "export"` once a backend (CMS / admin / form API) is added.
 */
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
};

export default nextConfig;
