---
name: development-validation
description: |
  Validates an implementation in In Development and promotes the issue to
  Code Review only when it satisfies the shared development criteria.
---

# Development Validation

Use this skill as the quality gate that promotes `benmvp/tools-app` issues out
of `In Development` in the `AI Harness` GitHub Project.

This skill owns the `In Development` -> `Code Review` transition. Nothing else
moves items into `Code Review`. It does not perform line-by-line code review;
that happens in `Code Review` itself, by the Copilot reviewer and the human
maintainer.

## When to use

- After `/development` has implemented a spec and updated the PR.
- On a specific issue in `In Development` that needs validation.
- When an implementation is being reworked after failed validation.

## Mandate: validation only

This skill never improves an implementation. It does not:

- write or fix production code
- fill in missing requirements from speculation
- claim the item into `Code Review` review work
- delete the ephemeral spec file (it must survive into `Code Review`)
- perform a full code review (style, naming, alternative approaches); it
  checks spec fidelity and doc currency, not code quality

It validates the implementation and either promotes it or explains the gaps
clearly.

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

Resolve IDs dynamically with `gh` each run:

1. Resolve the project by title.
2. Resolve `Status` field IDs.
3. Resolve the option IDs for `In Development` and `Code Review`.
4. Fail fast if a required project/field/option name is missing.

## Selection

In sweep mode, process an item when either is true:

- `Status="In Development"` and it has `agent-developed` and no
  `validated-development`
- `Status="Code Review"` and it is `stale-development` according to the
  staleness rules in `DEVELOPMENT_CRITERIA.md`

This skill must work from issue-backed project items only. It does not infer
work from PRs or branch names alone. Always skip non-issue or draft items and
note them as skipped.

Always skip items labeled `parked` and note them as skipped.

Exclude `blocked` items from sweep selection. A human may clear the label
after resolving an external dependency; the validator then re-evaluates the
item before it proceeds.

## Workflow

1. Read `.agents/workflow-criteria/DEVELOPMENT_CRITERIA.md`.
2. Discover project and field IDs.
3. Find the selected item.
4. Gather issue context, PR context, and comment history, including any prior
   `<!-- agent:development-deviation -->` notices.
5. Read the spec file, the PR diff, and the tests, and evaluate them against
   each other and the repo.
6. Evaluate every criterion and record the verdict.
7. Decide among pass, fail, or external blocker.
8. Return a compact summary.

## Outcome paths

### Pass

When all criteria pass:

1. Post the pass review comment on the PR using the template in
   `VALIDATION_REPORT_TEMPLATE.md`.
2. Post a confirmation comment on the issue:
   ```markdown
   <!-- agent:development-validation-pass -->
   ## Implementation validated

   - **PR:** #<pr-number>
   - **Verdict:** Pass
   - **Status:** Promoted to `Code Review`
   ```
3. Add `validated-development` and `agent-validated-development` to the issue.
4. Set `Status` to `Code Review`.
5. Keep `Priority` unchanged.
6. Confirm the spec file is still present and current; do not delete it.

### Fail

Any criterion unmet below the threshold:

1. Post a fail review comment on the PR starting with
   `<!-- agent:development-validation-fail round=N -->`.
2. Name every failed criterion and what would resolve it.
3. Post a brief note on the issue:
   ```markdown
   <!-- agent:development-validation-fail round=N -->
   ## Implementation validation failed (Round N)

   - **PR:** #<pr-number>
   - **Verdict:** Fail
   - **Status:** Remains in `In Development` for rework. See PR review comments for details.
   ```
4. Leave the item in `In Development`.
5. Remove `validated-development` if present.
6. Never remove provenance labels.

### Circuit breaker

If this would be the second rejection:

1. Post the fail review comment on the PR noting the circuit breaker tripped.
2. Post an escalation comment on the issue with
   `<!-- agent:development-validation-circuit-breaker -->`.
3. Apply `blocked`.
4. Leave the item in `In Development` and escalate for human input.

Only comments whose marker begins with `<!-- agent:development-validation-fail`
count toward the circuit breaker.

### External blocker

Criteria are met but a dependency on a human or external system remains
unresolved:

1. Post `<!-- agent:development-validation-blocked -->` on the PR and the
   issue.
2. Add `validated-development` and `agent-validated-development`.
3. Apply `blocked`.
4. Set `Status` to `Code Review`.

When the blocker is later resolved, either a human clears `blocked` after
completing the external action or the validator clears it after re-checking
the dependency, then re-runs the evaluation.

## Spec file handling

Never delete the ephemeral spec file at this gate; see
[Ephemeral spec lifecycle](../../workflow-criteria/DEVELOPMENT_CRITERIA.md#ephemeral-spec-lifecycle).
Fail the gate if the file is missing or if it was not updated to reflect a
material deviation already visible in the diff.

## Documentation verification

Do not trust a producer comment claiming docs were updated. Independently
re-read the Current State and Architecture Contracts docs for each touched app
(per `/living-docs-contract`) against the final diff and confirm the factual
claims still hold with evidence links.

## PR review conventions

- Use inline comments on the PR for implementation-review findings.
- Keep issue comments for scope questions and blocker escalation.
- Use the review body to summarize the pass/fail outcome.
- Never use a self-approval or self-request-changes flow for the same author.

## Output format

Return a compact report containing:

- total items reviewed
- pass/fail/block summaries
- criteria verdicts per item
- promoted items to `Code Review`
- blocked items awaiting human input
- labels added or removed
- follow-up actions
