## Context

- **Issue:** #47 — Add docs for each feature
- **Problem statement:** The repo has source-of-truth docs for the app and core workflows, but it still lacks explanatory docs for each feature in `codemata` and `moni`. Without these docs, future maintenance, debugging, and feature changes are harder to reason about and safer changes are harder to make confidently.
- **Desired outcome:** Every feature area in `codemata` and `moni` has a concise, discoverable documentation page placed near the implementation it explains so agents and developers can understand the intended behavior and expected contracts.
- **Why now:** The living-docs foundation already exists, but the coverage is incomplete; this gap becomes more costly as the codebase grows and as more work is delegated to agents.

## Scope

- **In scope:**
  - Audit the feature areas in `codemata` and `moni` that currently lack implementation-adjacent docs.
  - Add or update documentation pages that explain feature purpose, key flows, configuration assumptions, and usage boundaries.
  - Place docs next to the feature implementation when practical so the implementation and its explanation stay aligned.
  - Update the repo-wide knowledge-base or navigation references if needed to make the docs discoverable.
- **Out of scope:**
  - Rewriting unrelated product documentation outside the affected feature areas.
  - Changing runtime behavior or implementing new feature capabilities.
  - Large-scale content restructuring for non-feature docs not directly tied to the existing code.
- **Deferred follow-ups:**
  - Expanding the documentation standard beyond the initial feature set once the first wave is complete.
  - Adding deeper architecture narratives for each app when the feature docs mature.

## Constraints

- **Area ownership:**
  - `codemata` and `moni` feature docs are the primary owners.
  - Repo-level knowledge-base updates should remain minimal and aligned with the existing living-docs pattern.
- **Technical constraints:**
  - Files and docs must match the current repo structure and existing naming conventions.
  - Documentation should be static, text-based, and easy to maintain without requiring build-time generation.
- **Dependency constraints:**
  - No external services or user-facing product changes are required.
  - Work depends on understanding the existing feature implementations and the repo’s current living-docs conventions.
- **Human decisions required:**
  - None required for the initial docs pass; the main decision is which feature areas are considered in-scope for the first iteration.

## Codebase touchpoints

- **Relevant files:**
  - `apps/codemata/README.md`
  - `apps/codemata/specs/`
  - `apps/moni/README.md`
  - `apps/moni/specs/`
  - `apps/codemata/docs/`
  - `apps/moni/docs/`
- **Relevant routes or modules:**
  - `apps/codemata/app/**`
  - `apps/moni/app/**`
  - Feature-specific implementation folders adjacent to the docs being documented
- **Known integration points:**
  - `README.md` and app-level specs provide the project-wide context.
  - Documentation should align with existing design patterns established by the living-docs work in the repo.

## Implementation plan

1. **Phase 1: Inventory and prioritize feature areas**
   - Review the existing `codemata` and `moni` implementations to identify feature areas that need explanatory documentation.
   - Identify which docs should live with the feature implementation and which should be repo-level summaries or links.
   - Confirm the first pass of documentation areas and record the work in a discrete scope set for this issue.
2. **Phase 2: Draft docs for the first pass of features**
   - Add concise docs near the relevant implementation folders.
   - Standardize structure around purpose, behavior, inputs/outputs, constraints, and maintenance notes.
   - Keep the language practical enough for future agent-assisted debugging and change work.
3. **Phase 3: Validate coverage and cross-links**
   - Check that the new docs are discoverable from the main reader entry points and that they do not contradict the current implementation.
   - Update any related README/spec references if needed.
   - Verify the docs are accurate against the implementation and reflect the current repo state.

## Verification plan

- **Automated checks:**
  - Run markdown or repo validation steps already used by the project if relevant.
  - Confirm no broken relative links in the newly added docs.
- **Manual checks:**
  - Review each new doc for factual alignment with the app feature it describes.
  - Verify that the surrounding code and docs are consistent and understandable to a new maintainer or agent.
- **Success signal:**
  - The documentation explains the feature’s purpose, behavior, and constraints without requiring code archaeology.
  - The docs are located next to the relevant feature implementation or are clearly linked from the appropriate app-level docs.

## Knowledge-base and documentation update

- **Docs or knowledge updates required:**
  - Add feature-level explanatory docs for the selected `codemata` and `moni` areas.
  - Update any relevant app-level docs or indexes if the new docs introduce discoverability gaps.
- **Owner / task:**
  - Agent-managed planning and drafting for the initial docs pass, with human review if feature ownership is unclear.
- **Required follow-up via `/living-docs-contract`:** Yes

## Risks and assumptions

- **Risks or unknowns:**
  - Some feature areas may not have a clean or obvious doc boundary, leading to duplicated or overly broad documentation.
  - The repo may contain older features whose intent needs a human confirmation before being documented accurately.
- **Assumptions:**
  - The initial pass should prioritize clarity and coverage over exhaustive documentation of every edge case.
  - The app-level living-docs approach is the intended convention to follow for this work.

## Open questions

1. Which feature areas should be included in the initial docs pass so the work stays well-scoped and actionable?
2. Should the docs live adjacent to the implementation or in a central app-level docs folder for any given feature?

## Ready-for-development checklist

- [x] brief fidelity confirmed
- [x] codebase verification complete
- [x] implementation phases defined
- [x] verification strategy defined
- [x] docs/knowledge updates called out
- [x] scope boundary explicit
