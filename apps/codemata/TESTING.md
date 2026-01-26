# Testing Guide - Codemata

Comprehensive testing documentation for E2E, accessibility, performance, and unit tests.

---

## Test Stack

| Type | Tool | Purpose |
|------|------|---------|
| **Unit Tests** | Vitest | Server Actions & utilities |
| **E2E Tests** | Playwright | Desktop + mobile browser testing |
| **Accessibility** | @axe-core/playwright | WCAG 2.0/2.1 Level AA compliance |
| **Performance** | Lighthouse CI | Quality benchmarking |

---
## E2E Test Strategy (Sample-Based, Prevents Linear Growth)

To prevent e2e tests from growing linearly with new tools, we use a sample-based testing approach:

### 1. Component Tests (`tests/e2e/components/`)

Test shared component behavior once using representative tools:

- **`transformer.spec.ts`** - Tests Transformer component (empty input, config changes, copy buttons, error handling) using TypeScript Formatter
- **`transformer-minifier.spec.ts`** - Tests TransformerMinifier component (size display, empty input) using TypeScript Minifier
- **`transformer-encoder.spec.ts`** - Tests TransformerEncoder component (encode/decode, round-trip, button states) using Base64 Encoder + JWT Decoder
- Runs on **desktop only** (device-independent component behavior)

### 2. Sample-Based Tool Tests (`tests/e2e/tools/`)

Only test 1-2 representative tools per category:

- **`formatters.spec.ts`** - Tests TypeScript Formatter only (validates server action integration)
- **`minifiers.spec.ts`** - Tests TypeScript Minifier only
- **`encoders.spec.ts`** - Tests Base64 Encoder + JWT Decoder (bidirectional vs decode-only patterns)
- Runs on **both desktop and mobile**

### 3. Accessibility Tests (`tests/e2e/a11y-*.spec.ts`)

Sample one tool per category:

- Tests home, formatters category, minifiers category, encoders category pages
- Tests ONE formatter tool, ONE minifier tool, ONE encoder tool (all use same page template)
- Runs on **both desktop and mobile** (except keyboard/screen-reader which are desktop-only)

### 4. When Adding a New Tool

- ✅ **Add unit tests** for the server action in `__tests__/` (always required)
- ✅ **Add tool to data** - `FORMATTER_TOOLS/MINIFIER_TOOLS/ENCODER_TOOLS` in `lib/tools-data.ts`
- ✅ **Automatic integration** - Tool automatically appears in navigation, sitemap, command menu, etc.
- ❌ **DO NOT add new e2e tests** unless the tool introduces NEW component behavior or UI patterns
- **Result:** 0-2 new e2e tests (instead of 8-10 per tool)

### Benefits

- **Prevents Linear Growth:** Adding 10 new tools = 0-2 new tests (not 80-100)
- **Faster CI/CD:** Fewer tests = faster feedback loops
- **Easier Maintenance:** Component tests cover shared behavior once
- **Same Coverage:** All tools use same templates, so testing one validates all

---
## Running Tests

### Unit Tests

```bash
cd apps/codemata

# Run once
pnpm test

# Watch mode during development
pnpm test:watch

# Run specific test file
pnpm test formatters.test.ts
```

**Test Pattern:**
Tests verify Server Actions directly (no UI testing):

```typescript
import { formatTypescript } from "../app/formatters/actions";

it("formats with 2-space indentation", async () => {
  const input = 'const x={a:1};';
  const result = await formatTypescript(input, { indentation: "two-spaces" });
  expect(result).toContain("const x");
});
```

**Coverage:**
- Formatter tests (`__tests__/formatters.test.ts`)
- Minifier tests (`__tests__/minifiers.test.ts`)
- Recent tools tests (`__tests__/recent-tools.test.ts`)
- Search index tests (`__tests__/search-index.test.ts`)

### E2E Tests

E2E tests run against a **production build** (not dev server):

```bash
cd apps/codemata

# Run E2E tests (headless)
pnpm test:e2e

# Run with Playwright UI (debug mode - recommended)
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
- BaseURL: http://localhost:3333 (production build via `next start`)
- Video: Retained on failure for debugging
- Location: `tests/e2e/**/*.spec.ts`

### Lighthouse CI

Performance and quality benchmarking:

```bash
cd apps/codemata
pnpm lighthouse
```

**Smoke Test Approach:**
Lighthouse tests validate quality benchmarks on representative pages rather than comprehensive coverage. This prevents long CI wait times while ensuring quality standards.

### Metadata Verification

Validates SEO metadata, OpenGraph images, and structured data across all pages:

```bash
cd apps/codemata

