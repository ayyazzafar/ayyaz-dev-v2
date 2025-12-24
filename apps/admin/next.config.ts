import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Transpile Refine packages for compatibility
  transpilePackages: [
    "@refinedev/core",
    "@refinedev/nextjs-router",
    "@refinedev/react-hook-form",
    "@refinedev/simple-rest",
  ],
};

export default nextConfig;
