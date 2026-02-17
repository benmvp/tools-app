import type { UserConfig } from "vitest/config";

/**
 * Base Vitest configuration for Node.js packages
 * Use this for packages without React or UI dependencies
 */
export const baseConfig: UserConfig = {
	test: {
		environment: "node",
		globals: true,
	},
};
