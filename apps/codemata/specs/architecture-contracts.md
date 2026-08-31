# Codemata Architecture Contracts

Last Updated: 2026-08-29

## Contract Purpose

These contracts define the non-negotiable implementation patterns for Codemata. Agents and contributors should follow these rules when adding tools or changing behavior.

## Core Contracts

### Contract: Category-Driven Registry

- All tool definitions must be represented in the centralized category registry.
- Category metadata and category ordering must remain defined in the same registry layer.
- Tool additions should avoid ad hoc page-local registries.

### Contract: Server Action Transformations

- Transformations and validations are implemented via server actions for consistency and security.
- Client components may orchestrate UI interactions but should not reimplement transformation logic.

### Contract: Deterministic Routing by Slug

- Tool route slugs map to registry keys.
- Category pages and tool pages should resolve from canonical registry sources.

### Contract: Graceful AI Degradation

- Tool functionality must not depend on AI generation success.
- AI sections render only when content generation returns valid data.
- Local development should remain functional with AI generation disabled.

## Data and Metadata Contracts

- Keep user-facing tool labels, descriptions, urls, and metadata in the canonical registry.
- Keep ordering deterministic by category order plus per-category alpha ordering rules already in place.
- Preserve the comingSoon semantics used by getTotalToolCount and navigation surfaces.

## Testing Contracts

- New transformation or validation behavior requires unit tests in the relevant test suites.
- Registry changes require updates to tool-data tests when behavior expectations change.
- End-to-end tests should only be expanded when component behavior changes, not for every new tool.

## Documentation Update Contracts

- Any functionality change in Codemata must update current-state documentation.
- Any contract change must update this file.
- Planning-only details belong in roadmap docs, not current-state docs.

## Agent Enforcement Notes

- During bootstrap, use soft-warning mode when source changes appear without corresponding canonical doc updates.
- Warnings should be path-scoped and identify expected documentation targets.
- Factual statements in canonical docs should include evidence links.

## Evidence

- [../lib/tools-data.ts](../lib/tools-data.ts)
- [../app/formatters/actions.ts](../app/formatters/actions.ts)
- [../app/minifiers/actions.ts](../app/minifiers/actions.ts)
- [../app/validators/actions.ts](../app/validators/actions.ts)
- [../lib/ai/helpers.ts](../lib/ai/helpers.ts)
- [../lib/ai/generate.ts](../lib/ai/generate.ts)
- [../__tests__/tools-data.test.ts](../__tests__/tools-data.test.ts)
- [../TESTING.md](../TESTING.md)
