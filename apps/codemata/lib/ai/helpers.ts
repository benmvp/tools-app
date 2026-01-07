import { cache } from "react";
import { generateToolContent } from "@/lib/ai/generate";
import { ALL_FORMATTERS, ALL_MINIFIERS } from "@/lib/tools-data";

/**
 * Helper to get all available tools for recommendation context
 * Combines formatters and minifiers from centralized tool data
 */
export function getAllAvailableTools() {
  const formatters = ALL_FORMATTERS.map((tool) => ({
    displayName: tool.name,
    url: tool.url,
  }));

  const minifiers = ALL_MINIFIERS.map((tool) => ({
    displayName: tool.name,
    url: tool.url,
  }));

  return [...formatters, ...minifiers];
}

/**
 * Generate formatter content with all available tools context
 * Wrapped in React cache() to deduplicate requests within same render
 */
export const getFormatterContent = cache(
  async (toolId: string, toolName: string) => {
    const availableTools = getAllAvailableTools();
    return generateToolContent(toolId, toolName, "formatter", availableTools);
  },
);

/**
 * Generate minifier content with all available tools context
 * Wrapped in React cache() to deduplicate requests within same render
 */
export const getMinifierContent = cache(
  async (toolId: string, toolName: string) => {
    const availableTools = getAllAvailableTools();
    return generateToolContent(toolId, toolName, "minifier", availableTools);
  },
);
