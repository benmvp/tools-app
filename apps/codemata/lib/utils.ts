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
