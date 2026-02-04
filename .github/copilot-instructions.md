# Copilot Instructions for Tools App

## Project Overview

Tools App is a **pnpm monorepo** (Turborepo) with three independent Next.js 15 apps:
- **Codemata** (`apps/codemata/`, port 3001) - Code formatters & minifiers ✅ **ACTIVE**
- **Moni** (`apps/moni/`, port 3002) - Financial calculators 🚧 **PLANNED**
- **Convertly** (`apps/convertly/`, port 3003) - Unit converters 🚧 **PLANNED**

**Current Status:** Phase 10.1 complete - Codemata has 20 tools (8 formatters + 6 minifiers + 5 validators + 1 generator) with full AI content generation and dynamic OpenGraph images for social media.

## Architecture Principles

### 1. Server Actions for All Transformations
All code transformations (formatters/minifiers) run **server-side** via Next.js Server Actions (`"use server"`). Never implement transformations in client components.

**Pattern:**
```typescript
// app/formatters/actions.ts
"use server";
export async function formatTypescript(input: string, config: FormatConfig): Promise<string> {
  const formatted = await format(input, { parser: "typescript", ...config });
  return formatted;
}
```

**Why:** Security (no arbitrary code execution), smaller bundles, consistency.

### 2. AI Content System - Hybrid Rendering Strategy

AI content is generated using **Gemini 2.0 Flash** with environment-aware behavior:

**Production builds** (`VERCEL_ENV=production`):
- Pre-render ALL pages with AI content during build (optimal SEO)
- Link prefetching enabled for instant navigation

**Preview builds** (`VERCEL_ENV=preview`):
- On-demand generation (first request per page generates AI content)
- ISR caching for 24 hours after first visit
- Link prefetching disabled (saves API costs)

**Local dev** (`next dev`):
- AI generation **DISABLED** by default (no VERCEL_ENV set)
- Tool functionality works perfectly without AI content
- Set `VERCEL_ENV=preview` to test AI locally

**Key utilities:**
- `shouldGenerateAI()` - Returns false in dev mode, true otherwise (unless `DISABLE_AI=true`)
- `isProductionBuild()` - Check if pre-rendering should happen
- ISR revalidation: 24 hours (`export const revalidate = 86400`)

### 3. Tool Architecture Pattern

Every tool follows this structure:

```
app/{category}/
  ├── actions.ts           # Server Actions for transformations
  ├── [slug]/
  │   └── page.tsx         # Dynamic route per tool
  └── page.tsx             # Category landing page (e.g., /formatters)
```

**Tool page pattern:**
```typescript
// [slug]/page.tsx
export const revalidate = 86400; // 24-hour ISR

const TOOLS: Record<string, ToolConfig> = {
  "tool-slug": {
    name: "Tool Name",
    action: actionFromServerActions,
    example: EXAMPLE_CODE,
    language: "typescript",
    metadata: { title, description }
  }
};

export default async function Page({ params }) {
  const tool = TOOLS[params.slug];
  const aiContent = await generateToolContent(...); // Returns undefined if AI disabled/fails

  return (
    <>
      <Transformer action={tool.action} defaultInput={tool.example} />
      {aiContent && (
        <Suspense fallback={<AIContentSkeleton />}>
          <FormatterAIContent content={aiContent} />
        </Suspense>
      )}
    </>
  );
}
```

### 4. Graceful Degradation
Tools **MUST** work without AI content. Always check if `aiContent` is defined before rendering content sections.

### 5. Dynamic OpenGraph Images
Social media preview images are generated dynamically using **@vercel/og** at Edge Runtime:

**API Endpoint:** `/api/og`
- Simple title + description parameters
- 1200×630px PNG format
- Branded design (gradient background, logo, decorative elements)

**Cache Strategy:**
- **Dynamic pages** (home, categories): Count-based cache keys → auto-bust when tools added
- **Tool pages**: Version-based cache keys → manual bust via `OG_IMAGE_VERSION` constant
- **Headers:** `max-age=31536000, stale-while-revalidate=86400`

**Example usage:**
```typescript
import { getOgImageUrl } from "@/lib/utils";

// Home page - uses total count as cache key
const ogImageUrl = getOgImageUrl(
  "14 Free Developer Tools",
  SITE_CONFIG.pages.home.description,
  totalCount.toString()
);

// Tool page - uses OG_IMAGE_VERSION constant
const ogImageUrl = getOgImageUrl(
  "JSON Formatter",
  "Format and beautify JSON data..."
);
```

**Cache Busting:**
- Adding/removing tools: Automatic (count changes in URL)
- Design changes: Increment `OG_IMAGE_VERSION` in `lib/utils.ts`

## Development Workflow

### Running Locally
```bash
pnpm install              # Install dependencies
pnpm dev                  # All apps (Turborepo parallel)
cd apps/codemata && pnpm dev  # Single app (port 3001)
```

### Testing
```bash
pnpm test                 # Run all tests (Vitest)
cd apps/codemata && pnpm test:watch  # Watch mode
pnpm test:e2e             # E2E tests (Playwright)
pnpm lighthouse           # Lighthouse CI
```

