# Tools App

A **pnpm monorepo** of three Next.js applications providing free developer tools, financial calculators, and unit converters. Built with Next.js 15, TypeScript, and Turborepo.

## Apps

| App | Status | Description | Port |
|-----|--------|-------------|------|
| **[Codemata](apps/codemata/)** | ✅ **[Live](https://codemata.benmvp.com)** | Code formatters, minifiers, validators, encoders, generators & viewers (23 tools) | 3001 |
| **Moni** | 🚧 Planned | Financial calculators | 3002 |
| **Convertly** | 🚧 Planned | Unit converters | 3003 |

👉 **See [apps/codemata/README.md](apps/codemata/README.md) for detailed documentation**

## Quick Start

```bash
# Install dependencies
pnpm install

# Run all apps (or cd apps/codemata && pnpm dev)
pnpm dev
```

## Documentation

- **[Codemata README](apps/codemata/README.md)** - Complete guide (setup, architecture, deployment, testing)
- **[SPEC.md](SPEC.md)** - Project specification & architecture decisions
- **[TODO.md](TODO.md)** - Feature roadmap

## License

© 2025 Ben Ilegbodu. All rights reserved.
