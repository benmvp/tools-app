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
4. Fail fast if a required project/field/option name is missing.

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
- create or reuse the branch `<type>/<issue-number>-<slug>`
- create the draft PR and link it back to the issue in the PR body
- include `Refs #<issue-number>` rather than a closing keyword
- include `<!-- agent:spec-pr issue=<number> -->` in the PR body

The issue remains the canonical tracker. The PR is the review artifact for the spec.

## Workflow

1. Read `.agents/workflow-criteria/SPEC_CRITERIA.md`.
2. Discover the project and field IDs.
3. Select the highest-priority eligible issue-backed item.
4. Create or reuse the issue-linked branch name: `<type>/<issue-number>-<slug>`.
5. Create the ephemeral spec file under `.agents/plans/`.
6. Create the draft PR and add the issue reference in the PR body.
7. Read issue comments and PR review comments before reworking the spec.
8. Post an issue comment when the spec requires human answer on scope, not for routine review chatter.
9. Move the project item from `Ready for Planning` to `Planning` only after the PR exists.
10. Push the spec commit with `[skip ci]` to avoid CI during the planning phase.
11. Return a compact summary.

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

## PR conventions

- Use a draft PR from the selected issue's branch.
- PR title should reflect the eventual implementation, e.g. `feat: add regex tester tool`.
- PR body should include:
  - issue reference (`Refs #<number>`)
  - link to the spec file
  - plan stage note
  - initial summary placeholder
- Use `<!-- agent:spec-pr -->` at the top of the PR body so later skills can find it reliably.
- Do not use a closing keyword such as `Closes #<number>` while the issue is still in `Planning`.

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
