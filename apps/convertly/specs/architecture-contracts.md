# Convertly Architecture Contracts

Last Updated: 2026-08-29

## Contract Purpose

These contracts define implementation expectations for Convertly as it moves from planned to implemented state.

## Core Contracts

### Contract: Canonical Registry for Converters

- Converter and category metadata should be centralized in a single registry layer.
- Route generation and navigation should derive from canonical registry data.

### Contract: Client-Side Conversion Execution

- Pure conversion logic should run client-side for latency and cost efficiency.
- Server actions should be reserved for external APIs or server-only concerns.

### Contract: Deterministic Category Routing

- Category and tool routes should remain deterministic from registry metadata.
- Adding tools should not require ad hoc route bookkeeping outside canonical sources.

### Contract: Graceful Content Degradation

- Converter functionality must work regardless of AI content availability.
- Optional content generation should never block core conversion outcomes.

## Documentation Update Contracts

- Any implemented Convertly functionality must update current-state documentation.
- Contract changes must update this file.
- Roadmap detail belongs in roadmap docs, not current-state docs.

## Agent Enforcement Notes

- During bootstrap, warn when Convertly source changes occur without canonical doc updates.
- Keep warnings non-blocking and path-scoped.

## Evidence

- [convertly-spec.md](convertly-spec.md)
- [../../../README.md](../../../README.md)
