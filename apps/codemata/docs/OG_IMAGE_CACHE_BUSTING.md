# OpenGraph Image Cache Busting

## Overview

OG images are generated dynamically at `/api/og` with automatic cache management. This document explains how cache busting works and when manual intervention is needed.

## Automatic Cache Busting

### Tool Count Changes (Automatic)

When you add or remove tools, cache busting happens automatically:

**Home Page:**
- URL format: `/api/og?count=14`
- Count calculated from `ALL_TOOLS` registry
- Adding a tool updates count → new URL → fresh image

**Category Pages:**
- URL format: `/api/og?type=category&category=formatters&count=8`
- Count calculated from `ALL_TOOLS[category]`
- Adding a tool updates count → new URL → fresh image

**Tool Pages:**
- URL format: `/api/og?type=tool&category=formatters&name=JSON`
- No count parameter (stable URL)
- Images cached indefinitely
- Adding tools doesn't affect existing tool OG images

### How It Works

1. `getOgImageUrl()` in `lib/utils.ts` dynamically calculates counts from `ALL_TOOLS`
2. When you add a tool to `FORMATTER_TOOLS` or `MINIFIER_TOOLS`, the count changes
3. The helper regenerates URLs with new counts
4. Social platforms fetch new URLs → get fresh images

## Manual Cache Busting

### Design Changes

If you change the OG image design (layout, colors, fonts, etc.), the URL stays the same but content changes. Manual cache busting is required.

**Method: Add Version Parameter**

Add `&v=2` (or increment version) to all OG image URLs:

```typescript
// lib/utils.ts - getOgImageUrl()

export function getOgImageUrl(
  type?: "category" | "tool",
  params?: { category?: "formatters" | "minifiers"; name?: string },
): string {
  const { ALL_TOOLS } = require("./tools-data");
  const searchParams = new URLSearchParams();

  // Add version parameter for cache busting
  const VERSION = "2"; // Increment this when design changes

  if (!type) {
    // Home page
    const totalCount = Object.values(ALL_TOOLS).flat().length;
    searchParams.set("count", totalCount.toString());
    searchParams.set("v", VERSION); // ← Add version
  } else if (type === "category" && params?.category) {
    // Category page
    searchParams.set("type", "category");
    searchParams.set("category", params.category);
    const count = ALL_TOOLS[params.category].length;
    searchParams.set("count", count.toString());
    searchParams.set("v", VERSION); // ← Add version
  } else if (type === "tool" && params?.category && params?.name) {
    // Tool page
    searchParams.set("type", "tool");
    searchParams.set("category", params.category);
    searchParams.set("name", params.name);
    searchParams.set("v", VERSION); // ← Add version
  }

  return getAppUrl(`/api/og?${searchParams.toString()}`);
}
```

**Update `/api/og/route.tsx`:**

The API route already ignores unknown parameters, so no changes needed. The `v` parameter won't affect image generation, only the URL.

## When to Manually Bust Cache

**Increment VERSION when:**
- Changing image layout or dimensions
- Updating colors, gradients, or backgrounds
- Modifying fonts or text sizes
- Adjusting logo position or size
- Changing text content or taglines

**Don't increment VERSION when:**
- Adding or removing tools (counts handle this automatically)
- Renaming tools (tool names in URL change naturally)
- Updating metadata elsewhere (doesn't affect OG images)

## Deployment Checklist

After deploying OG image changes:

1. **Verify images render correctly:**
   ```bash
   # Test all three variants
   curl -I https://codemata.benmvp.com/api/og?count=14
   curl -I https://codemata.benmvp.com/api/og?type=category&category=formatters&count=8
   curl -I https://codemata.benmvp.com/api/og?type=tool&category=formatters&name=JSON
   ```

2. **Clear social media caches:**
   - [Twitter Card Validator](https://cards-dev.twitter.com/validator)
   - [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/)
   - [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)

3. **Verify metadata script passes:**
   ```bash
   cd apps/codemata
   pnpm verify-metadata
   ```

4. **Check tool counts match reality:**
   - Home page should show correct total tool count
   - Category pages should show correct category counts
   - Tool pages should display correct tool names

## Cache Headers

OG images use aggressive edge caching:

```typescript
headers: {
  "Cache-Control": "public, max-age=31536000, stale-while-revalidate=86400"
}
```

- **max-age=31536000**: Cache for 1 year (URL changes trigger fresh fetch)
- **stale-while-revalidate=86400**: Serve stale content for 24 hours while revalidating in background

This ensures:
- Fast load times (images cached at edge)
- Automatic updates when URLs change
- Graceful handling of API failures

## Troubleshooting

**Issue: OG image shows old design after deploying**

**Solution:** Increment `VERSION` parameter in `getOgImageUrl()`, redeploy, and clear social media caches.

**Issue: Tool count is incorrect in OG image**

**Solution:** Verify `ALL_TOOLS` in `lib/tools-data.ts` includes all tools. Run `pnpm verify-metadata` to check counts.

**Issue: Social platform shows cached old image**

**Solution:** Use platform-specific debugging tools to clear their cache (links above).

**Issue: OG image returns 500 error**

**Solution:** Check Edge Runtime logs on Vercel dashboard. Verify `@vercel/og` package is installed.
