import type { LucideIcon } from "lucide-react";
import type { ValidationResult } from "./validators/types";

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

/**
 * Configuration for SQL formatter using sql-formatter library.
 * Maps to sql-formatter's FormatOptions:
 * - dialect → language (SQL dialect/vendor)
 * - keywordCase → keywordCase ("upper" or "lower")
 * - indentation → tabWidth + useTabs (2/4 spaces or tabs)
 * Other sql-formatter options (linesBetweenQueries, etc.) use library defaults.
 */
export interface SqlFormatConfig extends FormatConfig {
  dialect: SqlDialect;
  keywordCase: KeywordCase;
}

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
 * Mode for encoder/decoder tools
 */
export type EncoderMode = "encode" | "decode";

/**
 * Server action function signature for encoders/decoders
 */
export type EncoderAction = (
  input: string,
  mode: EncoderMode,
) => Promise<string>;

/**
 * Server action function signature for JWT decoder (decode-only)
 */
export type JwtDecoderAction = (input: string) => Promise<string>;

/**
 * Server action function signature for viewers
 * Takes raw input and returns rendered HTML (sanitized)
 */
export type ViewerAction = (input: string) => Promise<string>;

/**
 * Base Tool interface for all tools (formatters, minifiers, converters, etc.)
 */
export interface Tool {
  // Navigation & Card Display
  id: string;
  name: string;
  description: string; // Short description for cards/OG images
  url: string;
  icon: LucideIcon;
  comingSoon?: boolean;

  // Search keywords for command menu
  keywords?: string[];

  // SEO Metadata (static fallback when AI fails)
  metadata: {
    title: string;
    description: string; // Long meta description
  };
}

/**
 * Formatter Tool interface with language support
 */
export interface FormatterTool extends Tool {
  action: FormatterAction | SqlFormatterAction;
  example: string;
  language:
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
}

/**
 * Minifier Tool interface with language support (excludes SQL and GraphQL)
 */
export interface MinifierTool extends Tool {
  action: MinifierAction;
  example: string;
  language: "typescript" | "javascript" | "json" | "css" | "html" | "xml";
}

/**
 * Encoder Tool interface with mode support
 */
export interface EncoderTool extends Tool {
  action: EncoderAction | JwtDecoderAction;
  modes?: { value: EncoderMode; label: string }[];
  defaultMode?: EncoderMode;
  example: string;
  language: "typescript" | "javascript" | "json" | "text" | "html" | "xml";
}

/**
 * Validator Tool interface
 */
export interface ValidatorTool extends Tool {
  action?: ValidatorAction;
  example: string;
  language: "json" | "html" | "css" | "xml" | "text";
}

/**
 * Validator action type
 */
export type ValidatorAction = (
  input: string,
  options?: Record<string, unknown>,
) => Promise<ValidationResult>;

/**
 * Generator Tool interface
 *
 * Generators create boilerplate code, configuration files, and templates.
 * Unlike formatters/minifiers/encoders, generators have bespoke UIs with custom
 * interactions (e.g., template selection, form inputs, multi-step workflows).
 *
 * Key differences from other tool types:
 * - No `action` property: Generators use custom server actions specific to their logic
 * - No `language` property: Output format varies by generator (not tied to single language)
 * - No `example` property: Generators use interactive UIs instead of pre-filled examples
 *
 * Examples: .gitignore Generator (template selection), UUID Generator (config options),
 * QR Code Generator (input form + image output)
 */
export interface GeneratorTool extends Tool {
  // Intentionally minimal - generators have unique implementations
  // See individual generator components for specific UI/logic patterns
}

/**
 * Viewer Tool interface
 *
 * Viewers preview and visualize code/data formats with rendered output.
 * Unlike formatters (code → formatted code), viewers transform input into visual display
 * (e.g., markdown → HTML, SVG → rendered graphic, JSON → tree view).
 *
 * Key characteristics:
 * - `action`: Server-side rendering that returns sanitized HTML or visual output
 * - `language`: Input format (e.g., "markdown", "svg", "json")
 * - `example`: Sample input to demonstrate viewer capabilities
 *
 * Examples: Markdown Previewer (markdown → HTML), SVG Viewer (SVG → rendered image),
 * Diff Viewer (two files → side-by-side comparison)
 */
export interface ViewerTool extends Tool {
  action: ViewerAction;
  example: string;
  language: "markdown" | "svg" | "json" | "xml" | "html" | "text";
}

/**
 * Type-safe category identifiers
 * Use this instead of loose strings for category references
 */
export type ToolCategoryId =
  | "formatters"
  | "minifiers"
  | "encoders"
  | "validators"
  | "generators"
  | "viewers";

/**
 * Tool category metadata with nested tools
 * Single source of truth for all category information
 */
export interface ToolCategory {
  id: ToolCategoryId;
  label: string; // Display name: "Formatters"
  singular: string; // Singular form: "Formatter"
  url: string; // Category page: "/formatters"
  description: string; // SEO/meta description
  order: number; // Display order (1, 2, 3...)
  tools:
    | FormatterTool[]
    | MinifierTool[]
    | EncoderTool[]
    | ValidatorTool[]
    | GeneratorTool[]
    | ViewerTool[];
}
