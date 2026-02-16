import { resolve } from "node:path";
import react from "@vitejs/plugin-react";
import type { UserConfig } from "vitest/config";

/**
 * Vitest configuration for Next.js apps
 * Includes React support, path aliases, and E2E test exclusion
 *
 * @param dirname - Pass `__dirname` from your vitest.config.ts
 */
export function nextjsConfig(dirname: string): UserConfig {
	return {
		plugins: [react()],
		test: {
			environment: "node",
			globals: true,
			exclude: ["**/node_modules/**", "**/tests/e2e/**"],
		},
		resolve: {
			alias: {
				"@": resolve(dirname, "."),
			},
		},
	};
}
