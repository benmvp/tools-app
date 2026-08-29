# Moni Current State

Last Updated: 2026-08-29

## Purpose

Moni is the financial calculators app in Tools App. It currently includes a Phase 0 implementation with one live calculator flow and the core app infrastructure for future calculator expansion.

## Status Snapshot

- Lifecycle: In Development
- Domain target: moni.benmvp.com
- Implementation state on this branch: app scaffold exists with one implemented calculator route
- Documentation role: this file is canonical for what exists now

## What Exists Now

### Repository Reality

- A full app directory exists for Moni, including app routes, components, libs, tests, and config.
- One implemented calculator exists in the savings-investing category: Simple Interest Calculator.
- Category metadata includes future categories, but the category navigation helper currently returns only non-empty categories.

### Implemented Category and Routes

- Category route: /savings-investing
- Tool route: /savings-investing/simple-interest-calculator
- Current implemented calculator count (non-coming-soon): 1

## Runtime and Architecture Reality

- Calculator execution for Simple Interest is client-side in the calculator component.
- A server action exists for simple interest calculations but is currently reserved for future use cases.
- Tool and category metadata is centralized in lib/tools-data.ts and consumed by dynamic route pages.
- Financial disclaimer rendering is included in calculator pages.

## Testing and Quality Reality

- Moni-specific unit tests exist for calculator math, tool-data behavior, and search index behavior.
- E2E test suites exist for navigation, SEO, command menu, mobile, and accessibility workflows.

## Known Drift and Gaps

- Legacy Moni docs still contain copied Codemata content and stale framing in places.
- Canonical docs should continue to be updated as additional calculators are implemented.

## Evidence

- [apps/moni/lib/tools-data.ts](apps/moni/lib/tools-data.ts)
- [apps/moni/app/savings-investing/page.tsx](apps/moni/app/savings-investing/page.tsx)
- [apps/moni/app/savings-investing/[slug]/page.tsx](apps/moni/app/savings-investing/[slug]/page.tsx)
- [apps/moni/components/SimpleInterestCalculator.tsx](apps/moni/components/SimpleInterestCalculator.tsx)
- [apps/moni/components/FinancialDisclaimer.tsx](apps/moni/components/FinancialDisclaimer.tsx)
- [apps/moni/app/savings-investing/actions.ts](apps/moni/app/savings-investing/actions.ts)
- [apps/moni/__tests__/simple-interest.test.ts](apps/moni/__tests__/simple-interest.test.ts)
- [apps/moni/__tests__/tools-data.test.ts](apps/moni/__tests__/tools-data.test.ts)
- [apps/moni/__tests__/search-index.test.ts](apps/moni/__tests__/search-index.test.ts)
- [apps/moni/tests/e2e/navigation.spec.ts](apps/moni/tests/e2e/navigation.spec.ts)
- [apps/moni/specs/moni-spec.md](apps/moni/specs/moni-spec.md)
- [README.md](README.md)
