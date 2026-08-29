# Moni Architecture Contracts

Last Updated: 2026-08-29

## Contract Purpose

These contracts define implementation expectations for Moni as the app expands from Phase 0.

## Core Contracts

### Contract: Canonical Registry for Calculators

- Calculator and category metadata should be centralized in a single registry layer.
- Route generation and navigation should derive from canonical registry data.
- Empty future categories can exist in metadata, but category navigation rendering should continue to filter to non-empty categories.

### Contract: Client-Side Calculator Execution

- Pure financial calculations should run client-side for responsiveness and privacy.
- Server actions can exist for future expansion but should not replace client-side execution for simple calculator flows without a clear need.

### Contract: Financial Disclaimer Presence

- Calculator experiences must include clear disclaimer messaging.
- Disclaimers must communicate estimates-only and non-advisory boundaries.

### Contract: Accuracy-First Validation

- Financial formulas require rigorous unit testing and edge-case coverage.
- Rounding behavior should be explicit and consistently documented.

## Documentation Update Contracts

- Any implemented Moni functionality must update current-state documentation.
- Contract changes must update this file.
- Roadmap detail belongs in roadmap docs, not current-state docs.

## Agent Enforcement Notes

- During bootstrap, warn when Moni source changes occur without canonical doc updates.
- Keep warnings non-blocking and path-scoped.

## Evidence

- [apps/moni/lib/tools-data.ts](apps/moni/lib/tools-data.ts)
- [apps/moni/app/savings-investing/[slug]/page.tsx](apps/moni/app/savings-investing/[slug]/page.tsx)
- [apps/moni/components/SimpleInterestCalculator.tsx](apps/moni/components/SimpleInterestCalculator.tsx)
- [apps/moni/app/savings-investing/actions.ts](apps/moni/app/savings-investing/actions.ts)
- [apps/moni/__tests__/tools-data.test.ts](apps/moni/__tests__/tools-data.test.ts)
- [apps/moni/specs/moni-spec.md](apps/moni/specs/moni-spec.md)
- [README.md](README.md)
