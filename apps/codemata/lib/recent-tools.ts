/**
 * Codemata-specific wrapper for recent tools utilities
 * Provides app-namespaced functions for tracking recent tool visits
 */

import {
	addRecentTool as addRecentToolBase,
	clearRecentTools as clearRecentToolsBase,
	getRecentTools as getRecentToolsBase,
} from "@repo/shared";

const APP_NAME = "codemata";

/**
 * Get recent tool URLs from localStorage (Codemata-namespaced)
 */
export function getRecentTools(): string[] {
	return getRecentToolsBase(APP_NAME);
}

/**
 * Add a tool URL to recent tools list (Codemata-namespaced)
 */
export function addRecentTool(url: string): void {
	addRecentToolBase(APP_NAME, url);
}

/**
 * Clear all recent tools (Codemata-namespaced)
 */
export function clearRecentTools(): void {
	clearRecentToolsBase(APP_NAME);
}
