import {
  ENCODER_TOOLS,
  FORMATTER_TOOLS,
  MINIFIER_TOOLS,
  VALIDATOR_TOOLS,
} from "./tools-data";

export interface SearchableToolItem {
  id: string;
  name: string;
  description: string;
  url: string;
  category: "Formatters" | "Minifiers" | "Encoders" | "Validators";
  keywords: string[];
  // For fuzzy matching - combined searchable text
  searchText: string;
}

/**
 * Build search index from all tools at module load time
 */
function buildSearchIndex(): SearchableToolItem[] {
  const formatters = Object.values(FORMATTER_TOOLS).map((tool) => ({
    id: tool.id,
    name: tool.name,
    description: tool.description,
    url: tool.url,
    category: "Formatters" as const,
    keywords: tool.keywords || [],
    // Only index name + keywords for more precise fuzzy matching
    // Description creates too many false positives with cmdk fuzzy search
    searchText: [tool.name, ...(tool.keywords || [])].join(" ").toLowerCase(),
  }));

  const minifiers = Object.values(MINIFIER_TOOLS).map((tool) => ({
    id: tool.id,
    name: tool.name,
    description: tool.description,
    url: tool.url,
    category: "Minifiers" as const,
    keywords: tool.keywords || [],
    // Only index name + keywords for more precise fuzzy matching
    // Description creates too many false positives with cmdk fuzzy search
    searchText: [tool.name, ...(tool.keywords || [])].join(" ").toLowerCase(),
  }));

  const encoders = Object.values(ENCODER_TOOLS).map((tool) => ({
    id: tool.id,
    name: tool.name,
    description: tool.description,
    url: tool.url,
    category: "Encoders" as const,
    keywords: tool.keywords || [],
    // Only index name + keywords for more precise fuzzy matching
    // Description creates too many false positives with cmdk fuzzy search
    searchText: [tool.name, ...(tool.keywords || [])].join(" ").toLowerCase(),
  }));

  const validators = Object.values(VALIDATOR_TOOLS).map((tool) => ({
    id: tool.id,
    name: tool.name,
    description: tool.description,
    url: tool.url,
    category: "Validators" as const,
    keywords: tool.keywords || [],
    // Only index name + keywords for more precise fuzzy matching
    // Description creates too many false positives with cmdk fuzzy search
    searchText: [tool.name, ...(tool.keywords || [])].join(" ").toLowerCase(),
  }));

  return [...formatters, ...minifiers, ...encoders, ...validators];
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
