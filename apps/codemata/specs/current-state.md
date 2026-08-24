# Codemata Current State

Last Updated: 2026-08-23

## Purpose

Codemata is the live developer-tools app in Tools App. It provides browser-accessible utilities for formatting, minifying, validating, encoding, generating, and previewing developer-focused content.

## Status Snapshot

- Lifecycle: Live
- Domain: codemata.benmvp.com
- App model: Next.js app with App Router patterns and category-driven tool registry
- Tool execution model: server actions for transformation and validation flows
- Documentation role: this file is canonical for what exists now

## What Exists Now

### User-Facing Tool Categories

- Formatters
- Minifiers
- Encoders and Decoders
- Validators
- Generators
- Viewers

### Tool Registry and Routing

- Tool metadata is centralized in a category-driven registry.
- Category and tool routes are organized under app router directories by capability type.
- Total active tool count is derived at runtime from the registry via getTotalToolCount.

## Runtime and Architecture Reality

- Server-side actions are used for formatting, minification, validation, encoding, and preview transforms.
- AI content generation is environment-aware and can be disabled in local development.
- Tool pages are generated from registry data and category slugs.
- Category display ordering is driven by explicit order metadata in the tool registry.

## Testing and Quality Reality

- Unit tests exist for formatters, minifiers, encoders, validators, generators, viewers, and tool-data helpers.
- End-to-end and accessibility test infrastructure exists in the app-level test stack.
- Type-checking, linting, and formatting commands are provided at app and repo scope.

## Known Drift and Gaps

- Multiple historical docs contain conflicting tool totals and phase status wording.
- Legacy specification files currently mix current-state facts with roadmap plans.
- Root documentation has not yet fully adopted canonical current-state plus contracts links for every app.

## Evidence

- [apps/codemata/lib/tools-data.ts](apps/codemata/lib/tools-data.ts)
- [apps/codemata/app/formatters/actions.ts](apps/codemata/app/formatters/actions.ts)
- [apps/codemata/app/minifiers/actions.ts](apps/codemata/app/minifiers/actions.ts)
- [apps/codemata/app/validators/actions.ts](apps/codemata/app/validators/actions.ts)
- [apps/codemata/app/encoders/actions.ts](apps/codemata/app/encoders/actions.ts)
- [apps/codemata/app/viewers/actions.ts](apps/codemata/app/viewers/actions.ts)
- [apps/codemata/lib/ai/helpers.ts](apps/codemata/lib/ai/helpers.ts)
- [apps/codemata/lib/ai/generate.ts](apps/codemata/lib/ai/generate.ts)
- [apps/codemata/__tests__/tools-data.test.ts](apps/codemata/__tests__/tools-data.test.ts)
- [apps/codemata/README.md](apps/codemata/README.md)
