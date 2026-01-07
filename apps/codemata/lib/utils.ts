import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Determines the current environment mode for rendering strategy.
 *
 * Convention-based approach:
 * - Automatically detects from VERCEL_ENV or falls back to NODE_ENV
 * - Independent of AI generation settings (DISABLE_AI doesn't affect pre-rendering)
 *
 * Behavior:
 * - `next dev` → 'development' (no pre-rendering)
 * - `next build` (local) → 'production' (pre-render all pages)
 * - Vercel preview (VERCEL_ENV=preview) → 'preview' (on-demand)
 * - Vercel production (VERCEL_ENV=production) → 'production' (pre-render all pages)
 *
 * @returns 'development' | 'preview' | 'production'
 */
function getEnvironmentMode(): "development" | "preview" | "production" {
  // Check VERCEL_ENV first (most specific)
  const vercelEnv =
    process.env.VERCEL_ENV || process.env.NEXT_PUBLIC_VERCEL_ENV;

  if (vercelEnv === "production") return "production";
  if (vercelEnv === "preview") return "preview";
  if (vercelEnv === "development") return "development";

  // Fall back to NODE_ENV
  // next dev → development, next build → production
  return process.env.NODE_ENV === "production" ? "production" : "development";
}

/**
 * Determines whether AI content generation should run.
 * Checks DISABLE_AI flag first, then environment mode.
 *
 * @returns true if AI generation is enabled, false otherwise
 */
export function shouldGenerateAI(): boolean {
  // Override: force disable AI
  if (process.env.DISABLE_AI === "true") {
    return false;
  }

  // AI disabled in development mode (next dev)
  // AI enabled in preview and production modes
  return getEnvironmentMode() !== "development";
}

/**
 * Determines whether pages should be pre-rendered during build.
 * Based purely on environment mode, independent of AI settings.
 * Pages can be pre-rendered without AI content.
 *
 * @returns true if pages should be pre-rendered, false for on-demand generation
 */
export function isProductionBuild(): boolean {
  return getEnvironmentMode() === "production";
}

/**
 * Determines whether tool page links should be prefetched.
 * Only enabled in production mode to avoid triggering on-demand generation in preview.
 *
 * @returns true if links should be prefetched, false otherwise
 */
export function shouldPrefetch(): boolean {
  return getEnvironmentMode() === "production";
}

/**
 * Builds the full app URL using the VERCEL_PROJECT_PRODUCTION_URL environment variable.
 * Automatically detects localhost and uses http:// instead of https://.
 *
 * Usage:
 * - getAppUrl() → "https://codemata.benmvp.com" (production)
 * - getAppUrl() → "http://localhost:3001" (local dev)
 * - getAppUrl("/formatters") → "https://codemata.benmvp.com/formatters"
 *
 * Environment Variables:
 * - VERCEL_PROJECT_PRODUCTION_URL: Domain without protocol (e.g., "codemata.benmvp.com" or "localhost:3001")
 * - Vercel automatically sets this in production/preview
 * - Set manually in .env.local for local development
 *
 * @param path - Optional path to append (should start with /)
 * @returns Full URL with protocol
 */
export function getAppUrl(path = ""): string {
  const domain =
    process.env.VERCEL_PROJECT_PRODUCTION_URL ||
    process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL ||
    "codemata.benmvp.com";

  // Detect localhost and use http:// instead of https://
  const protocol = domain.includes("localhost") ? "http://" : "https://";

  return `${protocol}${domain}${path}`;
}

/**
 * Builds the full URL for a tool page.
 * Convenience wrapper around getAppUrl() that accepts a ToolWithIcon object.
 *
 * Usage:
 * - getToolUrl(tool) → "https://codemata.benmvp.com/formatters/typescript-formatter"
 *
 * @param tool - Tool object with url property
 * @returns Full URL for the tool page
 */
export function getToolUrl(tool: { url: string }): string {
  return getAppUrl(tool.url);
}

/**
 * OG Image version - increment this when making design changes to bust all caches.
 * Current version: 1 (initial implementation)
 */
export const OG_IMAGE_VERSION = "1";

/**
 * Generates OG image URLs with title + description.
 *
 * Usage:
 * - getOgImageUrl("14 Free Developer Tools", "...", "14") → "/api/og?title=...&description=...&v=14"
 * - getOgImageUrl("JSON Formatter", "...") → "/api/og?title=...&description=...&v=1"
 *
 * Cache Busting Strategy:
 * - Pages with dynamic counts: Pass count as cacheKey → URL changes when tools added
 * - Static tool pages: No cacheKey → uses OG_IMAGE_VERSION, stable URL
 * - Design changes: Increment OG_IMAGE_VERSION constant above
 *
 * @param title - Main heading text (e.g., "14 Free Developer Tools", "JSON Formatter")
 * @param description - Supporting description text
 * @param cacheKey - Optional cache-busting key (defaults to OG_IMAGE_VERSION)
 * @returns Full OG image URL
 */
export function getOgImageUrl(
  title: string,
  description: string,
  cacheKey?: string,
): string {
  const searchParams = new URLSearchParams();
  searchParams.set("title", title);
  searchParams.set("description", description);
  searchParams.set("v", cacheKey || OG_IMAGE_VERSION);

  return getAppUrl(`/api/og?${searchParams.toString()}`);
}
