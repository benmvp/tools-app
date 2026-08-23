# OpenGraph Image Cache Busting

## Overview

OG images are generated dynamically at `/api/og` using a simplified title + description API. Cache busting happens **automatically** through content changes, with minimal manual intervention needed.

## How It Works

### URL Format

All OG images use a simple, consistent format:

```
/api/og?title=<page-title>&description=<page-description>&v=<version>
```

**Parameters:**
- `title` - Main heading text (e.g., "14 Free Developer Tools", "JSON Formatter")
- `description` - Supporting description text
- `v` - Version number from `OG_IMAGE_VERSION` constant

### Automatic Cache Busting

Cache busting happens **automatically** when page content changes:

**Home Page:**
```
/api/og?title=14+Free+Developer+Tools&description=...&v=1
```
- Adding a tool: `14` → `15` → URL changes → new image

**Category Pages:**
```
/api/og?title=8+Formatters&description=...&v=1
```
- Adding a formatter: `8` → `9` → URL changes → new image

**Tool Pages:**
```
/api/og?title=JSON+Formatter&description=...&v=1
```
- Each tool has unique title → unique URL → unique image
- Tool name changes → URL changes → new image

**Key Insight:** The title parameter naturally changes when tools are added/removed, automatically busting the cache without any manual intervention.

## Manual Cache Busting

### When Design Changes

If you modify the OG image **design** (layout, colors, fonts, logo position, etc.) without changing any page titles, increment `OG_IMAGE_VERSION`:

```typescript
// lib/utils.ts
export const OG_IMAGE_VERSION = "2";  // Increment this number
```

This updates the `v` parameter in all OG image URLs, forcing fresh generation.

### What Requires Manual Busting

**Increment OG_IMAGE_VERSION when:**
- Changing image dimensions (though 1200×630 is standard)
- Updating gradient colors or background
- Modifying font sizes (title: 110px, description: 36px)
- Adjusting logo size or position
- Changing decorative elements (circles, bars, etc.)
- Updating brand colors or styling

**Don't increment when:**
- Adding/removing tools (title text changes automatically)
- Updating page descriptions (URL parameter changes automatically)
- Changing metadata elsewhere (doesn't affect OG images)
- Renaming tools (title parameter updates automatically)

## Implementation Details

### Code Example

```typescript
// lib/utils.ts
export const OG_IMAGE_VERSION = "1";

export function getOgImageUrl(
  title: string,
  description: string,
): string {
  const searchParams = new URLSearchParams();
  searchParams.set("title", title);
  searchParams.set("description", description);
  searchParams.set("v", OG_IMAGE_VERSION);

  return getAppUrl(`/api/og?${searchParams.toString()}`);
}
```

### Usage in Pages

```typescript
// Home page - count in title
const totalCount = Object.values(ALL_TOOLS).flat().length;
const ogImageUrl = getOgImageUrl(
  `${totalCount} Free Developer Tools`,
  SITE_CONFIG.pages.home.description
);

// Category page - count in title
const ogImageUrl = getOgImageUrl(
  `${ALL_FORMATTERS.length} Formatters`,
  SITE_CONFIG.pages.formatters.description
);

// Tool page - unique tool name
const ogImageUrl = getOgImageUrl(
  formatter.name,
  formatter.metadata.description
);
```

## Cache Headers

OG images use aggressive edge caching:

```typescript
headers: {
  "Cache-Control": "public, max-age=31536000, stale-while-revalidate=86400"
}
```

- **max-age=31536000**: Cache for 1 year
- **stale-while-revalidate=86400**: Serve stale for 24 hours while revalidating

Since URLs change when content changes, this long cache is safe and performant.

## Verification

### Metadata Verification Script

Run after making changes:

```bash
cd apps/codemata
pnpm verify-metadata
```

This validates:
- All 17 pages have OG images
- URLs include title, description, and v parameters
- Title text includes counts for home/category pages
- Images are accessible and valid PNG format
- All metadata is complete and unique

### Manual Testing

Test generated images locally:

```bash
# Start dev server
pnpm dev

# Test image generation (in browser)
http://localhost:3001/api/og?title=Test&description=Testing&v=1
```

## Deployment Checklist

After deploying OG image changes:

1. **Run verification script:**
   ```bash
   cd apps/codemata
   pnpm verify-metadata  # Must pass 100%
   ```

2. **Test image URLs:**
   ```bash
   curl -I https://codemata.benmvp.com/api/og?title=Test&description=Test&v=1
   # Should return 200 OK with Content-Type: image/png
   ```

3. **Clear social media caches:**
   - [Twitter Card Validator](https://cards-dev.twitter.com/validator)
   - [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/)
   - [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)

4. **Verify on social platforms:**
   - Share a link on Twitter/LinkedIn
   - Confirm image renders correctly
   - Check title and description display

## Troubleshooting

### Issue: OG image shows old design after deploying

**Solution:**
1. Increment `OG_IMAGE_VERSION` in `lib/utils.ts`
2. Redeploy
3. Clear social media caches using debugger tools above

### Issue: Tool count not updating in OG image

**Problem:** You added tools but the count still shows old number.

**Solution:** This shouldn't happen with the new system. The count is embedded in the title parameter. Check:
1. Did you restart the dev server?
2. Is the tool properly added to `FORMATTER_TOOLS` or `MINIFIER_TOOLS`?
3. Run `pnpm verify-metadata` to check actual URLs

### Issue: Social platform shows cached old image

**Solution:** Use platform-specific debugging tools (links above) to force a refresh. Social platforms cache aggressively.

### Issue: OG image returns 500 error

**Solution:**
1. Check Vercel Edge Runtime logs in dashboard
2. Verify `@vercel/og` package is installed (`pnpm list @vercel/og`)
3. Check if title/description contain special characters that need encoding

### Issue: Image displays but looks broken

**Solution:**
1. Verify image dimensions are 1200×630 (in `route.tsx`)
2. Check if fonts are loading (Inter should be auto-loaded by Next.js)
3. Test locally first: `http://localhost:3001/api/og?title=Test&description=Test&v=1`

## Benefits of This Approach

1. **Zero manual work** for content changes - adding/removing tools automatically generates new URLs
2. **Simple API** - just title + description, no complex type/category/name logic
3. **Easy debugging** - URL parameters are human-readable
4. **Type-safe** - all URLs generated through centralized `getOgImageUrl()` helper
5. **Automatic validation** - `verify-metadata` script catches issues before deploy
