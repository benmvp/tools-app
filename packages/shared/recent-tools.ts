const STORAGE_KEY = "codemata:recent-tools";
const MAX_RECENT_TOOLS = 5;

/**
 * Get recent tool URLs from localStorage
 * Returns empty array if none exist or localStorage unavailable
 */
export function getRecentTools(): string[] {
	if (typeof window === "undefined") return [];

	try {
		const stored = localStorage.getItem(STORAGE_KEY);
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
 */
export function addRecentTool(url: string): void {
	if (typeof window === "undefined") return;

	try {
		const recent = getRecentTools();

		// Remove if already exists (we'll add to front)
		const filtered = recent.filter((item) => item !== url);

		// Add to front
		const updated = [url, ...filtered].slice(0, MAX_RECENT_TOOLS);

		localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
	} catch (error) {
		console.error("Failed to save recent tool:", error);
	}
}

/**
 * Clear all recent tools (useful for testing/reset)
 */
export function clearRecentTools(): void {
	if (typeof window === "undefined") return;

	try {
		localStorage.removeItem(STORAGE_KEY);
	} catch (error) {
		console.error("Failed to clear recent tools:", error);
	}
}
