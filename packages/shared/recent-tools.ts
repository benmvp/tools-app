const MAX_RECENT_TOOLS = 5;

/**
 * Build storage key with app-specific prefix
 * @param appName - The app name (e.g., "codemata", "moni", "convertly")
 */
function getStorageKey(appName: string): string {
	return `${appName}:recent-tools`;
}

/**
 * Get recent tool URLs from localStorage
 * Returns empty array if none exist or localStorage unavailable
 * @param appName - The app name to namespace the storage key
 */
export function getRecentTools(appName: string): string[] {
	if (typeof window === "undefined") return [];

	try {
		const stored = localStorage.getItem(getStorageKey(appName));
		if (!stored) return [];

		const parsed = JSON.parse(stored);
		return Array.isArray(parsed) ? parsed : [];
	} catch (error) {
		console.error("Failed to read recent tools:", error);
		return [];
	}
}

/**
 * Add a tool URL to recent tools list
 * Maintains max size and moves most recent to front
 * @param appName - The app name to namespace the storage key
 * @param url - The tool URL to add
 */
export function addRecentTool(appName: string, url: string): void {
	if (typeof window === "undefined") return;

	try {
		const recent = getRecentTools(appName);

		// Remove if already exists (we'll add to front)
		const filtered = recent.filter((item) => item !== url);

		// Add to front
		const updated = [url, ...filtered].slice(0, MAX_RECENT_TOOLS);

		localStorage.setItem(getStorageKey(appName), JSON.stringify(updated));
	} catch (error) {
		console.error("Failed to save recent tool:", error);
	}
}

/**
 * Clear all recent tools (useful for testing/reset)
 * @param appName - The app name to namespace the storage key
 */
export function clearRecentTools(appName: string): void {
	if (typeof window === "undefined") return;

	try {
		localStorage.removeItem(getStorageKey(appName));
	} catch (error) {
		console.error("Failed to clear recent tools:", error);
	}
}
