import { getToolContent as getToolContentBase } from "@repo/ai";
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
 * Note: getToolContentBase is already cached with React.cache()
 */
export async function getToolContent(
  toolId: string,
  toolName: string,
  toolType:
    | "formatter"
    | "minifier"
    | "encoder"
    | "validator"
    | "generator"
    | "viewer",
) {
  const availableTools = getAllAvailableTools();
  return getToolContentBase(toolId, toolName, toolType, availableTools);
}

export async function getFormatterContent(toolId: string, toolName: string) {
  return getToolContent(toolId, toolName, "formatter");
}

export async function getMinifierContent(toolId: string, toolName: string) {
  return getToolContent(toolId, toolName, "minifier");
}

export async function getEncoderContent(toolId: string, toolName: string) {
  return getToolContent(toolId, toolName, "encoder");
}

export async function getValidatorContent(toolId: string, toolName: string) {
  return getToolContent(toolId, toolName, "validator");
}

export async function getGeneratorContent(toolId: string, toolName: string) {
  return getToolContent(toolId, toolName, "generator");
}

export async function getViewerContent(toolId: string, toolName: string) {
  return getToolContent(toolId, toolName, "viewer");
}
