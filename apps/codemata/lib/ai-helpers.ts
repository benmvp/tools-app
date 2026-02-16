import { getToolContent as getToolContentBase } from "@repo/ai";
import { cache } from "react";
import { getAllTools } from "./tools-data";

/**
 * Helper to get all available tools for recommendation context
 */
export function getAllAvailableTools() {
  return getAllTools().map((tool) => ({
    displayName: tool.name,
    url: tool.url,
  }));
}

/**
 * Category-specific helper functions
 * These wrap @repo/ai getToolContent with app-specific tool data
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
  ) => {
    const availableTools = getAllAvailableTools();
    return getToolContentBase(toolId, toolName, toolType, availableTools);
  },
);

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

export const getViewerContent = cache(
  async (toolId: string, toolName: string) =>
    getToolContent(toolId, toolName, "viewer"),
);
