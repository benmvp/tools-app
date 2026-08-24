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

## Living Docs Index

Master links only. Authority rule: Current State documents are canonical for what exists now. Roadmap and legacy spec documents are planning context.

### Codemata

- **Current State (canonical):** [apps/codemata/specs/current-state.md](apps/codemata/specs/current-state.md)
- **Architecture Contracts (canonical):** [apps/codemata/specs/architecture-contracts.md](apps/codemata/specs/architecture-contracts.md)
- **Roadmap:** [apps/codemata/specs/roadmap.md](apps/codemata/specs/roadmap.md)
- **Legacy Spec (non-canonical):** [apps/codemata/specs/codemata-spec.md](apps/codemata/specs/codemata-spec.md)

### Moni

- **Current State (canonical):** [apps/moni/specs/current-state.md](apps/moni/specs/current-state.md)
- **Architecture Contracts (canonical):** [apps/moni/specs/architecture-contracts.md](apps/moni/specs/architecture-contracts.md)
- **Roadmap:** [apps/moni/specs/roadmap.md](apps/moni/specs/roadmap.md)
- **Legacy Spec (non-canonical):** [apps/moni/specs/moni-spec.md](apps/moni/specs/moni-spec.md)

### Convertly

- **Current State (canonical):** [apps/convertly/specs/current-state.md](apps/convertly/specs/current-state.md)
- **Architecture Contracts (canonical):** [apps/convertly/specs/architecture-contracts.md](apps/convertly/specs/architecture-contracts.md)
- **Roadmap:** [apps/convertly/specs/roadmap.md](apps/convertly/specs/roadmap.md)
- **Legacy Spec (non-canonical):** [apps/convertly/specs/convertly-spec.md](apps/convertly/specs/convertly-spec.md)

## License

© 2025 Ben Ilegbodu. All rights reserved.
