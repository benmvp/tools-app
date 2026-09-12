## Context

- **Issue:** #44 - Remove all iphone 13 e2e tests
- **Problem statement:** The iPhone 13 Playwright project is flaky enough that it fails PRs unrelated to app behavior, including docs-only changes. The noise is worse than the signal and blocks merges.
- **Desired outcome:** Remove all iPhone 13 E2E tests and supporting configuration across all workspaces so the repo runs only trusted desktop suites. Mobile coverage will be rebuilt as separate follow-up work.
- **Why now:** CI trust is currently degraded; PRs that should be low risk are blocked by non-actionable mobile failures, which slows delivery across the project.

## Scope

- **In scope:**
  - Remove the `iphone-13` Playwright project from `apps/codemata/playwright.config.ts` and `apps/moni/playwright.config.ts`.
  - Delete `apps/codemata/tests/e2e/mobile.spec.ts` and `apps/moni/tests/e2e/mobile.spec.ts`.
  - Remove stale `mobile.spec.ts` ignores from desktop project configs and any `isMobile` skip logic that becomes dead code.
  - Update docs and guidance referencing the removed mobile project, including app `README.md` and `TESTING.md` files plus cross-repo workflow guidance in `.github/copilot-instructions.md`.
- **Out of scope:**
  - Rebuilding mobile E2E coverage.
  - Any work in `apps/convertly`, which has no Playwright setup.
  - Workflow changes outside the test configuration and documentation cleanup needed for the removal.
- **Deferred follow-ups:**
  - Create replacement mobile E2E coverage once the project decides on the new mobile test strategy.
  - Track any follow-up automation changes required for future cross-device validation.

## Constraints

- **Area ownership:** cross-app (`codemata` + `moni`), with no single app owning the work exclusively.
- **Technical constraints:** Playwright project configuration is duplicated per app and must be kept in sync; deletion must be consistent across both apps.
- **Dependency constraints:** None. This is a direct cleanup/removal with no external service dependency.
- **Human decisions required:** None for this work. The only known follow-up is a separate decision to rebuild mobile coverage later.

## Codebase touchpoints

- **Relevant files:**
  - `apps/codemata/playwright.config.ts`
  - `apps/moni/playwright.config.ts`
  - `apps/codemata/tests/e2e/mobile.spec.ts`
  - `apps/moni/tests/e2e/mobile.spec.ts`
  - `apps/codemata/tests/e2e/tools/viewers.spec.ts`
  - `apps/codemata/README.md`
  - `apps/codemata/TESTING.md`
  - `apps/moni/README.md`
  - `apps/moni/TESTING.md`
  - `.github/copilot-instructions.md`
- **Relevant routes or modules:** N/A; this is a testing and CI cleanup effort.
- **Known integration points:** Playwright config and repo-level documentation loaded by contributors and CI runners.

## Implementation plan

1. **Phase 1: Remove mobile E2E project definitions**
   - Delete the `iphone-13` project blocks from both app-level Playwright configs.
   - Remove stale ignore rules and any mobile-specific branches that are no longer relevant.
2. **Phase 2: Remove obsolete mobile test files and dead code**
   - Delete `mobile.spec.ts` from both apps.
   - Remove any now-unused mobile guard logic and dead references from related specs.
3. **Phase 3: Update docs and verify the suite**
   - Update app READMEs, testing docs, and project workflow guidance to remove the old mobile E2E references.
   - Run the relevant E2E verification commands and confirm the repo runs without the iPhone 13 project.

## Verification plan

- **Automated checks:**
  - Run the repo’s Playwright E2E checks in the affected apps after the cleanup.
  - Search for remaining `iphone-13` and `mobile.spec.ts` references in the repo.
- **Manual checks:**
  - Review the remaining test matrix to ensure no stale mobile configuration remains in docs or configs.
- **Success signal:**
  - `pnpm test:e2e` passes without the iPhone 13 project configured.
  - No remaining `iphone-13` or `mobile.spec.ts` references remain in the repo’s active config and docs.

## Knowledge-base and documentation update

- **Docs or knowledge updates required:**
  - Update `apps/codemata/README.md` and `apps/codemata/TESTING.md`.
  - Update `apps/moni/README.md` and `apps/moni/TESTING.md`.
  - Update `.github/copilot-instructions.md` to reflect the mobile-free test stack.
- **Owner / task:** Cross-app cleanup; implementation changes must be reviewed by the PR author and the repo owner.
- **Required follow-up via `/living-docs-contract`:** Yes, because the repo docs must reflect the removed mobile suite and the project’s testing guidance.

## Risks and assumptions

- **Risks or unknowns:** Removing the only mobile project leaves no automated mobile regression coverage until replacement work is planned and built.
- **Assumptions:** The intent is a clean slate, not a quarantine. The issue text explicitly calls for a full removal and a separate later rebuild.

## Open questions

1. Should replacement mobile E2E coverage be tracked as a follow-up issue immediately after this cleanup, or is that work intentionally deferred without a formal issue?

## Ready-for-development checklist

- [x] brief fidelity confirmed
- [x] codebase verification complete
- [x] implementation phases defined
- [x] verification strategy defined
- [x] docs/knowledge updates called out
- [x] scope boundary explicit
