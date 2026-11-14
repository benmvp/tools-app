---
name: development
description: |
  Claims a validated spec from Ready for Development, implements it against
  the ephemeral spec file, updates docs, and moves the item to In Development
  for review.
---

# Development

Use this skill to turn a validated spec into a real implementation on the
issue's existing draft PR. This stage owns the
`Ready for Development` -> `In Development` transition.

## When to use

- After `/spec-validation` has promoted an issue to `Ready for Development`.
- For a single issue that already has a spec file and a linked draft PR.
- When an issue's implementation needs to start or continue.

## Mandate: implementation only

This skill writes the actual code, tests, and docs for the issue, but it does
not:

- validate its own work (that is `/development-validation`'s job)
- perform code review or respond to reviewer feedback (a future stage's job)
- delete the ephemeral spec file (see [Ephemeral spec lifecycle](../../workflow-criteria/DEVELOPMENT_CRITERIA.md#ephemeral-spec-lifecycle))
- move the item into `Code Review` without validator approval
- claim more than one item in a single run

## Fixed scope

- Repository: `benmvp/tools-app`.
- Project owner: `benmvp` (user project scope).
- Project title: `AI Harness`.

Do not prompt for repo, project, field, or column names.

## Criteria source

Read `.agents/workflow-criteria/DEVELOPMENT_CRITERIA.md` at the start of every
run.

Do not restate or fork the criteria here.

## Runtime discovery (required)

Resolve project and field IDs dynamically with `gh` each run:

1. Resolve the project by title.
2. Resolve the field IDs for `Status`.
3. Resolve option IDs for `Ready for Development` and `In Development`.
4. Resolve the field ID and option values for `Priority` so eligible issues can
   be ordered deterministically.
5. Fail fast if a required project, field, or option name is missing.

## Selection

Process a single issue-backed item in `benmvp/tools-app` when either:

- `Status="Ready for Development"`, `validated-spec` is present, and both
    `blocked` and `parked` are absent.
- `Status="In Development"`, `implementation-pending` is true according to
    `DEVELOPMENT_CRITERIA.md`, both `blocked` and `parked` are absent, and the
    rejection threshold has not been reached.

This skill must work from issue-backed project items only. If multiple items
qualify, pick the one with the highest `Priority` value, then the oldest
`createdAt`.

## Workflow

1. Read `.agents/workflow-criteria/DEVELOPMENT_CRITERIA.md`.
2. Discover the project and field IDs.
3. Select the highest-priority eligible issue-backed item.
4. Check out the issue's existing branch (created by `/spec`) and pull the
    linked PR; do not create a new branch or a new PR. The PR may already be
    ready for review after a prior implementation pass; do not require it to be
    a draft or change its draft state during rework.
5. Read the spec file at `.agents/plans/<issue-number>-<slug>.md`, the issue,
   and all issue/PR comments for context.
6. Set `Status` to `In Development`.
7. Post an issue comment starting with
    `<!-- agent:development-started issue=N -->` to mark this claim or resume.
8. Implement each phase in the spec's implementation plan, in order.
9. If the actual implementation must diverge from the spec (a scope, behavior,
   or approach change), update the spec file to reflect reality as you go. If
   the deviation is material (changes what the issue author should expect),
   also post an issue comment starting with
   `<!-- agent:development-deviation -->` explaining what changed and why.
   Trivial implementation-detail changes do not need an issue comment.
10. Add or update tests per the spec's verification plan.
11. Run `/living-docs-contract` for any app whose behavior changed, updating
    Current State and Architecture Contracts docs with evidence links.
12. Run `/check-repo` (`pnpm format`, `pnpm lint -- --write`,
    `pnpm type-check`) once, after all edits are made.
13. Update the PR: remove draft status if it is still a draft, rewrite the
    description with the real implementation summary and testing evidence, and
    change `Refs #N` to `Closes #N` / `Fixes #N`.
14. Do not delete the spec file. It must remain accurate and present for
    `/development-validation` and the future Code Review stage.
15. Add the `agent-developed` label to the issue.
16. Post a completion comment with the marker
    `<!-- agent:development-ready issue=N -->` and a short note that the PR is
    ready for validation. Post this after each initial implementation or rework
    pass; it is the validator's signal that work completed after the latest
    failure.
17. Return a compact summary.

## Handling prior rejections

If the latest issue comment whose marker begins with
`<!-- agent:development-validation-fail` exists, read it and address every
cited gap explicitly before re-requesting validation. Do not silently
re-request validation while a cited gap is unaddressed.

## Open question handling

If a human answer is required before implementation can proceed (for example
a spec ambiguity only discovered while coding), post an issue comment stating
the open question and its owner, and apply `blocked` while awaiting the
answer. This is not a validation failure; it is a genuine dependency.

## Non-code implementation work

For operational work (see `SPEC_CRITERIA.md`'s non-code implementation
section), still implement against the spec and update the PR, but do not
assume a mergeable code PR is required.

## Output format

Return a compact report containing:

- selected issue number and title
- branch and PR reference
- phases completed
- deviations recorded, and where (spec file only, or also an issue comment)
- docs updated via `/living-docs-contract`
- repo checks run and their result
- project item status change
- any open question or blocker captured on the issue
- follow-up actions