**Test pattern** - Test Server Actions directly:
```typescript
// __tests__/formatters.test.ts
import { formatTypescript } from "../app/formatters/actions";

it("formats with 2-space indentation", async () => {
  const input = 'const x={a:1};';
  const result = await formatTypescript(input, { indentation: "two-spaces" });
  expect(result).toContain("const x");
});
```

**Test Stack:**
- Unit tests: Vitest (Server Actions & utilities)
- E2E tests: Playwright (desktop + mobile)
- Accessibility: @axe-core/playwright (WCAG 2.0/2.1 Level AA)
- Performance: Lighthouse CI

**E2E Test Strategy:**
This project uses a **sample-based testing approach** to prevent linear test growth. When adding a new tool:
- ✅ Add unit tests for the server action (always required)
- ✅ Add tool to `FORMATTER_TOOLS/MINIFIER_TOOLS/ENCODER_TOOLS` in `lib/tools-data.ts`
- ❌ **DO NOT** add new e2e tests unless the tool introduces new component behavior
- **Result:** 0-2 new e2e tests per tool (instead of 8-10)

**See [TESTING.md](../apps/codemata/TESTING.md) for comprehensive testing documentation.**

### Linting & Formatting
```bash
pnpm lint                 # Biome check
pnpm format               # Biome format --write
```

### Code Quality Checks (Run After Large Changes)
After making significant changes (refactoring, adding features, data consolidation), always run all checks:

```bash
cd apps/codemata
pnpm format              # Auto-fix formatting issues
pnpm lint                # Check for code quality issues
pnpm type-check          # Verify TypeScript compilation
pnpm test                # Run unit tests
pnpm verify-metadata     # Validate metadata & OG images
```

All checks must pass before committing. This ensures no regressions and maintains code quality.

### AI Content Testing
```bash
VERCEL_ENV=preview NEXT_PUBLIC_VERCEL_ENV=preview pnpm dev  # Enable AI locally
DISABLE_AI=true pnpm build  # Build without AI content
```

## Key Files & Directories

**Tool Configuration:**
- `lib/tools-data.ts` - **Category-driven tool registry** with rich metadata
  - `ALL_TOOLS: Record<ToolCategoryId, ToolCategory>` - Category metadata with nested tools
  - `getCategoriesByOrder()` - Get categories sorted by display order
  - `getAllTools()` - Flatten all tools across categories
  - `getTotalToolCount()` - Count tools (excluding comingSoon)
  - `getCategoryById(id)` - Type-safe category lookup
  - Individual tool Records: `FORMATTER_TOOLS`, `MINIFIER_TOOLS`, etc.
- `lib/types.ts` - Shared TypeScript types (ToolCategoryId, ToolCategory, Tool, actions)
- `lib/site-config.ts` - Centralized site metadata (titles, descriptions, keywords)
- `lib/search-index.ts` - Auto-generated search index from ALL_TOOLS

**AI System:**
- `lib/ai/generate.ts` - Main AI generation logic with retry + caching
- `lib/ai/prompts.ts` - System prompts for formatters/minifiers
- `lib/ai/schema.ts` - Zod schemas for AI response validation
- `lib/ai/cache.ts` - In-memory request cache (prevents duplicate API calls)
- `lib/ai/helpers.ts` - Helper functions for retrieving AI content per tool category

**Components:**
- `components/ToolCard.tsx` - Reusable tool card for navigation

**API Routes:**
- `app/api/og/route.tsx` - Dynamic OpenGraph image generation (Edge Runtime)
- `components/Transformer.tsx` - Dual CodeMirror editor with config options
- `components/FormatterAIContent.tsx` - Renders AI content sections + tips
- `components/TipCard.tsx` - Contextual tip cards (tip/fact/bestPractice)
- `components/RecommendedTools.tsx` - AI-generated tool recommendations

## Adding a New Tool (Category-Driven Architecture)

1. **Create Server Action** in `app/{category}/actions.ts`:
```typescript
export async function formatMyTool(input: string, config: FormatConfig): Promise<string> {
  // Use appropriate library (Prettier, Terser, etc.)
}
```

2. **Add tool to category Record** in `lib/tools-data.ts`:
```typescript
export const FORMATTER_TOOLS: Record<string, FormatterTool> = {
  "my-tool-formatter": {  // Key is the URL slug
    id: "my-tool",
    name: "My Tool Formatter",
    description: "Format X code with proper indentation",
    url: "/formatters/my-tool-formatter",
    icon: FileCode,
    comingSoon: false,
    action: formatMyTool,  // Link to Server Action
    language: "typescript",
    example: `const x={a:1}`,  // Inline example code
    metadata: {
      title: "My Tool Formatter | Codemata",
      description: "Format and beautify X code. Free online formatter.",
    },
  },
};
```

