# @repo/ui

**Shared UI components for all Tools App applications.**

## Purpose

Generic UI components that can be reused across all apps in the monorepo. Currently minimal by design - components are extracted here only when duplication becomes painful across multiple apps (YAGNI principle).

## Exports

- **`JsonLd`** - Structured data component for SEO
  - Renders JSON-LD schema markup
  - Type-safe with `Thing` type from `@repo/shared`

## Usage

```typescript
import { JsonLd } from "@repo/ui";

<JsonLd data={{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "My Tool",
  // ...
}} />
```

## Dependencies

- **Core:** `@repo/shared`, `lucide-react`
- **Peer Dependencies:** `react`, `next`

## Testing

```bash
pnpm test        # Run tests
pnpm test:watch  # Watch mode
```

## Future Components

As new apps (Moni, Convertly) are built, shared components will be extracted here when patterns emerge across multiple apps.
