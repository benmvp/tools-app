import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  // Shiki uses dynamic imports and WASM that don't bundle well in serverless
  // Keep as external to avoid bundling issues
  serverExternalPackages: [
    "shiki",
    "@shikijs/core",
    "@shikijs/engine-oniguruma",
  ],
};

export default nextConfig;
