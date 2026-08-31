---
name: living-docs-contract
description:
   Maintains canonical living documentation for app current state and architecture contracts. Requires evidence-backed factual updates, keeps roadmap content separate, and warns when app code changes without matching doc updates.
---

# Living Docs Contract

Use this skill when functionality changes in any app so canonical documentation stays aligned.

## Canonical Model

1. Current State docs are canonical for what exists now.
2. Architecture Contracts docs are canonical for implementation rules.
3. Roadmap docs contain planning only.
4. Legacy mixed specs are historical reference only.

## Required Update Behavior

After implementation changes:

1. Update app Current State doc with factual behavior changes.
2. Update app Architecture Contracts doc if any rule or invariant changed.
3. Update roadmap docs only for planning changes.
4. Update Last Updated date in touched canonical docs.

## Evidence Rules

For factual sections in canonical docs:

1. Include evidence links to repository files.
2. Prefer direct source files over secondary summaries.
3. If a claim cannot be evidenced, do not present it as fact.
4. Record unknowns under a drift or gaps section.

## Separation Rules

1. Do not place backlog, phase plans, or future ideas in Current State docs.
2. Do not duplicate canonical current-state facts in roadmap docs.
3. If legacy docs conflict with canonical docs, canonical docs win.

## Bootstrap Soft-Warning Mode

During bootstrap, warnings are non-blocking.

Emit a warning when:

1. App source files changed and canonical docs for that app were not updated.
2. Canonical docs changed without evidence links for new factual claims.

Warning output should include:

1. Changed app paths.
2. Expected canonical docs to update.
3. Suggested next edit actions.

## Canonical Targets

- Root index: [README.md](../../../README.md)

### Codemata

- Current State: [apps/codemata/specs/current-state.md](../../../apps/codemata/specs/current-state.md)
- Architecture Contracts: [apps/codemata/specs/architecture-contracts.md](../../../apps/codemata/specs/architecture-contracts.md)
- Roadmap: [apps/codemata/specs/roadmap.md](../../../apps/codemata/specs/roadmap.md)
- Legacy spec: [apps/codemata/specs/codemata-spec.md](../../../apps/codemata/specs/codemata-spec.md)

### Moni

- Current State: [apps/moni/specs/current-state.md](../../../apps/moni/specs/current-state.md)
- Architecture Contracts: [apps/moni/specs/architecture-contracts.md](../../../apps/moni/specs/architecture-contracts.md)
- Roadmap: [apps/moni/specs/roadmap.md](../../../apps/moni/specs/roadmap.md)
- Legacy spec: [apps/moni/specs/moni-spec.md](../../../apps/moni/specs/moni-spec.md)

### Convertly

- Current State: [apps/convertly/specs/current-state.md](../../../apps/convertly/specs/current-state.md)
- Architecture Contracts: [apps/convertly/specs/architecture-contracts.md](../../../apps/convertly/specs/architecture-contracts.md)
- Roadmap: [apps/convertly/specs/roadmap.md](../../../apps/convertly/specs/roadmap.md)
- Legacy spec: [apps/convertly/specs/convertly-spec.md](../../../apps/convertly/specs/convertly-spec.md)

## Quick Workflow

1. Detect changed app paths.
2. Map changes to canonical docs for that app.
3. Apply factual updates with evidence links.
4. Ensure roadmap content is not leaked into Current State.
5. Run repo checks once after all edits.
