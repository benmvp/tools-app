---
name: spec-validation
description: |
  Validates a draft spec in Planning and promotes the issue to Ready for
  Development only when the spec satisfies the shared spec criteria.
---

# Spec Validation

Use this skill as the quality gate that promotes `benmvp/tools-app` issues out of `Planning` in the `AI Harness` GitHub Project.

This skill owns the `Planning` -> `Ready for Development` transition. Nothing else moves items into `Ready for Development`.

## When to use

- After `/spec` has written a draft spec and opened a reviewable PR.
- On a specific issue in `Planning` that needs validation.
- When a spec is being reworked after failed validation.

## Mandate: validation only

This skill never improves a spec. It does not:

- rewrite the issue or the plan
- fill in missing requirements from speculation
- claim the item into implementation
- bypass the issue/PR split

It validates the spec and either promotes it or explains the gaps clearly.

## Fixed scope

- Repository: `benmvp/tools-app`.
- Project owner: `benmvp` (user project scope).
- Project title: `AI Harness`.

Do not prompt for repo, project, field, or column names.

## Criteria source

Read `.agents/workflow-criteria/SPEC_CRITERIA.md` at the start of every run.

Do not restate or fork the criteria here.

## Runtime discovery (required)

Resolve IDs dynamically with `gh` each run:

1. Resolve the project by title.
2. Resolve `Status` field IDs.
3. Resolve the option IDs for `Planning` and `Ready for Development`.
4. Fail fast if a required project/field/option name is missing.

## Selection

In sweep mode, process an item when either is true:

- `Status=Planning` and it has `agent-specced` and no `validated-spec`
- `Status="Ready for Development"` and it is `stale-spec` according to the staleness rules in `SPEC_CRITERIA.md`

This skill must work from issue-backed project items only. It does not infer work from PRs or branch names. Always skip non-issue or draft items and note them as skipped.

Always skip items labeled `parked` and note them as skipped.

Exclude `blocked` items from sweep selection. A human may clear the label after resolving an external dependency; the validator then re-evaluates the item before it proceeds.

## Workflow

1. Read `.agents/workflow-criteria/SPEC_CRITERIA.md`.
2. Discover project and field IDs.
3. Find the selected item.
4. Gather issue context, PR context, and comment history.
5. Read the spec file and evaluate it against the issue and repo.
6. Evaluate every criterion and record the verdict.
7. Decide among pass, fail, or external blocker.
8. Return a compact summary.

## Outcome paths

### Pass

When all criteria pass:

1. Post the pass review comment on the draft PR using the template in `VALIDATION_REPORT_TEMPLATE.md`.
2. Post a confirmation comment on the issue:
   ```markdown
   <!-- agent:spec-validation-pass -->
   ## Spec validated

   - **Draft PR:** #<pr-number>
   - **Verdict:** Pass
   - **Status:** Promoted to `Ready for Development`
   ```
3. Add `validated-spec` and `agent-validated-spec` to the issue.
4. Set `Status` to `Ready for Development`.
5. Keep `Priority` unchanged.

### Fail

Any criterion unmet below the threshold:

1. Post a fail review comment on the draft PR starting with `<!-- agent:spec-validation-fail round=N -->`.
2. Name every failed criterion and what would resolve it.
3. Post a brief note on the issue:
   ```markdown
   <!-- agent:spec-validation-fail round=N -->
   ## Spec validation failed (Round N)

   - **Draft PR:** #<pr-number>
   - **Verdict:** Fail
   - **Status:** Remains in `Planning` for rework. See PR review comments for details.
   ```
4. Leave the item in `Planning`.
5. Remove `validated-spec` if present.
6. Never remove provenance labels.

### Circuit breaker

If this would be the second rejection:

1. Post the fail review comment on the draft PR noting the circuit breaker tripped.
2. Post an escalation comment on the issue with `<!-- agent:spec-validation-circuit-breaker -->`.
3. Apply `blocked`.
4. Leave the item in `Planning` and escalate for human input.

Only comments whose marker begins with `<!-- agent:spec-validation-fail` count toward the circuit breaker. Ordinary PR review comments or non-machine review feedback do not.

### External blocker

Criteria are met but a dependency on a human or external system remains unresolved:

1. Post `<!-- agent:spec-validation-blocked -->` on the PR and the issue.
2. Add `validated-spec` and `agent-validated-spec`.
3. Apply `blocked`.
4. Set `Status` to `Ready for Development`.

When the blocker is later resolved, either a human clears `blocked` after completing the external action or the validator clears it after re-checking the dependency. The validator then re-runs the evaluation and either continues the normal promotion flow or leaves the item in `Planning` if the spec no longer passes.

## Open questions and human decisions

When the spec needs a human decision on scope or requirements, the producer should post an issue comment with the open-question marker. The validator should judge whether that question blocks the spec, and if so, treat it as an external blocker instead of a validation failure.

## PR review conventions

- Use inline comments on the draft PR for spec-review findings.
- Keep issue comments for scope questions and blocker escalation.
- Use the review body to summarize the pass/fail outcome.
- Never use a self-approval or self-request-changes flow for the same author.

## Non-code implementation work

For operational or platform work, validation still applies. If the work is complete and no mergeable code PR is useful, the PR may be closed without merge after the operational result is complete.

## Output format

Return a compact report containing:

- total items reviewed
- pass/fail/block summaries
- criteria verdicts per item
- promoted items to `Ready for Development`
- blocked items awaiting human input
- labels added or removed
- follow-up actions
