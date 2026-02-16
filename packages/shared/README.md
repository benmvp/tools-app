# @repo/shared

**Shared utilities, types, and core functionality for all Tools App applications.**

## Purpose

Foundation package containing common utilities, TypeScript types, and localStorage management used across all apps in the monorepo. This is a leaf dependency with no dependencies on other internal packages.

## Exports

- **`utils.ts`** - Utility functions:
  - `cn()` - Tailwind class name merger
  - `shouldGenerateAI()` - Environment-aware AI feature flag
  - `getOgImageUrl()` - OpenGraph image URL generator with cache busting
  - `getToolStructuredData()` - JSON-LD structured data for tools

- **`types.ts`** - TypeScript definitions:
  - Tool types: `FormatterTool`, `MinifierTool`, `EncoderTool`, `ValidatorTool`, `GeneratorTool`, `ViewerTool`
  - Category types: `ToolCategory`, `ToolCategoryId`
  - Validation types: `ValidationError`, `ValidationResult`

- **`recent-tools.ts`** - Recent tools localStorage utilities:
  - `getRecentTools()` - Retrieve recently visited tools
  - `addRecentTool()` - Track tool visit
  - `clearRecentTools()` - Clear history

## Usage

```typescript
import { cn, shouldGenerateAI, type FormatterTool } from "@repo/shared";
```

## Dependencies

- **Core:** `clsx`, `tailwind-merge`
- **Peer Dependencies:** `react`, `next`, `lucide-react`

## Testing

```bash
pnpm test        # Run tests
pnpm test:watch  # Watch mode
```