# Local dev (default - uses localhost:3001)
pnpm dev  # Terminal 1
pnpm verify-metadata  # Terminal 2

# Local production build (uses localhost:3333)
pnpm build && pnpm start  # Terminal 1
VERCEL_PROJECT_PRODUCTION_URL=localhost:3333 pnpm verify-metadata  # Terminal 2
```

**Comprehensive Coverage:**
Unlike Lighthouse's smoke test approach, metadata verification checks **all pages** (31+ pages):
- Home page
- All category pages (formatters, minifiers, encoders, validators)
- All tool pages across all categories

**Validations:**
- Title length (20-70 chars, SEO ideal 50-60)
- Description length (80-200 chars, SEO ideal 120-160)
- Uniqueness (no duplicate titles/descriptions)
- Canonical URLs
- OpenGraph tags (title, description, image, type, url)
- OpenGraph image accessibility (validates PNG format)
- Twitter Card tags
- Structured data (JSON-LD for tool pages)

**Exit Codes:**
- `0` - All pages passed validation
- `1` - Validation failures or no pages fetched

**Pages Tested (5 URLs × 2 runs = 10 tests):**
- Home page (unique layout)
- One category page (formatters - validates all category pages)
- One formatter tool (TypeScript - validates all formatter pages)
- One minifier tool (TypeScript - validates all minifier pages)
- One encoder tool (Base64 - validates all encoder pages)

**Thresholds (all must pass):**
- Performance ≥ 90%
- Accessibility ≥ 93%
- Best Practices ≥ 90%
- SEO ≥ 95%

**Configuration:**
- Desktop preset with realistic throttling
- 2 runs per page for consistency
- RTT: 40ms, Throughput: 10240 kbps

---

## E2E Test Coverage

### Desktop Tests

**Navigation:**
- Home → categories → tools
- Sidebar navigation between tools
- Category back links
- Command menu search and navigation (⌘K)

**Tool Functionality:**
- All formatters (CSS, GraphQL, HTML, JS/TS, JSON, Markdown, XML, YAML)
- All minifiers (CSS, HTML, JS/TS, JSON, SVG, XML)
- Configuration options (indentation, trailing commas, etc.)
- Error handling (invalid syntax, malformed code)

**Features:**
- Recent tools tracking and display
- Dark mode toggle persistence
- Command menu keyboard shortcuts

**SEO:**
- Page titles and descriptions
- OpenGraph image URLs
- Canonical URLs

### Mobile Tests

**Mobile-Specific:**
- Mobile header and navigation drawer
- Touch targets (44px minimum per WCAG 2.5.5)
- Mobile menu interactions
- Pinch-to-zoom disabled
- Command menu on mobile
- Scroll-to-top FAB

### Accessibility Tests

#### WCAG Compliance

**Pages Tested:**
- Home page
- Category pages (formatters, minifiers)
- All tool pages (formatters and minifiers)
- Dark mode variants (desktop + mobile)

**Standards:**
- WCAG 2.0 Level A & AA
- WCAG 2.1 Level A & AA
- Color contrast validation (4.5:1 minimum)

**Special Handling:**
- CodeMirror editor wrapped in accessible sections
- 3rd-party library internals (.cm-content, .cm-scroller) excluded from scans

#### Keyboard Navigation

**Desktop Coverage:**
- Tab order follows logical flow
- Focus indicators visible on all interactive elements
- Enter key activates buttons/links
- Escape key closes dialogs (command menu)
- CodeMirror editor keyboard accessible
- Command menu shortcut: Meta+KeyK (⌘K on Mac)
- Focus trapping in dialogs
- Sidebar collapse/expand
- Skip links to main content

**Mobile:**
- Keyboard tests automatically skipped (touch devices)

#### Screen Reader Compatibility

**Coverage:**
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

**Mobile:**
- Sidebar tests skipped (hidden by default)

---

## Accessibility Compliance

✅ **WCAG 2.0/2.1 Level AA** compliance achieved across all pages

### Standards Met

- **Color Contrast:** 4.5:1 minimum ratio for all text
- **Touch Targets:** 44px minimum (mobile)
- **Semantic HTML:** `<section>`, `<nav>`, `<main>`, etc.
- **Keyboard Navigation:** All features accessible without mouse
- **Screen Reader Compatible:** Proper ARIA labels and roles
- **Focus Indicators:** Visible on all interactive elements

### Component Accessibility

**Button Touch Targets:**
- 44px minimum via `size="icon-touch"` variant
- Meets WCAG 2.5.5 Target Size requirement

**Mobile Header:**
- All buttons properly labeled:
  - "Open navigation menu"
  - "Search tools"
  - "Toggle theme"

**Code Editor:**
- Semantic `<section>` element
- Unique IDs with aria-labelledby
- Screen reader announces editor purpose

**Command Menu:**
- Input labeled "Search tools"
- Focus trap when open
- Escape to close

**Navigation:**
- All links have accessible names (text/aria-label/img alt)
- Proper heading hierarchy
- Skip links available

**Color Contrast:**
- CategoryBackLink: 5.5+:1 ratio
- NavigationList: 5.5+:1 ratio (dark mode)
- All text exceeds 4.5:1 minimum

### CodeMirror Handling

**Approach:**
- 3rd-party library internals excluded from axe scans
- Wrapper uses semantic `<section>` element
- Proper ARIA labeling via aria-labelledby
- Keyboard navigation fully functional
- Accessible to screen readers

**Why Exclude Internals:**
- CodeMirror manages its own ARIA attributes
- Scanning internals causes false positives
- Wrapper provides sufficient accessibility context

---

## Running All Quality Checks

Before committing major changes, run the full quality suite:

```bash
cd apps/codemata

