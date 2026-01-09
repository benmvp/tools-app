# Codemata

**Free online developer tools for code transformation**

Codemata is a Next.js web application providing high-quality code formatters and minifiers with AI-enhanced educational content. Part of the [Tools App monorepo](../../README.md), it focuses on developer productivity tools that are fast, accurate, and SEO-optimized.

🌐 **Live Site:** [codemata.benmvp.com](https://codemata.benmvp.com)

---

## What is Codemata?

Codemata offers **14 free developer tools** (as of Phase 5.3):

### Formatters (8 tools)
- CSS/SCSS Formatter
- GraphQL Formatter
- HTML Formatter
- JavaScript/TypeScript Formatter
- JSON Formatter
- Markdown/MDX Formatter
- XML Formatter
- YAML Formatter

### Minifiers (6 tools)
- CSS/SCSS Minifier
- HTML Minifier
- JavaScript/TypeScript Minifier
- JSON Minifier
- SVG Minifier
- XML Minifier

### Goals

1. **Utility-First** - Provide accurate, fast, and reliable code transformation tools
2. **Traffic & SEO** - Build popular tools that attract consistent organic traffic
3. **Developer Experience** - Server-side transformations, dual-editor UI, instant feedback
4. **AI-Enhanced Content** - Generate high-quality educational content with proper SEO metadata
5. **Modern Architecture** - Showcase Next.js 15 best practices with Server Actions and ISR

---

## Architecture Overview

### Monorepo Structure

Codemata is part of a **pnpm monorepo** managed by Turborepo:

```
tools-app/
├── apps/
│   ├── codemata/          # This app (port 3001)
│   ├── moni/              # Financial tools (port 3002, planned)
│   └── convertly/         # Unit converters (port 3003, planned)
└── packages/              # Shared packages (future)
```

**Why monorepo?**
- Code reuse across multiple tool apps
- Consistent development patterns
- Centralized dependency management
- Independent deployment per app

### Key Design Decisions

**1. Server-Side Transformations**

All code transformations run server-side via Next.js Server Actions (`"use server"`):
- ✅ **Security** - No arbitrary code execution in browser
- ✅ **Bundle size** - Heavy libraries stay server-side
- ✅ **Consistency** - Same transformation logic for all users

**2. AI Content System**

Powered by **Gemini 2.0 Flash** with environment-aware behavior:
- **Production builds** (`VERCEL_ENV=production`) - Pre-render ALL pages during build for optimal SEO
- **Preview builds** (`VERCEL_ENV=preview`) - On-demand generation with 24-hour ISR caching
- **Local dev** (`next dev`) - AI generation **DISABLED** by default (tools work perfectly without it)

**3. Centralized Tool Registry**

All tool metadata lives in `lib/tools-data.ts`:
- Record-based structure for O(1) lookups by slug
- Inlined example code (no separate files)
- Single source of truth for navigation, sitemaps, and OG images

---

## Technologies Used

### Core Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 15.x | App Router, Server Actions, ISR |
| **React** | 19.x | UI framework |
| **TypeScript** | 5.x | Type safety |
| **Tailwind CSS** | 4.x | Styling |
| **pnpm** | Latest | Package management |
| **Turborepo** | Latest | Monorepo build orchestration |

### Code Transformation

| Library | Purpose |
|---------|---------|
| **Prettier** | Format CSS, GraphQL, HTML, JS/TS, JSON, Markdown, XML, YAML |
| **Terser** | Minify JavaScript/TypeScript |
| **clean-css** | Minify CSS/SCSS |
| **html-minifier-terser** | Minify HTML |
| **minify-xml** | Minify XML |
| **svgo** | Minify SVG |

### UI Components

| Library | Purpose |
|---------|---------|
| **CodeMirror 6** | Syntax-highlighted code editor |
| **Radix UI** | Accessible component primitives |
| **Lucide React** | Icon system |
| **Sonner** | Toast notifications |

### AI & Content

| Library | Purpose |
|---------|---------|
| **Google Generative AI SDK** | Gemini API client |
| **Zod** | Schema validation for AI responses |
| **@vercel/og** | Dynamic OpenGraph image generation |

### Development Tools

| Tool | Purpose |
|------|---------|
| **Biome** | Linting and formatting |
| **Vitest** | Unit testing (46 tests) |
| **TypeScript** | Type checking |

---

## Local Development

### Prerequisites

- **Node.js** (latest LTS recommended)
- **pnpm** (install via `npm install -g pnpm`)

### Setup

```bash
# From monorepo root
pnpm install

# Run Codemata only (port 3001)
cd apps/codemata
pnpm dev

# Or run all apps from root (Turborepo parallel mode)
pnpm dev
```

The app will be available at **http://localhost:3001**

### Environment Variables

Create `apps/codemata/.env.local` (never commit this file):

```bash
# Optional: Enable AI content generation locally
GOOGLE_API_KEY=your_gemini_api_key_here
VERCEL_ENV=preview  # Enables AI in dev mode
```

**Without AI setup:**
- Tools work perfectly (transformations are independent of AI)
- AI content sections simply won't render
- Ideal for development focused on tool functionality

### Development Commands

```bash
# Start dev server (port 3001)
pnpm dev

# Run tests in watch mode
pnpm test:watch

# Run all tests once
pnpm test

# Type check
pnpm type-check

# Lint code
pnpm lint

# Format code
pnpm format

# Verify metadata & OG images (17 pages)
pnpm verify-metadata
```

### Project Structure

```
apps/codemata/
├── app/
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Home page
│   ├── formatters/
│   │   ├── actions.ts          # Server Actions for formatters
│   │   ├── page.tsx            # Category landing page
│   │   └── [slug]/page.tsx     # Dynamic tool pages
│   ├── minifiers/
│   │   └── ...                 # Same structure as formatters
│   └── api/
│       └── og/route.tsx        # OpenGraph image generation
├── components/
│   ├── Transformer.tsx         # Dual-editor UI for formatters
│   ├── TransformerMinifier.tsx # Dual-editor UI for minifiers
│   ├── FormatterAIContent.tsx  # AI content sections
│   ├── ToolCard.tsx            # Tool navigation cards
│   └── layout/                 # Header, Footer, Sidebar, etc.
├── lib/
│   ├── tools-data.ts           # ⭐ Unified tool registry
│   ├── types.ts                # Shared TypeScript types
│   ├── site-config.ts          # Site metadata
│   ├── utils.ts                # Utilities (including OG image helpers)
│   └── ai/
│       ├── generate.ts         # AI generation logic
│       ├── prompts.ts          # System prompts
│       ├── schema.ts           # Zod schemas
│       └── helpers.ts          # AI content retrieval
├── __tests__/
│   ├── formatters.test.ts      # Formatter tests (24 tests)
│   └── minifiers.test.ts       # Minifier tests (22 tests)
└── scripts/
    └── verify-metadata.ts      # Pre-commit metadata validation
```

---

## Code Quality Checks

### Run All Checks Before Committing

```bash
cd apps/codemata

# 1. Format code
pnpm format

# 2. Lint code
pnpm lint

# 3. Type check
pnpm type-check

# 4. Run tests (46 tests)
pnpm test

# 5. Verify metadata & OG images (17 pages)
pnpm verify-metadata
```

All checks must pass before committing to maintain code quality.

### What Each Check Does

**`pnpm format`**
- Auto-fixes formatting issues with Biome
- Ensures consistent code style

**`pnpm lint`**
- Checks for code quality issues
- Enforces best practices

**`pnpm type-check`**
- Verifies TypeScript compilation
- Catches type errors before runtime

**`pnpm test`**
- Runs 46 unit tests (Vitest)
- Tests all Server Actions directly
- Validates transformation logic

**`pnpm verify-metadata`**
- Validates metadata for all 17 pages
- Checks OG image URLs are correct
- Ensures no missing titles/descriptions
- Verifies dynamic cache busting works

---

## Continuous Integration

### GitHub Actions (Planned)

Currently, CI/CD is handled manually via Vercel's Git integration. Future GitHub Actions workflow will include:

```yaml
# Planned workflow
- Type checking (tsc --noEmit)
- Linting (biome check)
- Unit tests (vitest run)
- Metadata validation
- Build verification
```

### Current Process

1. Push to any branch → Vercel creates preview deployment
2. Push to `main` → Vercel deploys to production
3. Manual quality checks before merging PRs

---

## Deployment

### Vercel Deployment

**Production:** [codemata.benmvp.com](https://codemata.benmvp.com)

**How it works:**
1. Push to `main` branch triggers automatic Vercel deployment
2. Vercel sets `VERCEL_ENV=production`
3. Build process pre-renders all pages with AI content
4. Pages are served statically with 24-hour ISR revalidation

**Preview Deployments:**
- Every Git push creates a unique preview URL
- AI content generated on-demand (first request)
- Cached for 24 hours after first visit
- Ideal for testing before production

### Environment Variables (Vercel Dashboard)

Required in production:

```bash
GOOGLE_API_KEY=xxx                    # Gemini API key
GEMINI_MODEL=gemini-2.0-flash-exp     # Optional, defaults to this
```

### ISR Revalidation

Pages automatically revalidate every 24 hours:

```typescript
// app/formatters/[slug]/page.tsx
export const revalidate = 86400; // 24 hours in seconds
```

### Manual Revalidation (Planned)

Future API endpoint for on-demand cache busting:

```bash
POST /api/revalidate?secret=TOKEN&slug=tool-slug
```

### Cache Busting for OG Images

**When adding/removing tools:** Automatic (count changes in URL)

**When changing OG image design:**

```typescript
// lib/utils.ts
export const OG_IMAGE_VERSION = "2"; // Increment this number
```

See [docs/OG_IMAGE_CACHE_BUSTING.md](docs/OG_IMAGE_CACHE_BUSTING.md) for details.

---

## Adding a New Tool

1. **Create Server Action** in `app/formatters/actions.ts`:
   ```typescript
   export async function formatMyTool(input: string, config: FormatConfig) {
     return await format(input, { parser: "mytool", ...config });
   }
   ```

2. **Add tool to registry** in `lib/tools-data.ts`:
   ```typescript
   export const FORMATTER_TOOLS: Record<string, Tool> = {
     "my-tool-formatter": {
       id: "my-tool",
       name: "My Tool Formatter",
       url: "/formatters/my-tool-formatter",
       action: formatMyTool,
       language: "typescript",
       example: `const x = 1`,
       // ... metadata
     },
   };
   ```

3. **Write tests** in `__tests__/formatters.test.ts`

That's it! The tool automatically appears in navigation, category pages, and sitemaps.

---

## Testing

### Run Tests

```bash
# Run all tests once
pnpm test

# Watch mode during development
pnpm test:watch

# Run specific test file
pnpm test formatters.test.ts
```

### Test Pattern

Tests verify Server Actions directly (no UI testing):

```typescript
import { formatTypescript } from "../app/formatters/actions";

it("formats with 2-space indentation", async () => {
  const input = 'const x={a:1};';
  const result = await formatTypescript(input, { indentation: "two-spaces" });
  expect(result).toContain("const x");
});
```

**Current Coverage:** 46 tests
- 24 formatter tests
- 22 minifier tests

---

## Contributing

This is a personal project, but suggestions are welcome! Key principles:

- **YAGNI** - Extract shared packages only when duplication is painful
- **Server-side transformations** - Never run arbitrary code client-side
- **Graceful degradation** - Tools must work without AI content
- **Record-based data** - Use Record for O(1) lookups, arrays for iteration
- **Centralized data** - Single source of truth in `tools-data.ts`

---

## Resources

- **Monorepo Spec:** [../../SPEC.md](../../SPEC.md)
- **Roadmap:** [../../TODO.md](../../TODO.md)
- **OG Image Cache:** [docs/OG_IMAGE_CACHE_BUSTING.md](docs/OG_IMAGE_CACHE_BUSTING.md)
- **Next.js Docs:** https://nextjs.org/docs
- **Gemini API:** https://ai.google.dev/

---

## License

© 2025 Ben Ilegbodu. All rights reserved.
