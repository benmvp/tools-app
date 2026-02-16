/**
 * In-memory cache for AI-generated content
 * Prevents duplicate API calls during the same build/request cycle
 */

interface CacheEntry<T> {
	content: T;
	timestamp: number;
}

// Production in-memory cache
const CACHE = new Map<string, CacheEntry<unknown>>();

// Cache TTL: 24 hours (matches ISR revalidation)
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

/**
 * Get cached content if it exists and is fresh
 */
export function getCachedContent<T>(cacheKey: string): T | undefined {
	const entry = CACHE.get(cacheKey) as CacheEntry<T> | undefined;

	if (!entry) {
		return undefined;
	}

	// Check if cache is still fresh
	const age = Date.now() - entry.timestamp;
	if (age > CACHE_TTL_MS) {
		// Cache expired, remove it
		CACHE.delete(cacheKey);
		return undefined;
	}

	return entry.content;
}

/**
 * Store content in cache with current timestamp
 */
export function setCachedContent<T>(cacheKey: string, content: T): void {
	CACHE.set(cacheKey, {
		content,
		timestamp: Date.now(),
	});
}

/**
 * Clear all cached content (useful for testing/debugging)
 */
export function clearCache(): void {
	CACHE.clear();
}

/**
 * Get cache statistics (useful for monitoring)
 */
export function getCacheStats() {
	return {
		size: CACHE.size,
		keys: Array.from(CACHE.keys()),
	};
}
