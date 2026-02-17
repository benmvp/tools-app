import react from "@vitejs/plugin-react";
import type { UserConfig } from "vitest/config";

/**
 * Vitest configuration for React packages
 * Use this for packages that test React components (node environment)
 */
export const reactConfig: UserConfig = {
	plugins: [react()],
	test: {
		environment: "node",
		globals: true,
	},
};

/**
 * Vitest configuration for UI packages that need jsdom
 * Use this for packages that need DOM APIs in tests
 */
export const reactDomConfig: UserConfig = {
	plugins: [react()],
	test: {
		environment: "jsdom",
		globals: true,
	},
};
