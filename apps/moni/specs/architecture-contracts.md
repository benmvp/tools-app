# Moni Architecture Contracts

Last Updated: 2026-08-23

## Contract Purpose

These contracts define implementation expectations for Moni as it moves from planned to implemented state.

## Core Contracts

### Contract: Canonical Registry for Calculators

- Calculator and category metadata should be centralized in a single registry layer.
- Route generation and navigation should derive from canonical registry data.

### Contract: Client-Side Calculator Execution

- Pure financial calculations should run client-side for responsiveness and privacy.
- Server actions should be reserved for cases requiring external calls or server-only processing.

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

- [apps/moni/specs/moni-spec.md](apps/moni/specs/moni-spec.md)
- [README.md](README.md)
