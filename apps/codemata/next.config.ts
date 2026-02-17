import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
	reactCompiler: true,
	transpilePackages: ["@repo/shared", "@repo/ai", "@repo/ui"],
};

export default nextConfig;
