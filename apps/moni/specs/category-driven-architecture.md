# Category-Driven Architecture Refactor - Implementation Specification

**Status:** 📋 Planned (Post-gitignore tool implementation)
**Priority:** High - Eliminates recurring maintenance issue
**Estimated Effort:** Medium (3-4 hours)

---

## Table of Contents

1. [Background & Problem Statement](#background--problem-statement)
2. [Current State Analysis](#current-state-analysis)
3. [Proposed Architecture](#proposed-architecture)
4. [Migration Plan](#migration-plan)
5. [Success Criteria](#success-criteria)
6. [Testing Strategy](#testing-strategy)
7. [Edge Cases & Risks](#edge-cases--risks)
8. [Future Enhancements](#future-enhancements)

---

## Background & Problem Statement

### The Recurring Issue

**Every time a new tool category is added, we must manually update multiple files:**

1. ✅ Add tools to `lib/tools-data.ts` (e.g., `GENERATOR_TOOLS`, `ALL_GENERATORS`)
2. ✅ Add to `ALL_TOOLS` registry
3. ❌ **FORGOT:** Add category section to `components/CommandMenu.tsx`
4. ❌ **FORGOT:** Add category section to `app/page.tsx` (home page)
5. ❌ **FORGOT:** Add to `app/sitemap.ts` category pages
6. ❌ **FORGOT:** Update navigation components

**Recent Example:** `.gitignore Generator` category was added but missing from CommandMenu search, requiring manual fix.

### Root Cause

**`ALL_TOOLS` is category-agnostic** - it's just a lookup object with no metadata:

```typescript
// Current structure - just arrays, no metadata
export const ALL_TOOLS = {
  formatters: ALL_FORMATTERS,    // Tool[]
  minifiers: ALL_MINIFIERS,      // Tool[]
  encoders: ALL_ENCODERS,        // Tool[]
  validators: ALL_VALIDATORS,    // Tool[]
  generators: ALL_GENERATORS,    // Tool[]
} as const;
```

**Problems:**
- No display names → must hardcode "Formatters" everywhere
- No URLs → must hardcode "/formatters" everywhere
- No descriptions → must hardcode category descriptions
- No order → alphabetical by default, no control
- **Maintenance burden:** Adding a category requires updating 5+ files

---

## Current State Analysis

### Files That Access ALL_TOOLS (Comprehensive Audit)

#### 1. **Direct Tool Iteration** (6 files)
- `app/page.tsx` - Home page sections (hardcoded headings + descriptions)
- `components/CommandMenu.tsx` - Search categories (hardcoded filters)
- `app/sitemap.ts` - Category pages (hardcoded URLs)
- `components/layout/NavigationList.tsx` - Sidebar links (hardcoded labels)
- `scripts/verify-metadata.ts` - Metadata validation (hardcoded categories)
- `lib/ai/helpers.ts` - getAllAvailableTools() (manual concatenation)

#### 2. **Metadata Generation** (2 files)
- `scripts/verify-metadata.ts` - Count tools per category
- `app/page.tsx` - Total tool count for OG image

#### 3. **Icon Mapping** (1 file)
- `components/CommandMenu.tsx` - Flatten ALL_TOOLS to create ICON_MAP

### Current Usage Patterns

```typescript
// Pattern 1: Flatten for total count
const totalCount = Object.values(ALL_TOOLS).flat().length;

// Pattern 2: Direct category access
ALL_TOOLS.formatters.map(tool => ...)

// Pattern 3: Iterate categories
Object.entries(ALL_TOOLS).forEach(([category, tools]) => ...)

// Pattern 4: Hardcoded category metadata
<h2>Formatters</h2>  // Label
<Link href="/formatters">  // URL
<p>Beautify and format your code...</p>  // Description
```

### What's Wrong With This?

1. **Duplication:** Category names appear 10+ times across codebase
2. **Fragility:** Adding category = updating 5+ files (easy to forget)
3. **Inconsistency:** Category descriptions differ between pages
4. **No single source of truth:** Data scattered everywhere

---

## Proposed Architecture

### New Category-Driven Structure

```typescript
/**
 * Tool category metadata with nested tools
 * Single source of truth for all category information
 */
interface ToolCategory {
  id: string;              // Machine-readable: "formatters"
  label: string;           // Human-readable: "Formatters"
  url: string;             // Category page: "/formatters"
  description: string;     // SEO/meta description
  order: number;           // Display order (1, 2, 3...)
  tools: Tool[];           // Array of tools in this category
}

/**
 * ALL_TOOLS becomes a Record of ToolCategory objects
 * Keys are category IDs for backward compatibility
 */
export const ALL_TOOLS: Record<string, ToolCategory> = {
  formatters: {
    id: "formatters",
    label: "Formatters",
    url: "/formatters",
    description: "Beautify and format your code with consistent styling",
    order: 1,
    tools: ALL_FORMATTERS,
  },
  minifiers: {
    id: "minifiers",
    label: "Minifiers",
    url: "/minifiers",
    description: "Compress your code by removing whitespace and optimizing",
    order: 2,
    tools: ALL_MINIFIERS,
  },
  encoders: {
    id: "encoders",
    label: "Encoders & Decoders",
    url: "/encoders",
    description: "Encode and decode data for Base64, URL, HTML entities, JavaScript strings, and JWT tokens",
    order: 3,
    tools: ALL_ENCODERS,
  },
  validators: {
    id: "validators",
    label: "Validators",
    url: "/validators",
    description: "Validate JSON, HTML, CSS, XML, and test regex patterns with detailed error messages",
    order: 4,
    tools: ALL_VALIDATORS,
  },
  generators: {
    id: "generators",
    label: "Generators",
    url: "/generators",
    description: "Generate boilerplate code and configuration files for your projects",
    order: 5,
    tools: ALL_GENERATORS,
  },
} as const;

/**
 * Helper functions for common operations
 */

// Get all tools across all categories
export function getAllTools(): Tool[] {
  return Object.values(ALL_TOOLS).flatMap(category => category.tools);
}

// Get categories sorted by order
export function getCategoriesByOrder(): ToolCategory[] {
  return Object.values(ALL_TOOLS).sort((a, b) => a.order - b.order);
}

// Get category by ID
export function getCategoryById(id: string): ToolCategory | undefined {
  return ALL_TOOLS[id];
}

// Get total tool count (excluding comingSoon)
export function getTotalToolCount(): number {
  return getAllTools().filter(tool => !tool.comingSoon).length;
}
```

### Benefits of This Approach

| Aspect | Before | After |
|--------|--------|-------|
| **Adding new category** | Update 5+ files | Update 1 object in tools-data.ts |
| **Category name** | Hardcoded 10+ times | Defined once in `label` |
| **Category URL** | Hardcoded everywhere | Defined once in `url` |
| **Category order** | Alphabetical or manual | Controlled via `order` field |
| **Maintenance** | High (easy to forget files) | Low (automatic everywhere) |
| **Type safety** | Partial | Full (ToolCategory interface) |
| **Discoverability** | Must know all files | Single file to update |

---

## Migration Plan

### Phase 1: Update Type Definitions (lib/types.ts)

```typescript
// Add new ToolCategory interface
export interface ToolCategory {
  id: string;
  label: string;
  url: string;
  description: string;
  order: number;
  tools: (FormatterTool | MinifierTool | EncoderTool | ValidatorTool | GeneratorTool)[];
}
```

### Phase 2: Refactor ALL_TOOLS (lib/tools-data.ts)

**Current:**
```typescript
export const ALL_TOOLS = {
  formatters: ALL_FORMATTERS,
  minifiers: ALL_MINIFIERS,
  // ...
} as const;
```

**New:**
```typescript
export const ALL_TOOLS: Record<string, ToolCategory> = {
  formatters: {
    id: "formatters",
    label: "Formatters",
    url: "/formatters",
    description: "Beautify and format your code with consistent styling",
    order: 1,
    tools: ALL_FORMATTERS,
  },
  // ... (repeat for all categories)
} as const;

// Add helper functions
export function getAllTools(): Tool[] {
  return Object.values(ALL_TOOLS).flatMap(category => category.tools);
}

export function getCategoriesByOrder(): ToolCategory[] {
  return Object.values(ALL_TOOLS).sort((a, b) => a.order - b.order);
}

export function getTotalToolCount(): number {
  return getAllTools().filter(tool => !tool.comingSoon).length;
}
```

### Phase 3: Update CommandMenu.tsx (Auto-generate categories)

**Before (Manual categories):**
```tsx
{searchQuery && (
  <>
    <CommandGroup heading="Formatters">
      {SEARCH_INDEX.filter(item => item.category === "Formatters").map(...)}
    </CommandGroup>
    <CommandGroup heading="Minifiers">
      {SEARCH_INDEX.filter(item => item.category === "Minifiers").map(...)}
    </CommandGroup>
    {/* Must manually add each category! */}
  </>
)}
```

**After (Automatic from ALL_TOOLS):**
```tsx
{searchQuery && (
  <>
    {getCategoriesByOrder().map(category => (
      <CommandGroup key={category.id} heading={category.label}>
        {SEARCH_INDEX
          .filter(item => item.category === category.label)
          .map(tool => (
            <CommandItem
              key={tool.url}
              value={tool.searchText}
              onSelect={() => handleSelect(tool.url)}
            >
              {getToolIcon(tool) && <Icon className="mr-2 h-4 w-4" />}
              <span>{tool.name}</span>
            </CommandItem>
          ))}
      </CommandGroup>
    ))}
  </>
)}
```

### Phase 4: Update Home Page (app/page.tsx)

**Before (Manual sections):**
```tsx
{/* Formatters */}
<section className="mb-16">
  <Link href="/formatters">
    <h2 className="text-3xl font-bold mb-6">Formatters</h2>
  </Link>
  <p className="text-slate-600 dark:text-slate-400 mb-6">
    Beautify and format your code with consistent styling
  </p>
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {ALL_FORMATTERS.map((tool) => <ToolCard key={tool.id} {...tool} />)}
  </div>
</section>

{/* Must manually add each section! */}
```

**After (Automatic loop):**
```tsx
{getCategoriesByOrder().map(category => (
  <section key={category.id} className="mb-16">
    <Link href={category.url}>
      <h2 className="text-3xl font-bold mb-6 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer">
        {category.label}
      </h2>
    </Link>
    <p className="text-slate-600 dark:text-slate-400 mb-6">
      {category.description}
    </p>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {category.tools.map((tool) => (
        <ToolCard key={tool.id} {...tool} />
      ))}
    </div>
  </section>
))}
```

### Phase 5: Update Sitemap (app/sitemap.ts)

**Before (Hardcoded categories):**
```typescript
const categories: MetadataRoute.Sitemap = [
  {
    url: getAppUrl(`/formatters`),
    lastModified,
    changeFrequency: "weekly",
    priority: 0.7,
  },
  {
    url: getAppUrl(`/minifiers`),
    lastModified,
    changeFrequency: "weekly",
    priority: 0.7,
  },
  // Must manually add each category!
];

const tools: MetadataRoute.Sitemap = Object.values(ALL_TOOLS)
  .flat(2)  // This breaks with new structure!
  .map(...);
```

**After (Automatic from ALL_TOOLS):**
```typescript
const categories: MetadataRoute.Sitemap = Object.values(ALL_TOOLS).map(category => ({
  url: getAppUrl(category.url),
  lastModified,
  changeFrequency: "weekly",
  priority: 0.7,
}));

const tools: MetadataRoute.Sitemap = getAllTools()  // Use helper function
  .map(tool => ({
    url: getToolUrl(tool.url),
    lastModified,
    changeFrequency: "weekly",
    priority: 0.8,
  }));
```

### Phase 6: Update Navigation (components/layout/NavigationList.tsx)

**Before:** May have hardcoded category labels/links

**After:** Use `getCategoriesByOrder()` to generate nav items dynamically

### Phase 7: Update Metadata Script (scripts/verify-metadata.ts)

This script has **significant hardcoded logic** that can be eliminated with category-driven architecture.

#### 7.1: Dynamic Category Pages Array (Lines 418-424)

**Before (Hardcoded):**
```typescript
const pages = [
  { url: getAppUrl(), name: "Home" },
  { url: getAppUrl("/formatters"), name: "Formatters" },
  { url: getAppUrl("/minifiers"), name: "Minifiers" },
  { url: getAppUrl("/encoders"), name: "Encoders" },
  { url: getAppUrl("/validators"), name: "Validators" },
  { url: getAppUrl("/generators"), name: "Generators" },
];
```

**After (Auto-generated from ALL_TOOLS):**
```typescript
const pages = [
  { url: getAppUrl(), name: "Home" },
  ...Object.values(ALL_TOOLS).map(category => ({
    url: getAppUrl(category.url),
    name: category.label,
  })),
];
```

**Benefit:** Adding new category = zero changes to this file!

#### 7.2: Dynamic OG Image Validation (Lines 289-372)

**Before (Massive if-else chain):**
```typescript
// Home page validation
if (metadata.url === getAppUrl() || metadata.url === `${getAppUrl()}/`) {
  const totalCount = Object.values(ALL_TOOLS)
    .flat()
    .filter((tool) => !tool.comingSoon).length;
  if (!metadata.ogImage.includes(`title=${totalCount}+Free+Developer+Tools`)) {
    issues.push(`Home page OG image title should include total count...`);
  }
} else if (metadata.url.endsWith("/formatters")) {
  const count = ALL_TOOLS.formatters.filter((t) => !t.comingSoon).length;
  if (!metadata.ogImage.includes(`title=${count}+Formatters`)) {
    issues.push(`Formatters category OG image title should include formatter count...`);
  }
} else if (metadata.url.endsWith("/minifiers")) {
  const count = ALL_TOOLS.minifiers.filter((t) => !t.comingSoon).length;
  if (!metadata.ogImage.includes(`title=${count}+Minifiers`)) {
    issues.push(`Minifiers category OG image title should include minifier count...`);
  }
}
// ... repeated for every category (5+ times!)
```

**After (Dynamic lookup):**
```typescript
// Home page validation
if (metadata.url === getAppUrl() || metadata.url === `${getAppUrl()}/`) {
  const totalCount = getTotalToolCount();
  if (!metadata.ogImage.includes(`title=${totalCount}+Free+Developer+Tools`)) {
    issues.push(`Home page OG image title should include total count...`);
  }
} else {
  // Check if this is a category page
  const category = Object.values(ALL_TOOLS).find(cat =>
    metadata.url.endsWith(cat.url)
  );

  if (category) {
    const count = category.tools.filter(t => !t.comingSoon).length;
    const expectedTitle = `${count}+${category.label.replace(/ /g, '+')}`;

    if (!metadata.ogImage.includes(`title=${expectedTitle}`)) {
      issues.push(
        `${category.label} category OG image title should include ${category.label.toLowerCase()} count (expected "${count} ${category.label}")`,
      );
    }
  }
}
```

**Benefits:**
- Eliminates ~80 lines of duplicated if-else logic
- Adding new category = zero changes needed
- Uses category.label from single source of truth
- More maintainable and less error-prone

#### 7.3: Structured Data Validation (Lines 352-362)

**Before (Hardcoded paths):**
```typescript
if (
  metadata.url.includes("/formatters/") ||
  metadata.url.includes("/minifiers/") ||
  metadata.url.includes("/encoders/") ||
  metadata.url.includes("/validators/") ||
  metadata.url.includes("/generators/")
) {
  if (!metadata.structuredData) {
    issues.push("Missing JSON-LD structured data");
  }
}
```

**After (Dynamic from ALL_TOOLS):**
```typescript
// Check if this is a tool page (not home or category page)
const isToolPage = Object.values(ALL_TOOLS).some(category =>
  category.tools.some(tool => metadata.url === getToolUrl(tool))
);

if (isToolPage && !metadata.structuredData) {
  issues.push("Missing JSON-LD structured data");
}
```

**Benefit:** More semantic and doesn't require path hardcoding.

### Phase 8: Update AI Helpers (lib/ai/helpers.ts)

**Before:**
```typescript
export function getAllAvailableTools() {
  const formatters = ALL_FORMATTERS.map(...);
  const minifiers = ALL_MINIFIERS.map(...);
  // ... manual concatenation
  return [...formatters, ...minifiers, ...];
}
```

**After:**
```typescript
export function getAllAvailableTools() {
  return getAllTools().map(tool => ({
    displayName: tool.name,
    url: tool.url,
  }));
}
```

---

## Success Criteria

### Functional Requirements

✅ **No Breaking Changes**
- All existing URLs work (category pages, tool pages)
- All existing functionality preserved (search, navigation, sitemap)

✅ **Automatic Category Detection**
- CommandMenu shows all categories without manual updates
- Home page renders all category sections dynamically
- Sitemap includes all category pages automatically

✅ **Single Update Point**
- Adding new category = only updating `ALL_TOOLS` object in tools-data.ts
- No changes needed to CommandMenu, home page, sitemap, or navigation

### Non-Functional Requirements

✅ **Type Safety**
- ToolCategory interface enforces structure
- TypeScript catches missing fields at compile time

✅ **Performance**
- No performance degradation from new structure
- Helper functions memoized if needed

✅ **Maintainability**
- Code is easier to understand and modify
- Clear documentation of category metadata

---

## Testing Strategy

### Unit Tests (lib/tools-data.test.ts)

```typescript
describe('Category-Driven Architecture', () => {
  it('should have all required metadata for each category', () => {
    Object.values(ALL_TOOLS).forEach(category => {
      expect(category.id).toBeDefined();
      expect(category.label).toBeDefined();
      expect(category.url).toStartWith('/');
      expect(category.description).toBeDefined();
      expect(category.order).toBeGreaterThan(0);
      expect(category.tools).toBeInstanceOf(Array);
    });
  });

  it('should return all tools flattened', () => {
    const allTools = getAllTools();
    const expectedCount =
      ALL_FORMATTERS.length +
      ALL_MINIFIERS.length +
      ALL_ENCODERS.length +
      ALL_VALIDATORS.length +
      ALL_GENERATORS.length;

    expect(allTools).toHaveLength(expectedCount);
  });

  it('should return categories sorted by order', () => {
    const categories = getCategoriesByOrder();
    expect(categories[0].order).toBe(1);
    expect(categories[1].order).toBe(2);
    // etc...
  });

  it('should calculate correct tool count', () => {
    const count = getTotalToolCount();
    expect(count).toBeGreaterThan(0);
  });
});
```

### Integration Tests (E2E)

**Existing tests should pass without modification:**
- `tests/e2e/navigation.spec.ts` - Category navigation
- `tests/e2e/tools/*.spec.ts` - Tool pages
- `tests/e2e/mobile.spec.ts` - Mobile navigation

**New test:** Verify CommandMenu shows all categories dynamically

```typescript
test('CommandMenu shows all tool categories', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Meta+K');

  // Type to trigger category display
  await page.locator('[placeholder="Search tools..."]').fill('a');

  // Verify all categories appear
  const categories = Object.values(ALL_TOOLS);
  for (const category of categories) {
    await expect(page.getByRole('group', { name: category.label })).toBeVisible();
  }
});
```

### Manual Testing Checklist

- [ ] Home page renders all category sections with correct labels/descriptions
- [ ] CommandMenu search shows all categories (⌘K → type query)
- [ ] Navigation sidebar includes all category links
- [ ] Sitemap.xml includes all category pages
- [ ] Metadata script validates all categories
- [ ] No TypeScript errors
- [ ] No console errors or warnings
- [ ] All existing E2E tests pass

---

## Edge Cases & Risks

### Edge Case 1: Empty Categories
**Scenario:** What if a category has `comingSoon: true` for all tools?

**Solution:** Filter in UI components:
```typescript
{getCategoriesByOrder()
  .filter(category => category.tools.some(t => !t.comingSoon))
  .map(category => ...)}
```

### Edge Case 2: Backward Compatibility
**Risk:** Code expecting `ALL_TOOLS.formatters` to be `Tool[]` will break

**Mitigation:**
- Add deprecation helper:
  ```typescript
  // Temporary backward compat (remove in next major version)
  export const ALL_FORMATTERS_COMPAT = ALL_TOOLS.formatters.tools;
  ```
- Update all files atomically in one PR

### Edge Case 3: Order Conflicts
**Scenario:** Two categories have same `order` value

**Solution:** TypeScript enum or validation:
```typescript
export enum CategoryOrder {
  FORMATTERS = 1,
  MINIFIERS = 2,
  ENCODERS = 3,
  VALIDATORS = 4,
  GENERATORS = 5,
}

// Use in ALL_TOOLS definition
order: CategoryOrder.FORMATTERS,
```

### Risk 1: Scope Creep
**Risk:** Temptation to add too many fields (icon, color, analytics, etc.)

**Mitigation:** Start minimal (id, label, url, description, order, tools). Add fields in future PRs when needed.

### Risk 2: Performance Impact
**Risk:** Sorting categories or flattening tools on every render

**Mitigation:**
- Memoize helper functions with `useMemo` in React components
- Pre-compute at module level if needed:
  ```typescript
  const CATEGORIES_BY_ORDER = Object.values(ALL_TOOLS)
    .sort((a, b) => a.order - b.order);
  ```

---

## Future Enhancements

### Phase 2: Rich Category Metadata

```typescript
interface ToolCategory {
  // ... existing fields
  icon?: LucideIcon;           // Category icon for nav
  color?: string;              // Brand color (#3b82f6)
  comingSoon?: boolean;        // Show "Coming Soon" badge
  featured?: boolean;          // Highlight on home page
  analyticsId?: string;        // Google Analytics category
  seoKeywords?: string[];      // Additional SEO terms
}
```

### Phase 3: Category Pages Driven by Data

Currently category pages (`/formatters/page.tsx`) have hardcoded content. Future:

```typescript
// app/[category]/page.tsx - Dynamic category page
export default function CategoryPage({ params }) {
  const category = getCategoryById(params.category);
  if (!category) notFound();

  return (
    <div>
      <h1>{category.label}</h1>
      <p>{category.description}</p>
      <div className="grid">
        {category.tools.map(tool => <ToolCard {...tool} />)}
      </div>
    </div>
  );
}
```

### Phase 4: Admin/Dev Tools

- Category analytics dashboard
- Automatic changelog generation when categories added
- Category-level feature flags

---

## Implementation Checklist

### Pre-Implementation
- [ ] Create feature branch: `git checkout -b category-driven-architecture`
- [ ] Review current ALL_TOOLS usage (grep search completed ✅)
- [ ] Identify all files that need updates (8 files identified ✅)

### Phase 1: Core Refactor
- [ ] Add `ToolCategory` interface to `lib/types.ts`
- [ ] Refactor `ALL_TOOLS` in `lib/tools-data.ts`
- [ ] Add helper functions (getAllTools, getCategoriesByOrder, etc.)
- [ ] Verify TypeScript compiles (`pnpm type-check`)

### Phase 2: Component Updates
- [ ] Update `components/CommandMenu.tsx` (dynamic categories)
- [ ] Update `app/page.tsx` (dynamic home sections)
- [ ] Update `app/sitemap.ts` (dynamic category pages)
- [ ] Update `components/layout/NavigationList.tsx` (if needed)
- [ ] Update `lib/ai/helpers.ts` (getAllAvailableTools)
- [ ] Update `scripts/verify-metadata.ts` (access .tools property)

### Phase 3: Testing
- [ ] Run all quality checks (`pnpm format && pnpm lint && pnpm type-check`)
- [ ] Write unit tests for helper functions
- [ ] Run existing E2E tests (`pnpm test:e2e`)
- [ ] Add new CommandMenu category test
- [ ] Manual testing checklist (above)

### Phase 4: Documentation
- [ ] Update `.github/copilot-instructions.md` with new patterns
- [ ] Update `README.md` if needed
- [ ] Add JSDoc comments to new interfaces/functions

### Phase 5: Deployment
- [ ] Commit changes with detailed message
- [ ] Push to GitHub and open PR
- [ ] Review PR for any missed files
- [ ] Merge after CI passes
- [ ] Verify on preview deployment
- [ ] Monitor production for issues

---

## Estimated Timeline

| Phase | Duration | Cumulative |
|-------|----------|------------|
| Pre-implementation (review) | 30 min | 30 min |
| Core refactor (types + tools-data) | 45 min | 1h 15min |
| Component updates (6 files) | 90 min | 2h 45min |
| Testing (unit + E2E + manual) | 60 min | 3h 45min |
| Documentation | 15 min | 4h |
| **Total** | **~4 hours** | |

**Note:** This assumes no major issues discovered during testing. Add 1-2 hours buffer for edge cases.

---

## References

### Related Files
- `lib/tools-data.ts` - Main registry to refactor
- `lib/types.ts` - Type definitions
- `components/CommandMenu.tsx` - Search/nav component
- `app/page.tsx` - Home page with category sections
- `app/sitemap.ts` - Sitemap generation
- `lib/ai/helpers.ts` - AI content helpers

### Related Specs
- `specs/phase-9-validators.md` - Similar refactor pattern
- `.github/copilot-instructions.md` - Project conventions

### GitHub Issues
- (Create issue when ready to implement)

---

**Next Steps:** Complete gitignore tool implementation, then create feature branch and begin migration following this spec.
