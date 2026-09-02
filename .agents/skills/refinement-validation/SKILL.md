---
name: refinement-validation
description: |
  Validates that refined issues in the Backlog column of the AI Harness project
  meet the refinement criteria. Passing items are promoted to Ready for Planning
  with the validated-refinement label; failing items stay in Backlog with a
  comment explaining the gaps.
---

# Refinement Validation

Use this skill as the quality gate that promotes `benmvp/tools-app` issues out of
`Backlog` in the `AI Harness` GitHub Project.

This skill owns the `Backlog` -> `Ready for Planning` transition. Nothing else
moves items into `Ready for Planning`, which is what makes that column mean
"certified ready, nobody has started".

## When to use

- After a `/backlog-refinement` run, to gate what it refined.
- On a specific issue you refined or wrote by hand and want promoted.
- Before running the speccing skill, so it only consumes validated items.

## Mandate: validation only

This skill **never** improves an issue. It does not:

- Rewrite or extend a Planning Brief.
- Fill in missing scope, approach, priority, or constraints.
- Edit the issue body.
- Re-run feasibility analysis or re-score priority.

If a required piece of information can only be supplied by inventing it, that is
the gap. Report it and fail the item.

The one exception is the brief-shaped summary for items with no Planning Brief
(see [Items without a Planning Brief](#items-without-a-planning-brief)), which
restates information that already exists and must cite its source for every
field.

Validation is the only stage permitted to set `Status` on these items, and only
along the transitions in [Outcome paths](#outcome-paths).

## Fixed scope

- Repository: `benmvp/tools-app`.
- Project owner: `benmvp` (user project scope).
- Project title: `AI Harness`.

Do not prompt for repo, project, field, or column names. These are fixed.

## Criteria source

The pass/fail bar lives in `.agents/workflow-criteria/REFINEMENT_CRITERIA.md`.

Read that file at the start of every run. Do not restate, summarize, or fork the
criteria inside this skill. It also defines column ownership, label semantics,
comment markers, staleness, and rejection loop protection, all of which this
skill depends on.

## Runtime discovery (required)

Resolve IDs dynamically with `gh` each run:

1. Resolve project by title:
    - `gh project list --owner benmvp --limit 100 --format json`
    - Select the project where `title == "AI Harness"` and capture:
      - `projectNumber` from `number` (used by `gh project field-list`)
      - `projectId` from `id` (used by `gh project item-edit --project-id`)
2. Resolve field and option IDs:
    - `gh project field-list <projectNumber> --owner benmvp --format json`
    - Capture:
      - `statusFieldId` for field `Status`
      - `backlogOptionId` for option `Backlog`
      - `readyForPlanningOptionId` for option `Ready for Planning`
3. Fail fast if any required project/field/option name is missing.

Resolve option IDs by name every run. They are not stable; editing the `Status`
field's options regenerates them.

## Invocation modes

- **Sweep (default):** audit everything matching [Selection](#selection).
- **Single item:** given an issue number, audit only that issue. Verify it is in
  `Backlog` or `Ready for Planning`; if it is anywhere else, stop and report its
  real status.

## Selection

In sweep mode, process an item when either is true:

- `Status=Backlog`, it has `agent-refined`, and it does not have
  `validated-refinement`. This is the normal promotion path.
- `Status=Ready for Planning` and it is **stale** per the staleness rule in the
  criteria file. This is the regression path: something changed after the item
  was certified.

Always skip items labeled `parked`, in every mode, and note them as skipped.
Never add or remove `parked`.

Skip everything else. Re-validating unchanged items produces duplicate comments.

In single-item mode, always process, even if already validated, and even without
`agent-refined`. That is how a hand-written issue gets promoted.

Only process issue-backed items in `benmvp/tools-app`. Skip draft items and
issues from other repositories, and note them in the summary.

## Workflow

1. Read `.agents/workflow-criteria/REFINEMENT_CRITERIA.md`.
2. Discover project and field/option IDs.
3. Query items and apply the selection rules above.
4. For each selected issue, gather input:
    - Issue title, body, labels, and `Priority` field value.
    - `createdAt` and `lastEditedAt` via GraphQL.
    - Full comment history, oldest to newest.
    - The latest `<!-- agent:planning-brief -->` comment, if any.
    - All `<!-- agent:validation-fail -->` markers, to get the rejection count.
5. Run [codebase verification](#codebase-verification).
6. Evaluate every criterion, recording a verdict and the evidence behind it.
  Refer to criteria by name, never by position.
7. Take the outcome path: [pass](#pass), [fail](#fail), or
  [external blocker](#external-blocker).
8. Return a [summary](#output-format).

Read the **full** comment history, not just the brief. Human replies to a prior
rejection are frequently where the missing scope decision actually lives, and an
item can satisfy the criteria across body plus comments even when the body alone
is thin.

## Codebase verification

The **Codebase verification** criterion requires checking claims against the
repository. Keep this bounded to two checks:

- **Existence:** every referenced file path, directory, symbol, route, package,
  or script actually exists. A hallucinated path is an automatic failure.
- **Contradiction:** no claim is refuted by current code. The common cases are
  proposing something already implemented, describing an architecture the code
  does not have, or targeting a file whose responsibility has moved.

Do not extend this into independent feasibility analysis or approach design.
That is `backlog-refinement`'s job, and duplicating it makes this gate too
expensive to run often.

Record each checked claim and its result in the validation comment.

## Outcome paths

### Pass

All criteria met and no external blocker:

1. Post the pass comment from `VALIDATION_REPORT_TEMPLATE.md`, starting with
  `<!-- agent:validation-pass -->`.
2. Add `validated-refinement` and `agent-validated-refinement`.
3. Set `Status` to `Ready for Planning`. If the item is already there (regression
  path), leave it. Leave `Priority` untouched.

### Fail

Any criterion unmet, and the rejection count is below 3:

1. Post the fail comment, starting with
  `<!-- agent:validation-fail round=N -->` where `N` is this rejection's 1-based
  number.
2. Name every failed criterion, the specific gap, and what would resolve it.
  "Scope is unclear" is not actionable; "scope does not say whether existing
  issues get backfilled" is.
3. Set `Status`:
    - Already in `Backlog`: **change nothing**. Failure is not a move, and the
      item is already in the column where rework happens.
    - In `Ready for Planning` (regression path): demote to `Backlog`.
4. Remove `validated-refinement` if present.
5. **Never** remove provenance labels. `agent-refined` stays, because the agent
  did in fact refine it. Whether the item needs re-refinement is derived from
  `Status = Backlog AND no validated-refinement`.

### Circuit breaker

If this would be the **third** rejection:

1. Post the fail comment noting the circuit breaker tripped.
2. Apply `blocked`.
3. Leave the item in `Backlog`, and demote it there if it was in
  `Ready for Planning`.
4. Escalate in the run summary: the remaining gaps need human input, and further
  agent refinement will not resolve them.

The `blocked` label is what stops `/backlog-refinement` from looping on it, since
no amount of further refinement will close the gaps.

### External blocker

Criteria are met but an unresolved external dependency exists:

1. Post the comment starting with `<!-- agent:validation-blocked -->`, naming the
  blocker and who or what must resolve it.
2. Add `validated-refinement` and `agent-validated-refinement`. The refinement is
  genuinely valid; only the work is waiting.
3. Apply `blocked`.
4. Set `Status` to `Ready for Planning`, exactly as a normal pass.

Downstream stages skip it via `-label:blocked`. Do not withhold the gate label to
achieve that; gate labels answer the quality question only.

## Items without a Planning Brief

An issue written by hand and validated in single-item mode has no Planning Brief.
Evaluate the issue body and comments against the same criteria; a well-written
issue can pass without ever having been agent-refined.

When such an item passes, the pass comment must include a brief-shaped summary so
downstream consumers get the same structure regardless of how the item arrived.

The summary is subject to a hard rule:

- **Restating is allowed.** Reorganizing information already present in the issue
  body or comments into the brief's structure.
- **Originating is forbidden.** Supplying scope, approach, priority, or
  constraints that appear nowhere.
- **Every field must cite its source**, for example `issue body`,
  `comment by @benmvp`. A field that cannot be cited must not be written; its
  absence is a gap, and the item fails.
## Report template

Follow `.agents/skills/refinement-validation/VALIDATION_REPORT_TEMPLATE.md`.

All output goes into comments. Never edit the issue body.

## Recommended gh CLI patterns

Read issue with labels and comments:

```sh
GH_PROMPT_DISABLED=1 GH_PAGER=cat PAGER=cat gh issue view <issue-number> \
  --repo benmvp/tools-app --json number,title,body,labels,comments,createdAt
```

Read `lastEditedAt` (not available via `gh issue view`):

```sh
GH_PROMPT_DISABLED=1 GH_PAGER=cat PAGER=cat gh api graphql -f query='
  query($number: Int!) {
    repository(owner: "benmvp", name: "tools-app") {
      issue(number: $number) { createdAt lastEditedAt }
    }
  }' -F number=<issue-number>
```

Post a validation comment:

```sh
GH_PROMPT_DISABLED=1 GH_PAGER=cat PAGER=cat gh issue comment <issue-number> \
  --repo benmvp/tools-app --body-file <path>
```

Label changes:

```sh
# Pass or external blocker
gh issue edit <issue-number> --repo benmvp/tools-app \
  --add-label validated-refinement,agent-validated-refinement

# Fail: remove state label only, never provenance
gh issue edit <issue-number> --repo benmvp/tools-app \
  --remove-label validated-refinement

# Blocked or circuit breaker
gh issue edit <issue-number> --repo benmvp/tools-app --add-label blocked
```

Promote `Backlog` -> `Ready for Planning`:

```sh
gh project item-edit --id <item-id> --project-id <project-id> \
  --field-id <status-field-id> \
  --single-select-option-id <ready-for-planning-option-id>
```

Demote `Ready for Planning` -> `Backlog` (regression path only):

```sh
gh project item-edit --id <item-id> --project-id <project-id> \
  --field-id <status-field-id> --single-select-option-id <backlog-option-id>
```

Use `--body-file` rather than `--body` for validation comments. They contain
Markdown tables and HTML markers that are awkward to escape inline.

## Edge cases

- **Nothing selected:** return a no-op summary listing what was skipped and why.
- **Draft project items:** skip; never comment or label.
- **Issues from other repositories:** skip; note in the summary.
- **`parked` item:** skip in every mode, including single-item mode. Report it as
  skipped and state that a human must remove `parked` first.
- **Single-item mode on an issue outside `Backlog` or `Ready for Planning`:**
  stop, report actual status, mutate nothing.
- **Item in `Backlog` without `agent-refined`:** not selected in sweep mode. In
  single-item mode, evaluate it normally as an item with no Planning Brief.
- **Issue already has `blocked` and the blocker is now resolved:** remove
  `blocked` and continue normal evaluation.
- **Missing project/field/option by name:** stop and report exactly which name
  could not be resolved.
- **Missing project write access:** stop and report the permission error.
- **Item with neither a brief nor a substantive body:** normal failure path. Cite
  which criteria have no supporting information at all.
- **Unmarked Planning Brief:** briefs written before the marker convention have
  no `<!-- agent:planning-brief -->` line. Fall back to matching a comment whose
  first heading is `Planning Brief`, evaluate it normally, and note the missing
  marker in the validation comment.

## Output format

Return a compact report containing:

- Total items reviewed, and how many were skipped (with reasons, including
  `parked`).
- Per issue: pass / fail / blocked, and the per-criterion verdicts.
- Codebase verification findings, especially hallucinated or contradicted claims.
- Items promoted to `Ready for Planning`.
- Items left in `Backlog` after failing, and items demoted from
  `Ready for Planning`.
- Items where the circuit breaker tripped and human input is required.
- Labels added or removed, per issue.
- Items validated from body alone, with no Planning Brief.
- Follow-up actions.