# 1. Format code
pnpm format

# 2. Lint code
pnpm lint

# 3. Type check
pnpm type-check

# 4. Unit tests
pnpm test

# 5. Metadata validation
pnpm verify-metadata

# 6. E2E tests
pnpm test:e2e

# 7. Lighthouse CI
pnpm lighthouse
```

All checks must pass to ensure production-ready code quality.

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
- Lighthouse CI (quality thresholds)
- Metadata verification (validates SEO metadata, OG images, structured data)

**Branch Protection:**
- All checks must pass before merging to `main`
- Ensures production deployments are always validated

### CI Configuration

- **Workers:** Parallel quality checks (Stage 1), sequential build (Stage 2), parallel validation (Stage 3)
- **Caching:** pnpm dependencies, Next.js build cache, Playwright browsers
- **Artifacts:** Build output shared between jobs
- **Timeouts:** 10 minutes per job (adjustable if needed)

---

## Troubleshooting

### E2E Test Failures

**Test Videos:**
- Check `test-results/` folder for videos (saved on failure)
- Videos show exact user flow and failure point

**Interactive Debugging:**
```bash
pnpm test:e2e --ui
```
- Step through tests
- Pause execution
- Inspect elements
- View console logs

**Production Build:**
```bash
# Verify build exists
ls -la .next/

# Verify server running
curl http://localhost:3333

