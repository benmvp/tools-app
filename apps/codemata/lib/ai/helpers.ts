import { cache } from "react";
import { generateToolContent } from "@/lib/ai/generate";

/**
 * Helper to get all available tools for recommendation context
 * Combines formatters and minifiers
 */
export function getAllAvailableTools() {
  // For now, hardcode the tools until we refactor the existing structure
  // In the future, this should pull from FORMATTERS and MINIFIERS configs
  return [
    {
      displayName: "TypeScript Formatter",
      url: "/formatters/typescript-formatter",
    },
    { displayName: "JSON Formatter", url: "/formatters/json-formatter" },
    { displayName: "CSS Formatter", url: "/formatters/css-formatter" },
    { displayName: "HTML Formatter", url: "/formatters/html-formatter" },
    { displayName: "GraphQL Formatter", url: "/formatters/graphql-formatter" },
    {
      displayName: "Markdown Formatter",
      url: "/formatters/markdown-formatter",
    },
    { displayName: "XML Formatter", url: "/formatters/xml-formatter" },
    { displayName: "YAML Formatter", url: "/formatters/yaml-formatter" },
    {
      displayName: "TypeScript Minifier",
      url: "/minifiers/typescript-minifier",
    },
    { displayName: "JSON Minifier", url: "/minifiers/json-minifier" },
    { displayName: "CSS Minifier", url: "/minifiers/css-minifier" },
    { displayName: "HTML Minifier", url: "/minifiers/html-minifier" },
    { displayName: "SVG Minifier", url: "/minifiers/svg-minifier" },
    { displayName: "XML Minifier", url: "/minifiers/xml-minifier" },
  ];
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
