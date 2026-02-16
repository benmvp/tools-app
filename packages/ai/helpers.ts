import { cache } from "react";
import { generateToolContent } from "./generate";

/**
 * Generate content for any tool with automatic category-aware caching
 * Wrapped in React cache() to deduplicate requests within same render
 * No category-specific functions needed - works for all tool types
 *
 * @param toolId - Unique identifier for the tool
 * @param toolName - Display name of the tool
 * @param toolType - Category type (formatter, minifier, encoder, etc.)
 * @param availableTools - Array of {displayName, url} for all tools in the app
 */
export const getToolContent = cache(
	async (
		toolId: string,
		toolName: string,
		toolType:
			| "formatter"
			| "minifier"
			| "encoder"
			| "validator"
			| "generator"
			| "viewer",
		availableTools: Array<{ displayName: string; url: string }>,
	) => {
		return generateToolContent(toolId, toolName, toolType, availableTools);
	},
);
