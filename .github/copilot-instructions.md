# Copilot Instructions for Tools App

## Project Overview

Tools App is a **pnpm monorepo** (Turborepo) with three independent Next.js 15 apps:
- **Codemata** (`apps/codemata/`, port 3001) - Code formatters & minifiers ✅ **ACTIVE**
- **Moni** (`apps/moni/`, port 3002) - Financial calculators 🚧 **PLANNED**
- **Convertly** (`apps/convertly/`, port 3003) - Unit converters 🚧 **PLANNED**

**Current Status:** Phase 4 complete - Codemata has 14 tools (8 formatters + 6 minifiers) with full AI content generation.

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

### Linting & Formatting
```bash
pnpm lint                 # Biome check
pnpm format               # Biome format --write
```

### AI Content Testing
```bash
VERCEL_ENV=preview NEXT_PUBLIC_VERCEL_ENV=preview pnpm dev  # Enable AI locally
DISABLE_AI=true pnpm build  # Build without AI content
```

## Key Files & Directories

**Tool Configuration:**
- `lib/tools-data.ts` - Tool metadata (name, URL, icon, description)
- `lib/examples.ts` - Default code examples for each tool
- `lib/types.ts` - Shared TypeScript types

**AI System:**
- `lib/ai/generate.ts` - Main AI generation logic with retry + caching
- `lib/ai/prompts.ts` - System prompts for formatters/minifiers
- `lib/ai/schema.ts` - Zod schemas for AI response validation
- `lib/ai/cache.ts` - In-memory request cache (prevents duplicate API calls)
- `lib/ai/helpers.ts` - Helper functions for retrieving AI content per tool category

**Components:**
- `components/Transformer.tsx` - Dual CodeMirror editor with config options
- `components/FormatterAIContent.tsx` - Renders AI content sections + tips
- `components/TipCard.tsx` - Contextual tip cards (tip/fact/bestPractice)
- `components/RecommendedTools.tsx` - AI-generated tool recommendations

## Important Conventions

### Adding a New Tool

1. **Add tool metadata** to `lib/tools-data.ts`:
```typescript
export const FORMATTER_TOOLS: ToolWithIcon[] = [
  {
    id: "my-tool",
    name: "My Tool",
    description: "Format X code",
    url: "/formatters/my-tool-formatter",
    icon: FileCode,
    comingSoon: false,
  }
];
```

2. **Create Server Action** in `app/formatters/actions.ts`:
```typescript
export async function formatMyTool(input: string, config: FormatConfig): Promise<string> {
  // Use appropriate library (Prettier, Terser, etc.)
}
```

3. **Add tool config** to `FORMATTERS` object in `app/formatters/[slug]/page.tsx`
4. **Add example** to `lib/examples.ts`
5. **Write tests** in `__tests__/formatters.test.ts`

### Environment Variables
- `GOOGLE_API_KEY` - **Required** for AI generation (Gemini API)
- `GEMINI_MODEL` - Optional (defaults to `gemini-2.0-flash-exp`)
- `VERCEL_ENV` - Auto-set by Vercel (production/preview/development)
- `DISABLE_AI` - Force disable AI generation (useful for local builds)

Never commit `.env.local` - use Vercel dashboard for production secrets.

### AI Content Structure
AI generates 8 sections per tool (see `lib/ai/schema.ts`):
1. **Intro** - 1-2 sentence overview (plain text)
2. **SEO metadata** - title, description, keywords
3. **OpenGraph** - social media metadata
4. **How to Use** - Step-by-step instructions
5. **Features** - Bulleted benefits
6. **Rationale** - Why use this tool
7. **Purpose** - What is this language/format
8. **Integration** - Workflow tips (editor plugins, CI/CD)
9. **FAQ** - Common questions
10. **Recommendations** - Related tool suggestions (AI-powered, max 3)
11. **Resources** - External links

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
- **Implementation Plan** - See SPEC.md Phase 1-5 for step-by-step progress

## Quick Tips

- Use `<Suspense>` for AI content with `<AIContentSkeleton />` fallback
- All transformations are async Server Actions (never run client-side)
- Test graceful degradation by running without `GOOGLE_API_KEY`
- AI content sections hidden automatically if generation fails
- Use `shouldGenerateAI()` to check if AI is enabled before making API calls