# Rebuild if needed
pnpm build && PORT=3333 pnpm start
```

### Port Already in Use

**Kill Process:**
```bash
lsof -ti:3333 | xargs kill
```

**Or Change Port:**
Edit `playwright.config.ts` baseURL to use different port

### Timeout Issues

**Increase Timeouts:**
- Edit `playwright.config.ts` if tests fail on slow machines
- Check network tab for slow API calls
- Verify no unnecessary network requests

**Common Causes:**
- Slow build process
- Heavy AI content generation (should be disabled in tests)
- Network issues
- Resource-intensive operations

### Mobile Test Issues

**Keyboard Tests:**
- Automatically skipped on mobile (touch devices don't have keyboards)
- This is expected behavior

**Sidebar Tests:**
- Skipped on mobile (hidden by default)
- Mobile uses navigation drawer instead

**Touch Target Failures:**
- Verify buttons use `size="icon-touch"` (44px minimum)
- Check mobile viewport configuration

### Accessibility Violations

**Debug Locally:**
```bash
pnpm test:e2e:ui  # Interactive mode
```

**Browser Extension:**
- Install axe DevTools browser extension
- Run manual scans on failing pages
- View detailed violation reports

**Common Issues:**
- **Color Contrast:** Check with browser DevTools color picker
- **Missing Labels:** Verify aria-label or aria-labelledby
- **Focus Indicators:** Ensure visible focus states
- **Heading Hierarchy:** Don't skip levels (h1 → h2 → h3)

**CodeMirror:**
- Remember: Internals (.cm-content, .cm-scroller) are excluded
- Wrapper must have proper ARIA labeling
- Check section element has aria-labelledby

### Lighthouse Failures

**Performance Issues:**
- Check bundle size (`pnpm analyze`)
- Verify images optimized
- Check for large 3rd-party scripts

**Accessibility Score:**
- Run E2E accessibility tests first
- Lighthouse may catch different issues
- Manual testing recommended

**Best Practices:**
- Console errors/warnings
- HTTP/HTTPS mixed content
- Browser errors

**SEO Score:**
- Missing meta descriptions
- Missing title tags
- Robots.txt issues
- Canonical URL problems

### Test Flakiness

**Common Causes:**
- Using `waitForTimeout()` instead of waiting for actual conditions
- Checking CodeMirror's internal DOM state (`.toBeEmpty()`, `.textContent()`)
- Testing implementation details instead of user-facing behavior
- Network timing issues
- State pollution between tests

**Solutions:**
- **Replace `waitForTimeout()`** with behavior checks (`toBeVisible()`, `toBeEnabled()`, `toHaveAttribute()`)
- **Avoid CodeMirror internals** - Test button states, toasts, and badges instead
- **Use `waitForLoadState('networkidle')`** after navigation
- **Use `expect.poll()`** for values that change over time
- **Wait for toasts/badges** to indicate operations completed
- **Clear state between tests** - Use `await page.goto()` with fresh context
- **Use keyboard shortcuts** to clear editors (`Meta+A` + `Backspace`)

**Pattern Replacements:**
```typescript
// Before (flaky) → After (robust)
await page.waitForTimeout(1000) → await expect(toast).toBeVisible()
await expect(editor).toBeEmpty() → await expect(button).toBeDisabled()
const text = await editor.textContent() → await expect(copyButton).toBeEnabled()
await editor.fill("") → await editor.press("Meta+A"); await editor.press("Backspace")
```

---

## Best Practices

### Avoiding Flaky Tests

**Test Behavior, Not Implementation:**
The most important principle for robust E2E tests is to test user-facing behavior rather than internal implementation details.

```typescript
// ❌ BAD: Testing CodeMirror's internal DOM state
await inputEditor.fill("");
await expect(inputEditor).toBeEmpty();

// ✅ GOOD: Testing the resulting behavior
await inputEditor.press("Meta+A");
await inputEditor.press("Backspace");
await expect(formatButton).toBeDisabled();
```

**Avoid Fixed Timeouts:**
Never use `waitForTimeout()` - it's the primary cause of flaky tests. Always wait for actual conditions.

```typescript
// ❌ BAD: Fixed delays
await page.waitForTimeout(1000);
const text = await element.textContent();

// ✅ GOOD: Wait for actual state changes
await expect(successToast).toBeVisible();
await expect(copyButton).toBeEnabled();
```

**Don't Check CodeMirror's Internal State:**
CodeMirror's DOM structure is complex and changes asynchronously. Never use `.toBeEmpty()` or `.textContent()` to check if editors are empty.

```typescript
// ❌ BAD: Checking editor emptiness
const text = await inputEditor.textContent();
expect(text?.trim()).toBe("");

// ✅ GOOD: Check button states that reflect editor state
await expect(formatButton).toBeDisabled(); // Button knows if editor is empty
```

**Wait for User-Facing Outcomes:**
Instead of checking DOM state, wait for things users would notice.

```typescript
// ❌ BAD: Checking if output editor has content
await expect(outputEditor).not.toBeEmpty();

// ✅ GOOD: Wait for indicators that operation completed
await expect(successToast).toBeVisible();    // User sees success message
await expect(copyButton).toBeEnabled();      // Copy button becomes available
await expect(sizeBadge).toBeVisible();       // Size badge appears
```

**Use Dynamic Polling for Async Values:**
For values that change over time (like scroll position), use `expect.poll()`.

```typescript
// ❌ BAD: Fixed timeout + direct assertion
await page.waitForTimeout(500);
const scrollY = await page.evaluate(() => window.scrollY);
expect(scrollY).toBeLessThan(100);

