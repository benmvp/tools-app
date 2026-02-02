import { cache } from "react";
import { generateToolContent } from "@/lib/ai/generate";
import {
  ALL_ENCODERS,
  ALL_FORMATTERS,
  ALL_GENERATORS,
  ALL_MINIFIERS,
  ALL_VALIDATORS,
} from "@/lib/tools-data";

/**
 * Helper to get all available tools for recommendation context
 * Combines formatters, minifiers, encoders, validators, and generators from centralized tool data
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

  const encoders = ALL_ENCODERS.map((tool) => ({
    displayName: tool.name,
    url: tool.url,
  }));

  const validators = ALL_VALIDATORS.map((tool) => ({
    displayName: tool.name,
    url: tool.url,
  }));

  const generators = ALL_GENERATORS.map((tool) => ({
    displayName: tool.name,
    url: tool.url,
  }));

  return [
    ...formatters,
    ...minifiers,
    ...encoders,
    ...validators,
    ...generators,
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

/**
 * Generate encoder content with all available tools context
 * Wrapped in React cache() to deduplicate requests within same render
 */
export const getEncoderContent = cache(
  async (toolId: string, toolName: string) => {
    const availableTools = getAllAvailableTools();
    return generateToolContent(toolId, toolName, "encoder", availableTools);
  },
);

/**
 * Generate validator content with all available tools context
 * Wrapped in React cache() to deduplicate requests within same render
 */
export const getValidatorContent = cache(
  async (toolId: string, toolName: string) => {
    const availableTools = getAllAvailableTools();
    return generateToolContent(toolId, toolName, "validator", availableTools);
  },
);

/**
 * Generate generator content with all available tools context
 * Wrapped in React cache() to deduplicate requests within same render
 */
export const getGeneratorContent = cache(
  async (toolId: string, toolName: string) => {
    const availableTools = getAllAvailableTools();
    return generateToolContent(toolId, toolName, "generator", availableTools);
  },
);
