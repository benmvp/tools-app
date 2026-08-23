/**
 * Moni-specific wrapper for recent tools utilities
 * Provides app-namespaced functions for tracking recent tool visits
 */

import {
	addRecentTool as addRecentToolBase,
	clearRecentTools as clearRecentToolsBase,
	getRecentTools as getRecentToolsBase,
} from "@repo/shared";

const APP_NAME = "moni";

/**
 * Get recent tool URLs from localStorage (Moni-namespaced)
 */
export function getRecentTools(): string[] {
	return getRecentToolsBase(APP_NAME);
}

/**
 * Add a tool URL to recent tools list (Moni-namespaced)
 */
export function addRecentTool(url: string): void {
	addRecentToolBase(APP_NAME, url);
}

/**
 * Clear all recent tools (Moni-namespaced)
 */
export function clearRecentTools(): void {
	clearRecentToolsBase(APP_NAME);
}
