# Codemata

**Free online developer tools for code transformation**

Codemata is a Next.js web application providing high-quality code formatters and minifiers with AI-enhanced educational content. Part of the [Tools App monorepo](../../README.md), it focuses on developer productivity tools that are fast, accurate, and SEO-optimized.

🌐 **Live Site:** [codemata.benmvp.com](https://codemata.benmvp.com)

---

## What is Codemata?

Codemata offers **21 free developer tools** (as of Phase 10.2):

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

### Validators (5 tools)
- CSS Validator
- HTML Validator
- JSON Validator
- URL Validator
- XML Validator

### Generators (1 tool)
- .gitignore Generator

### Viewers (1 tool)
- Markdown Previewer (GitHub Flavored Markdown with syntax highlighting)

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
| **Vitest** | Unit testing |
| **Playwright** | E2E testing (desktop + mobile) |
| **@axe-core/playwright** | Accessibility testing (WCAG 2.0/2.1 AA) |
| **Lighthouse CI** | Performance & quality benchmarking |
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

# Verify metadata & OG images
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
│   ├── formatters.test.ts      # Formatter tests
│   └── minifiers.test.ts       # Minifier tests
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

# 4. Run tests
pnpm test

# 5. Verify metadata & OG images
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
- Runs unit tests (Vitest)
- Tests all Server Actions directly
- Validates transformation logic

**`pnpm verify-metadata`**
- Validates metadata for all pages
- Checks OG image URLs are correct
- Ensures no missing titles/descriptions
- Verifies dynamic cache busting works

---

## Testing

Codemata has comprehensive test coverage:

- **Unit Tests** (Vitest) - Server Actions & utilities
- **E2E Tests** (Playwright) - Desktop & mobile flows
- **Accessibility** (axe-core) - WCAG 2.0/2.1 Level AA compliance
- **Performance** (Lighthouse CI) - Quality benchmarking

**Quick Start:**
```bash
pnpm test         # Unit tests
pnpm test:e2e     # E2E tests (requires production build)
pnpm lighthouse   # Performance benchmarks
```

📖 **See [TESTING.md](TESTING.md) for comprehensive testing documentation**, including:
- How to run all test types
- E2E and accessibility test coverage
- CI/CD pipeline details
- Troubleshooting guide
- Best practices

---

## Continuous Integration

### GitHub Actions Workflow

CI runs on all PRs and pushes to `main` via `.github/workflows/ci.yml` with a hybrid 3-stage approach:

**Stage 1 (Parallel) - Fast Quality Checks:**
- Type checking (`tsc --noEmit`)
- Linting (`biome check`)
- Code formatting validation (`biome format`)

**Stage 2 (Sequential) - Build & Unit Tests:**
- Build production bundle (`next build`)
- Upload build artifact for Stage 3
- Run unit tests (`vitest run`)

**Stage 3 (Parallel) - Comprehensive Validation:**
- E2E tests (`playwright test`)
- Lighthouse CI (performance/accessibility thresholds)

**Branch Protection:**
- All checks must pass before merging to `main`
- Ensures production deployments are always validated

### CI Configuration

- **Workers:** Parallel quality checks (Stage 1), sequential build (Stage 2), parallel validation (Stage 3)
- **Caching:** pnpm dependencies, Next.js build cache, Playwright browsers
- **Artifacts:** Build output shared between jobs
- **Timeouts:** 10 minutes per job (adjustable if needed)

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

---

## E2E & Accessibility Testing

Codemata has comprehensive end-to-end testing, accessibility compliance, and performance monitoring.

### Test Stack

- **Unit Tests**: Vitest (72 tests covering Server Actions & utilities)
- **E2E Tests**: Playwright with Firefox (desktop + mobile)
- **Accessibility**: axe-core for WCAG 2.0/2.1 Level AA compliance
- **Performance**: Lighthouse CI for quality benchmarking

### Running E2E Tests

E2E tests run against a **production build** (not dev server):

```bash
cd apps/codemata

# Run E2E tests (headless)
pnpm test:e2e

# Run with Playwright UI (debug mode)
pnpm test:e2e --ui

# Run specific test file
pnpm test:e2e navigation.spec.ts

# Run only desktop tests
pnpm test:e2e --project=firefox-desktop

# Run only mobile tests
pnpm test:e2e --project=iphone-13
```

**Test Projects:**
- `firefox-desktop` (1920×1080) - Full desktop experience
- `iphone-13` (390×844) - iOS Safari mobile testing

**Configuration:**
- Workers: 1 locally (sequential), 2 in CI (parallel)
- BaseURL: http://localhost:3333 (production build via `next start`)
- Video: Retained on failure for debugging
- Location: `tests/e2e/**/*.spec.ts`

### E2E Test Coverage (116 tests passing)

**Desktop Tests (26 tests):**
- Navigation between pages (home, categories, tools)
- Tool functionality (8 formatters + 6 minifiers)
- Configuration options (indentation, trailing commas, etc.)
- Error handling (invalid syntax, malformed code)
- Command menu search and navigation (⌘K)
- Recent tools tracking and display
- Dark mode toggle persistence
- SEO metadata validation (titles, descriptions, OG images, canonical URLs)

**Mobile Tests (9 tests):**
- Mobile header and navigation drawer
- Touch targets (44px minimum per WCAG 2.5.5)
- Mobile menu interactions
- Pinch-to-zoom disabled
- Command menu on mobile
- Scroll-to-top FAB

**Accessibility Tests (81 tests total):**

*WCAG Compliance (42 tests):*
- Home page compliance
- Category pages (formatters, minifiers)
- All tool pages (formatters and minifiers)
- Color contrast validation (4.5:1 minimum)
- Dark mode testing (desktop + mobile)
- CodeMirror editor wrapped in accessible sections

*Keyboard Navigation (12 tests desktop, 12 skipped mobile):*
- Tab order follows logical flow
- Focus indicators visible on all interactive elements
- Enter activates buttons/links
- Escape closes dialogs (command menu)
- CodeMirror editor keyboard accessible
- Command menu shortcut: Meta+KeyK (⌘K on Mac)
- Focus trapping in dialogs
- Sidebar collapse/expand
- Skip links to main content

*Screen Reader (27 tests, 1 skipped mobile):*
- ARIA labels on all interactive elements
- Proper ARIA roles (dialog, menu, button)
- Tool configuration dropdowns properly labeled
- Dynamic content announcements
- Heading hierarchy (h1 → h2 → h3)
- Dialog labeling and descriptions
- Navigation links with accessible names
- Images with alt text
- Icon-only buttons with aria-labels
- No empty links or buttons

### Accessibility Compliance

✅ **WCAG 2.0/2.1 Level AA** compliance achieved across all pages

**Standards Met:**
- Color contrast: 4.5:1 minimum ratio for all text
- Touch targets: 44px minimum (mobile)
- Semantic HTML: `<section>`, `<nav>`, `<main>`, etc.
- Keyboard navigation: All features accessible without mouse
- Screen reader compatible: Proper ARIA labels and roles
- Focus indicators: Visible on all interactive elements

**Component Accessibility:**
- Button touch targets: 44px via `size="icon-touch"` variant
- Mobile header: All buttons properly labeled ("Open navigation menu", "Search tools", "Toggle theme")
- Code editor: Semantic `<section>` with unique IDs and aria-labelledby
- Command menu: Input labeled "Search tools"
- Navigation: All links have accessible names (text/aria-label/img alt)
- Color contrast: CategoryBackLink and NavigationList meet 5.5+:1 ratio

**CodeMirror Handling:**
- 3rd-party library internals excluded from axe scans
- Wrapped in accessible `<section>` element with proper ARIA labeling
- Keyboard navigation fully functional

### Lighthouse CI

Performance and quality benchmarking on 7 representative pages:

```bash
cd apps/codemata
pnpm lighthouse
```

**Pages Tested:**
- Home page
- Formatters category
- Minifiers category
- JSON Formatter (example formatter)
- TypeScript Formatter (example formatter)
- JavaScript Minifier (example minifier)
- CSS Minifier (example minifier)

**Thresholds (all passing):**
- Performance ≥ 90%
- Accessibility ≥ 93%
- Best Practices ≥ 90%
- SEO ≥ 95%

**Configuration:**
- Desktop preset with realistic throttling
- 3 runs per page for consistency
- RTT: 40ms, Throughput: 10240 kbps

### Running All Quality Checks

Before committing major changes, run the full quality suite:

```bash
cd apps/codemata

# 1. Format code
pnpm format

# 2. Lint code
pnpm lint

# 3. Type check
pnpm type-check

# 4. Unit tests (72 tests)
pnpm test

# 5. Metadata validation (18 pages)
pnpm verify-metadata

# 6. E2E tests (116 tests)
pnpm test:e2e

# 7. Lighthouse CI (7 pages)
pnpm lighthouse
```

All checks must pass to ensure production-ready code quality.

### Troubleshooting E2E Tests

**Test Failures:**
- Check test video in `test-results/` folder (saved on failure)
- Run with `--ui` flag for interactive debugging
- Verify production build is running (`pnpm build && PORT=3333 pnpm start`)

**Port Already in Use:**
- Kill process on port 3333: `lsof -ti:3333 | xargs kill`
- Or change port in `playwright.config.ts` baseURL

**Timeout Issues:**
- Increase timeout in `playwright.config.ts` if tests fail on slow machines
- Check network tab for slow API calls

**Mobile Tests Failing:**
- Mobile keyboard tests are automatically skipped (touch devices don't have keyboards)
- Sidebar tests are skipped on mobile (hidden by default)

**Accessibility Violations:**
- Run axe DevTools browser extension to debug locally
- CodeMirror internals (.cm-content, .cm-scroller) are excluded from scans
- Check color contrast with browser DevTools

### Running Tests Locally

#### Unit Tests

```bash
# Run once
pnpm test

# Watch mode
pnpm test:watch
```

#### E2E Tests

E2E tests run against a production build:

```bash
# 1. Build app (AI disabled for speed)
pnpm build:test

# 2. Start production server
pnpm start

# 3. In separate terminal, run tests
pnpm test:e2e              # Headless mode
pnpm test:e2e:ui           # Playwright UI (best for debugging)
pnpm test:e2e:headed       # Visible browser
pnpm test:e2e:report       # View HTML report
```

#### Lighthouse CI

```bash
# With production server running
pnpm test:lighthouse
```

### Test Coverage

**E2E Tests** (~40 tests):
- ✅ All 15 tool pages (9 formatters + 6 minifiers)
- ✅ Configuration changes (indentation options)
- ✅ Error handling (invalid code)
- ✅ Navigation (sidebar, command menu ⌘K, categories)
- ✅ Mobile responsive behavior (iPhone 13 viewport)
- ✅ Dark mode toggle & persistence
- ✅ SEO metadata validation (titles, OG images, canonical URLs)

**Accessibility Tests** (~45 tests):
- ✅ WCAG AA compliance (all 17 pages via axe-core)
- ✅ Keyboard navigation (Tab, Enter, Esc, focus visible)
- ✅ Screen reader compatibility (ARIA labels, roles, announcements)
- ✅ Color contrast validation (4.5:1 ratio)
- ✅ Focus management & heading hierarchy

**Lighthouse CI** (7 pages tested):
- Home, category pages, first 2 tools per category

**Blocking Thresholds:**
- Performance ≥ 90
- Accessibility ≥ 95
- Best Practices ≥ 90
- SEO ≥ 95

### CI/CD Pipeline

3-stage workflow on GitHub Actions:

**Stage 1** (Parallel, ~2 min): Type-check, lint, format
**Stage 2** (Sequential, ~3 min): Build (uploads artifact) + unit tests
**Stage 3** (Parallel, ~5 min): E2E + Lighthouse (download artifact)

Total: ~10 minutes

### Troubleshooting

**E2E timeouts:**
- Verify production server running: `curl http://localhost:3001`
- Check build exists: `ls -la .next/`

**Accessibility violations:**
- Debug with: `pnpm test:e2e:ui`
- View screenshots in Playwright HTML report

**Lighthouse failures:**
- Check reports in `.lighthouseci/` directory
- Review thresholds in `lighthouserc.json`

**Install browsers:**
```bash
pnpm exec playwright install firefox
```

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

© 2026 Ben Ilegbodu. All rights reserved.

