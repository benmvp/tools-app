---
name: backlog-refinement
description: |
  Automates backlog triage for benmvp/tools-app in the AI Harness project by
  assessing feasibility, ranking priority, moving top work from Backlog to
  Planning, and labeling refined items.
---

# Backlog Refinement

Use this skill to run a structured backlog triage pass for issues in
`benmvp/tools-app` tracked in the `AI Harness` GitHub Project.

## When to use

- Weekly or sprint-start backlog reviews.
- Manual triage sessions when backlog grows or priorities shift.

## Hard-coded project context

- Repository: `benmvp/tools-app`.
- Project owner: `benmvp` (user project).
- Project: `AI Harness` (`number: 1`, `id: PVT_kwHOAFcyLs4BhP3X`).
- Status field: `Status` (`id: PVTSSF_lAHOAFcyLs4BhP3XzhgMSQM`).
- Backlog option: `Backlog` (`id: f75ad846`).
- Planning option: `Planning` (`id: 47fc9ee4`).
- Priority field: `Priority` (`id: PVTSSF_lAHOAFcyLs4BhP3XzhgMSXI`).
- Priority options: `P0` (`79628723`), `P1` (`0a877460`), `P2` (`da944a9c`).
- Refinement label: `agent-refined`.
- Issue type labels used by this repo: `enhancement`, `bug`, `documentation`, `question`.

Do not prompt for repo, project, or column inputs when running this skill.

## Workflow

1. Query `AI Harness` items where `Repository=benmvp/tools-app` and `Status=Backlog`.
2. Skip draft items for labeling/commenting; only mutate issue-backed items.
3. For each item, evaluate feasibility and capture rationale.
4. Rank by priority using impact, effort, urgency, and strategic alignment.
5. Map score to `Priority` and update the project `Priority` field (`P0`/`P1`/`P2`).
6. Add issue-type label (`enhancement`, `bug`, `documentation`, or `question`).
7. Add the `agent-refined` label to processed issues.
8. Promote the highest-priority ready item from `Backlog` to `Planning`.
9. Return a concise triage summary with actions taken and any blockers.

## Feasibility rubric

Score each issue on:

- Technical complexity: Low, Medium, High.
- Dependencies: None, Internal, External.
- Clarity: Well-defined, Needs scope clarification.
- Alignment: Strong, Moderate, Weak.

Include a short feasibility note on each issue with:

- Suggested approach.
- Risks or unknowns.
- Minimum next step to de-risk.

## Priority rubric

Use a simple weighted model:

- Impact: 1-5.
- Urgency: 1-5.
- Strategic alignment: 1-5.
- Effort cost: 1-5 (higher means harder).

Suggested formula:

`priorityScore = impact + urgency + strategicAlignment - effortCost`

Priority mapping:

- `P0`: score >= 8.
- `P1`: score 5-7.
- `P2`: score <= 4.

For ties:

- Prefer lower effort.
- If still tied, prefer stronger alignment.
- If still tied, keep stable ordering and note the tie.

## Recommended gh CLI patterns

- Ensure labels exist:
  - `gh label create agent-refined --color 7057ff --description "Items that have been analyzed and refined by an AI agent" || true`
  - `gh label create enhancement --color a2eeef --description "New feature or request" || true`
  - `gh label create bug --color d73a4a --description "Something isn't working" || true`
  - `gh label create documentation --color 0075ca --description "Improvements or additions to documentation" || true`
  - `gh label create question --color d876e3 --description "Further information is requested" || true`
- Add feasibility comment:
  - `gh issue comment <issue-number> --body "<feasibility-note>"`
- Add labels to processed issue:
  - `gh issue edit <issue-number> --add-label <type-label>,agent-refined`

Set project fields by ID (single-select option IDs):

- Set `Priority`:
  - `gh project item-edit --id <item-id> --project-id PVT_kwHOAFcyLs4BhP3X --field-id PVTSSF_lAHOAFcyLs4BhP3XzhgMSXI --single-select-option-id <79628723|0a877460|da944a9c>`
- Move `Backlog` -> `Planning`:
  - `gh project item-edit --id <item-id> --project-id PVT_kwHOAFcyLs4BhP3X --field-id PVTSSF_lAHOAFcyLs4BhP3XzhgMSQM --single-select-option-id 47fc9ee4`

## Issue type label classification

Assign exactly one type label per processed issue using this order:

1. `bug`: Repro steps, regression, incorrect behavior, failure, crash, or broken output.
2. `documentation`: Docs, README, guides, examples, wording, or reference updates.
3. `question`: Primarily requesting clarification/decision rather than implementation.
4. `enhancement`: New capability, refactor, automation, or workflow improvement.

If multiple categories appear, choose the first matching rule above and note why
in the feasibility comment.

## Edge cases

- Empty backlog: return a no-op summary.
- Missing configured fields/options: stop and report mismatch against the hard-coded IDs.
- Missing project write access: stop and report permission error.
- Mixed item types (drafts and issues): only label/comment on issue-backed items.

## Output format

Return a compact report containing:

- Total backlog items reviewed.
- Issues updated with feasibility notes.
- Priority changes made.
- Item promoted to Planning (or reason none was promoted).
- Labels applied (`agent-refined` and issue-type labels).
- Follow-up actions for unresolved risks.
