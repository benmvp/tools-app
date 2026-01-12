import type { LucideIcon } from "lucide-react";

export type Indentation = "two-spaces" | "four-spaces" | "tabs";

export interface FormatConfig extends Record<string, string> {
  indentation: Indentation;
}

/**
 * Supported languages for code editors
 */
export type SupportedLanguage =
  | "typescript"
  | "javascript"
  | "json"
  | "yaml"
  | "css"
  | "html"
  | "graphql"
  | "markdown"
  | "xml";

/**
 * Server action function signature for formatters
 */
export type FormatterAction = (
  input: string,
  config: FormatConfig,
) => Promise<string>;

/**
 * Server action function signature for minifiers
 */
export type MinifierAction = (input: string) => Promise<string>;

/**
 * Unified Tool interface that combines nav/card data with page config
 */
export interface Tool {
  // Navigation & Card Display
  id: string;
  name: string;
  description: string; // Short description for cards/OG images
  url: string;
  icon: LucideIcon;
  comingSoon?: boolean;

  // Page Configuration
  action: FormatterAction | MinifierAction;
  example: string;
  language: SupportedLanguage;

  // Search keywords for command menu
  keywords?: string[];

  // SEO Metadata (static fallback when AI fails)
  metadata: {
    title: string;
    description: string; // Long meta description
  };
}
