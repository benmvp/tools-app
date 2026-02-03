import { cache } from "react";
import { generateToolContent } from "@/lib/ai/generate";
import { ALL_TOOLS } from "@/lib/tools-data";

/**
 * Helper to get all available tools for recommendation context
 */
export function getAllAvailableTools() {
  return Object.values(ALL_TOOLS)
    .flat()
    .map((tool) => ({
      displayName: tool.name,
      url: tool.url,
    }));
}

/**
 * Generate content for any tool with automatic category-aware caching
 * Wrapped in React cache() to deduplicate requests within same render
 * No category-specific functions needed - works for all tool types
 */
export const getToolContent = cache(
  async (
    toolId: string,
    toolName: string,
    toolType: "formatter" | "minifier" | "encoder" | "validator" | "generator",
  ) => {
    const availableTools = getAllAvailableTools();
    return generateToolContent(toolId, toolName, toolType, availableTools);
  },
);

/**
 * Category-specific helper functions for backward compatibility
 * These are thin wrappers that maintain existing component APIs
 * All logic centralized in getToolContent above
 */
export const getFormatterContent = cache(
  async (toolId: string, toolName: string) =>
    getToolContent(toolId, toolName, "formatter"),
);

export const getMinifierContent = cache(
  async (toolId: string, toolName: string) =>
    getToolContent(toolId, toolName, "minifier"),
);

export const getEncoderContent = cache(
  async (toolId: string, toolName: string) =>
    getToolContent(toolId, toolName, "encoder"),
);

export const getValidatorContent = cache(
  async (toolId: string, toolName: string) =>
    getToolContent(toolId, toolName, "validator"),
);

export const getGeneratorContent = cache(
  async (toolId: string, toolName: string) =>
    getToolContent(toolId, toolName, "generator"),
);
