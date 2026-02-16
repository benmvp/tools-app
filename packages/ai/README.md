# @repo/ai

**AI content generation system using Google Gemini API.**

## Purpose

Reusable AI content generation system for creating contextual tool documentation, tips, and recommendations. Uses dependency injection pattern to accept app-specific tool data while providing generic generation logic.

## Exports

- **`getToolContent()`** - Main helper function to generate AI content for a tool
  - Accepts `toolId`, `toolName`, `toolType`, and `availableTools` array
  - Returns structured content (intro, metadata, sections, tips, recommendations)
  - Automatically cached with React.cache() for SSR/ISR

## Usage Pattern

**In your app's wrapper file:**

```typescript
// apps/your-app/lib/ai-helpers.ts
import { getToolContent as getToolContentBase } from "@repo/ai";
import { getAllTools } from "./tools-data";

export async function getToolContent(toolId: string, toolName: string, toolType: "formatter") {
  const availableTools = getAllTools().map((tool) => ({
    displayName: tool.name,
    url: tool.url,
  }));
  return getToolContentBase(toolId, toolName, toolType, availableTools);
}
```

**In your page component:**

```typescript
import { getFormatterContent } from "@/lib/ai-helpers";

const aiContent = await getFormatterContent("json", "JSON Formatter");
```

## Architecture

- **Dependency Injection:** Apps provide tool data, package provides generation logic
- **React Cache:** Built-in caching for SSR/ISR (no double wrapping needed)
- **Request Cache:** In-memory deduplication during rendering
- **Retry Logic:** Automatic retries with exponential backoff
- **Type Safety:** Zod schema validation for API responses

## Environment Variables

- `GOOGLE_API_KEY` - **Required** for AI generation
- `GEMINI_MODEL` - Optional (defaults to `gemini-2.0-flash-exp`)
- `DISABLE_AI` - Force disable AI generation

## Dependencies

- **Core:** `@google/generative-ai`, `zod`, `@repo/shared`
- **Peer Dependencies:** `react`

## Testing

```bash
pnpm test        # Run tests
pnpm test:watch  # Watch mode
```