// ✅ GOOD: Poll until condition is met
await expect.poll(
  async () => await page.evaluate(() => window.scrollY),
  { timeout: 3000 }
).toBeLessThan(100);
```

**Clear Editors with Keyboard Shortcuts:**
Using `.fill("")` on CodeMirror can be unreliable. Use keyboard shortcuts instead.

```typescript
// ❌ BAD: Using fill to clear
await inputEditor.fill("");

// ✅ GOOD: Use keyboard shortcuts
await inputEditor.click();
await inputEditor.press("Meta+A");
await inputEditor.press("Backspace");
```

### Writing E2E Tests

**Use Page Objects:**
```typescript
// Good: Reusable selectors
const selectors = {
  formatButton: '[data-testid="format-button"]',
  inputEditor: '.input-editor',
};

// Bad: Hardcoded selectors everywhere
await page.locator('button.format-btn').click();
```

**Wait for Conditions:**
```typescript
// Good: Wait for element state
await expect(page.locator('.output')).toBeVisible();

// Bad: Fixed delays
await page.waitForTimeout(1000);
```

**Use Test IDs:**
```typescript
// In component
<button data-testid="format-button">Format</button>

// In test
await page.locator('[data-testid="format-button"]').click();
```

### Writing Accessibility Tests

**Test Real User Scenarios:**
- Tab through entire page
- Use screen reader navigation patterns
- Test keyboard shortcuts
- Verify focus management

**Test Both Modes:**
- Light and dark mode
- Desktop and mobile viewports
- With and without JavaScript

**Don't Over-Exclude:**
- Only exclude truly 3rd-party internals
- Your wrapper code should be tested
- Use exclusions sparingly

### Writing Unit Tests

**Test Server Actions Directly:**
```typescript
// Good: Test the actual function
const result = await formatTypescript(input, config);

// Bad: Don't test UI in unit tests
render(<Transformer />);
```

**Test Edge Cases:**
- Empty input
- Invalid syntax
- Extreme values
- Malformed data

**Keep Tests Fast:**
- No network calls
- No file system operations
- Mock heavy dependencies

---

## Test Maintenance

### When to Update Tests

**Adding Features:**
- Add E2E tests for new user flows
- Add accessibility tests for new components
- Update unit tests for new functions

**Changing UI:**
- Update selectors if test IDs change
- Update accessibility tests if ARIA changes
- Update mobile tests if responsive behavior changes

**Refactoring:**
- Tests should still pass after refactoring
- If tests break, they may be too brittle
- Consider using more stable selectors

### Keeping Tests Fast

**Unit Tests:**
- Should run in seconds
- No external dependencies
- Mock everything

**E2E Tests:**
- Run against production build (faster than dev)
- Disable AI content generation (via DISABLE_AI=true)
- Use sequential workers locally (prevents conflicts)
- Use parallel workers in CI (faster overall)

**Lighthouse:**
- Test representative pages only
- Don't test every single page
- Cache is your friend

### Test Organization

**File Structure:**
```
tests/e2e/
├── navigation.spec.ts       # Navigation flows
├── tools/
│   ├── formatters.spec.ts   # Formatter tests
│   └── minifiers.spec.ts    # Minifier tests
├── mobile.spec.ts           # Mobile-specific
├── seo.spec.ts              # SEO metadata
├── a11y-compliance.spec.ts  # WCAG compliance
├── a11y-keyboard.spec.ts    # Keyboard navigation
└── a11y-screen-reader.spec.ts # Screen reader
```

**Naming Conventions:**
- `*.spec.ts` for E2E tests
- `*.test.ts` for unit tests
- Descriptive names that match feature
- Group related tests in describe blocks

---

## Additional Resources

### Documentation
- [Playwright Docs](https://playwright.dev)
- [Vitest Docs](https://vitest.dev)
- [axe-core Rules](https://github.com/dequelabs/axe-core/blob/develop/doc/rule-descriptions.md)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Lighthouse Docs](https://developer.chrome.com/docs/lighthouse/)

### Tools
- [axe DevTools Browser Extension](https://www.deque.com/axe/browser-extensions/)
- [Playwright Inspector](https://playwright.dev/docs/debug#playwright-inspector)
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)

### WCAG Resources
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [WebAIM Keyboard Testing](https://webaim.org/articles/keyboard/)
- [WebAIM Screen Reader Testing](https://webaim.org/articles/screenreader_testing/)
