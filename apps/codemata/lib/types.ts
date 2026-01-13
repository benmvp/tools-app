import type { LucideIcon } from "lucide-react";

export type Indentation = "two-spaces" | "four-spaces" | "tabs";

export type KeywordCase = "uppercase" | "lowercase";

export type SqlDialect =
  | "postgresql"
  | "mysql"
  | "mariadb"
  | "sqlite"
  | "sql"
  | "bigquery"
  | "db2"
  | "db2i"
  | "hive"
  | "n1ql"
  | "plsql"
  | "redshift"
  | "singlestoredb"
  | "snowflake"
  | "spark"
  | "transactsql"
  | "trino";

export interface FormatConfig extends Record<string, string> {
  indentation: Indentation;
}

export interface SqlFormatConfig extends FormatConfig {
  dialect: SqlDialect;
  keywordCase: KeywordCase;
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
  | "xml"
  | "sql";

/**
 * Server action function signature for formatters
 */
export type FormatterAction = (
  input: string,
  config: FormatConfig,
) => Promise<string>;

/**
 * Server action function signature for SQL formatter
 */
export type SqlFormatterAction = (
  input: string,
  config: SqlFormatConfig,
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
  action: FormatterAction | SqlFormatterAction | MinifierAction;
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
