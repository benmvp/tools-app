/**
 * Next.js ISR (Incremental Static Regeneration) configuration constants
 */

/**
 * Page revalidation period in seconds.
 * Controls how often statically generated pages are refreshed.
 *
 * Current setting: 7 days (604800 seconds)
 * - Production builds: Pages pre-rendered with AI content at build time
 * - Preview builds: Pages generated on-demand, cached for this duration
 */
export const PAGE_REVALIDATE_SECONDS = 604800; // 7 days
