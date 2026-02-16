# @repo/config

**Shared configuration files for TypeScript, Biome, and Vitest across the monorepo.**

## Purpose

Centralized configurations that ensure consistency across all apps (Codemata, Moni, Convertly) and packages. Update rules in one place, apply everywhere.

## Structure

```
config/
├── typescript/     # TypeScript configurations
│   ├── base.json       # Base settings (all packages)
│   ├── nextjs.json     # Next.js app settings
│   └── package.json    # Package-specific settings
├── biome/          # Biome linting & formatting
│   ├── base.json       # Base rules (packages)
│   ├── nextjs.json     # Next.js app rules
│   └── package.json    # Package-specific rules
└── vitest/         # Vitest testing configurations
    ├── base.ts         # Base test config
    ├── react.ts        # React component tests
    └── nextjs.ts       # Next.js app tests
```

## Usage

### TypeScript

**Next.js Apps:**
```json
{
  "extends": "@repo/config/typescript/nextjs.json",
  "include": ["**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

**Packages:**
```json
{
  "extends": "@repo/config/typescript/package.json",
  "include": ["**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules", "dist"]
}
```

### Biome

**Next.js Apps:**
```json
{
  "extends": ["../../packages/config/biome/nextjs.json"],
  "overrides": [
    // App-specific overrides
  ]
}
```

**Packages:**
```json
{
  "extends": ["../../packages/config/biome/package.json"]
}
```

### Vitest

**Next.js Apps with React:**
```typescript
import { nextjsConfig } from "@repo/config/vitest/nextjs";
import { defineConfig } from "vitest/config";

export default defineConfig(nextjsConfig);
```

**Packages with React:**
```typescript
import { reactConfig } from "@repo/config/vitest/react";
import { defineConfig } from "vitest/config";

export default defineConfig(reactConfig);
```

**Node-only Packages:**
```typescript
import { baseConfig } from "@repo/config/vitest/base";
import { defineConfig } from "vitest/config";

export default defineConfig(baseConfig);
```

## Benefits

- ✅ **DRY** - Update once, apply everywhere
- ✅ **Consistency** - Same standards across all apps
- ✅ **Maintainability** - Clear single source of truth
- ✅ **Scalability** - Easy to add Moni/Convertly
- ✅ **Documentation** - Config decisions documented centrally
