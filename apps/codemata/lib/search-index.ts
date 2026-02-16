import type { ToolCategoryId } from "@repo/shared";
import type { LucideIcon } from "lucide-react";
import { ALL_TOOLS } from "./tools-data";

export interface SearchableToolItem {
  id: string;
  name: string;
  description: string;
  url: string;
  category: ToolCategoryId;
  keywords: string[];
  icon: LucideIcon;
  // For fuzzy matching - combined searchable text
  searchText: string;
}

/**
 * Build search index from ALL_TOOLS at module load time
 * Automatically includes all categories - no manual updates needed
 * Excludes tools marked as comingSoon
 */
function buildSearchIndex(): SearchableToolItem[] {
  return Object.entries(ALL_TOOLS).flatMap(([categoryId, category]) =>
    category.tools
      .filter((tool) => !tool.comingSoon) // Exclude coming soon tools
      .map((tool) => ({
        id: tool.id,
        name: tool.name,
        description: tool.description,
        url: tool.url,
        category: categoryId as ToolCategoryId,
        keywords: tool.keywords || [],
        icon: tool.icon,
        // Only index name + keywords for more precise fuzzy matching
        // Description creates too many false positives with cmdk fuzzy search
        searchText: [tool.name, ...(tool.keywords || [])]
          .join(" ")
          .toLowerCase(),
      })),
  );
}

export const SEARCH_INDEX = buildSearchIndex();

/**
 * Popular tools shown when no recent history exists
 */
export const POPULAR_TOOLS = [
  "/formatters/typescript-formatter",
  "/formatters/json-formatter",
  "/formatters/css-formatter",
  "/minifiers/typescript-minifier",
  "/minifiers/json-minifier",
] as const;