3. **Write tests** in `__tests__/formatters.test.ts`:
```typescript
import { formatMyTool } from "../app/formatters/actions";

it("formats my tool code", async () => {
  const input = 'const x={a:1}';
  const result = await formatMyTool(input, { indentation: "two-spaces" });
  expect(result).toContain("const x");
});
```

**That's it!** The tool automatically appears in:
- Home page sections (via `getCategoriesByOrder()`)
- Navigation sidebar (via `getCategoriesByOrder()`)
- Command menu search (via auto-generated SEARCH_INDEX)
- Category pages (via `ALL_TOOLS.formatters.tools`)
- Sitemap (via `getAllTools()`)
- Metadata validation (via `getAllTools()`)
- Dynamic OG images (count-based cache busting)

**No need to update:** CommandMenu, page.tsx, sitemap.ts, NavigationList, or verify-metadata.ts!

## Adding a New Tool Category

1. **Add ToolCategoryId** to `lib/types.ts`:
```typescript
export type ToolCategoryId = "formatters" | "minifiers" | "encoders" | "validators" | "generators" | "your-category";
```

2. **Create tool Record and helper array** in `lib/tools-data.ts`:
```typescript
export const YOUR_CATEGORY_TOOLS: Record<string, YourToolType> = {
  "tool-slug": {
    id: "tool-id",
    name: "Tool Name",
    // ... tool properties
  },
};

const ALL_YOUR_CATEGORY = Object.values(YOUR_CATEGORY_TOOLS);
```

3. **Add category to ALL_TOOLS** in `lib/tools-data.ts`:
```typescript
export const ALL_TOOLS: Record<ToolCategoryId, ToolCategory> = {
  // ... existing categories
  "your-category": {
    id: "your-category",
    label: "Your Category",
    singular: "Your Tool",
    url: "/your-category",
    description: "Description for SEO and category page",
    order: 6,  // Next available order number
    tools: ALL_YOUR_CATEGORY,
  },
};
```

**That's it!** The category automatically appears in:
- Home page sections (dynamic from `getCategoriesByOrder()`)
- Command menu search groups (dynamic from `getCategoriesByOrder()`)
- Navigation sidebar (dynamic from `getCategoriesByOrder()`)
- Sitemap category pages (dynamic from `ALL_TOOLS`)
- Metadata validation (automatic from `ALL_TOOLS`)

**No manual updates needed for:** CommandMenu, page.tsx, sitemap.ts, NavigationList, or verify-metadata.ts!

### Environment Variables
- `GOOGLE_API_KEY` - **Required** for AI generation (Gemini API)
- `GEMINI_MODEL` - Optional (defaults to `gemini-2.0-flash-exp`)
- `VERCEL_ENV` - Auto-set by Vercel (production/preview/development)
- `DISABLE_AI` - Force disable AI generation (useful for local builds)

Never commit `.env.local` - use Vercel dashboard for production secrets.

### AI Content Structure
AI generates 8 sections per tool (see `lib/ai/schema.ts`):
1. **Intro** - 1-2 sentence overview (plain text)
2. **SEO metadata** - title, de)
# POST /api/revalidate?secret=TOKEN&slug=tool-slug
```

### Bust OG Image Cache After Design Changes
```typescript
// lib/utils.ts
export const OG_IMAGE_VERSION = "2";  // Increment this number
```

Then redeploy. See `docs/OG_IMAGE_CACHE_BUSTING.md` for details.

### Run All Repository Checks
```bash
cd apps/codemata
pnpm type-check      # TypeScript compilation
pnpm lint            # Biome linting
pnpm format          # Auto-fix formatting
pnpm test            # Unit tests
pnpm verify-metadata # Validate OG images & metadata
pnpm test:e2e        # E2E tests (requires production build)
pnpm lighthouse      # Performance benchmarks
```

Plus **3-5 contextual tips** (displayed as floating cards between sections).

### YAGNI Approach
This project follows **"You Aren't Gonna Need It"** - extract shared packages **only when duplication becomes painful**. Currently, everything lives in `apps/codemata/` until other apps need it.

## Common Tasks

### Regenerate AI Content Manually
```bash
# Via ISR revalidation (planned in Phase 5)
# POST /api/revalidate?secret=TOKEN&slug=tool-slug
```

### Deploy
- Push to `main` → Auto-deploy to Vercel production
- Preview deployments for all PRs
- Production env vars in Vercel dashboard

## References

- **SPEC.md** - Complete project specification & architecture decisions
- **TODO.md** - Roadmap for future tools & features
- **apps/codemata/README.md** - Complete developer guide (setup, architecture, deployment)
- **apps/codemata/TESTING.md** - Comprehensive testing documentation (E2E, accessibility, CI/CD)
- **Implementation Plan** - See SPEC.md Phase 1-7 for step-by-step progress

## Quick Tips

- Use `<Suspense>` for AI content with `<AIContentSkeleton />` fallback
- All transformations are async Server Actions (never run client-side)
- Test graceful degradation by running without `GOOGLE_API_KEY`
- AI content sections hidden automatically if generation fails
- Use `shouldGenerateAI()` to check if AI is enabled before making API calls
