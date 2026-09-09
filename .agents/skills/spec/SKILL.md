---
name: spec
description: |
  Claims a validated issue from Ready for Planning, writes a draft spec in an
  agent-owned planning folder, and opens a draft PR to review the specification
  before implementation begins.
---

# Spec

Use this skill to turn a validated backlog item into a concrete implementation plan and a reviewable draft PR. This stage owns the `Ready for Planning` -> `Planning` transition.

## When to use

- After `/refinement-validation` has promoted an issue to `Ready for Planning`.
- For a single issue that is already validated and ready to spec.
- When an issue needs a concrete implementation plan and a reviewable PR before development starts.

## Mandate: spec creation

This skill creates the spec artifact and the draft PR, but it does not implement the feature itself. It does not:

- write production code
- change the issue body
- claim more than one item in a single run
- move an item into `Ready for Development` without validator approval

It does claim the item into `Planning` by creating a PR-backed working artifact.

## Fixed scope

- Repository: `benmvp/tools-app`.
- Project owner: `benmvp` (user project scope).
- Project title: `AI Harness`.

Do not prompt for repo, project, field, or column names.

## Criteria source

Read `.agents/workflow-criteria/SPEC_CRITERIA.md` at the start of every run.

Do not restate or fork the criteria here.

## Runtime discovery (required)

Resolve project and field IDs dynamically with `gh` each run:

1. Resolve the project by title.
2. Resolve the field IDs for `Status`.
3. Resolve option IDs for `Ready for Planning` and `Planning`.
4. Resolve the field ID and option values for `Priority` so eligible issues can be ordered deterministically.
5. Fail fast if a required project, field, or option name is missing.

## Selection

Process a single item when:

- `Status="Ready for Planning"`
- issue is in `benmvp/tools-app`
- label `validated-refinement` is present
- `blocked` is absent
- `parked` is absent

This skill must work from issue-backed project items only. It never starts from a branch, PR, or review thread. If a project item is not issue-backed, it is not eligible.

If multiple items qualify, pick the one with the highest `Priority` value, then the oldest `createdAt`.

## Issue-to-PR linkage

The producer must map the issue to a single draft PR for that issue:

- find the issue-backed project item by `Status="Ready for Planning"`
- ensure the local base is fresh from `origin/main` before creating the branch (`git fetch origin main && git checkout -b <type>/<issue-number>-<slug> origin/main`)
- create the draft PR and link it back to the issue in the PR body
- include `Refs #<issue-number>` rather than a closing keyword during the planning stage
- include `<!-- agent:spec-pr issue=<number> -->` at the top of the PR body
- post an official linkage comment on the issue noting the draft PR and spec artifact
- apply relevant area and type labels from the issue to the draft PR

The issue remains the canonical tracker. The PR is the review artifact for the spec.

## Workflow

1. Read `.agents/workflow-criteria/SPEC_CRITERIA.md`.
2. Discover the project and field IDs.
3. Select the highest-priority eligible issue-backed item.
4. Fetch `origin/main` and create or reuse the issue-linked branch: `<type>/<issue-number>-<slug>`.
5. Create the ephemeral spec file under `.agents/plans/`.
6. Push the spec commit with `[skip ci]` to avoid unnecessary CI during planning.
7. Create the draft PR with matching type prefix (e.g., `chore: ...` for `chore/` branch, `feat: ...` for `feat/` branch) and link the spec file in the PR body.
8. Add labels matching the issue's type and area to the draft PR.
9. Post an issue comment notifying that the draft PR was created:
   ```markdown
   <!-- agent:spec-created pr=<pr-number> -->
   ## Spec created & draft PR opened

   - **Draft PR:** #<pr-number>
   - **Branch:** `<branch-name>`
   - **Spec Artifact:** [.agents/plans/<issue-number>-<slug>.md](.agents/plans/<issue-number>-<slug>.md)
   - **Status:** Moved to `Planning` for validation review.
   ```
10. Read issue comments and PR review comments before reworking the spec.
11. Post an issue comment when the spec requires human answer on scope, not for routine review chatter.
12. Move the project item from `Ready for Planning` to `Planning` only after the PR and issue comment exist.
13. Add `agent-specced` label to the issue.
14. Return a compact summary.

## File layout

Use a flat, area-agnostic directory for ephemeral specs:

```text
.agents/plans/
  54-regex-tester.md
  123-firebase-auth-setup.md
```

Do not place ephemeral specs under app-level `specs/` folders; they are intentionally temporary artifacts.

## Spec template

Use `.agents/skills/spec/SPEC_TEMPLATE.md` as the starting point for the draft spec.

The spec must include:

- problem statement and scope summary
- desired outcome
- out-of-scope items
- technical constraints
- implementation phases
- verification strategy
- doc/knowledge-base tasks
- open questions or blocker notes

## PR conventions and lifecycle

- Use a draft PR from the selected issue's branch.
- PR title prefix must match the branch type (e.g., `chore: remove iphone 13 e2e tests` for `chore/44-remove-iphone-13-e2e-tests`).
- Apply relevant type and area labels from the issue to the PR.
- PR body structure for Planning stage:
  ```markdown
  <!-- agent:spec-pr issue=<number> -->

  ## Plan stage

  Refs #<number>

  Spec: [.agents/plans/<issue-number>-<slug>.md](.agents/plans/<issue-number>-<slug>.md)

  ## Initial summary

  <1-2 sentence overview of proposed approach>
  ```
- Avoid redundant adjacent issue citations in the PR body.
- Do not use closing keywords such as `Closes #<number>` while the issue is still in `Planning`.

### PR Lifecycle across stages:
1. **Planning Stage (`/spec`):** PR is draft, containing only the spec file in `.agents/plans/` and referencing the issue with `Refs #<number>`.
2. **Development Stage:** The developer or implementation skill writes code, adds unit/integration tests, removes draft status, updates the PR title and description with the full implementation details, and uses `Closes #<number>` / `Fixes #<number>`.
3. **Pre-Merge Cleanup:** Before the implementation PR is merged, the temporary `.agents/plans/<issue-number>-<slug>.md` file **must be deleted** so ephemeral planning artifacts are not merged into `main`.

## Open question handling

If a human answer is required before the spec can be trusted, post a comment on the issue with a clear owner and change the item to the appropriate blocked path.

This is not a validation failure. It is a genuine scope or decision dependency.

When the blocker is resolved, the validator removes `blocked` and re-runs validation. A human may also clear `blocked` after resolving an external dependency they own, and the validator still re-checks the spec before continuing. The producer does not clear blockers directly.

## PR review comment handling

The producer must read both issue comments and PR review comments before reworking the spec:

- issue comments carry scope and human decision inputs
- PR review comments carry spec correctness and implementation-feedback inputs
- routine PR comments do not count toward the spec rejection breaker
- only machine-authored validation fail markers count for the rejection threshold

## Non-code implementation work

For operational work, still create the planning artifact and draft PR, but do not assume a mergeable code PR is required. When the task is complete, the PR may be closed without merge.

## Output format

Return a compact report containing:

- selected issue number and title
- branch name
- PR URL or draft PR status
- spec file path
- project item status change
- any open question or blocker captured on the issue
- follow-up actions
