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

## Fixed scope

- Repository: `benmvp/tools-app`.
- Project owner: `benmvp` (user project scope).
- Project title: `AI Harness`.
- Status flow: `Backlog` -> `Planning`.
- Priority field name: `Priority`.
- Refinement label: `agent-refined`.
- Issue type labels: `enhancement`, `bug`, `documentation`, `question`.

Do not prompt for repo, project, field, or column names when running this
skill. These names are fixed and known.

## Runtime discovery (required)

Resolve IDs dynamically with `gh` each run, using the fixed names above:

1. Resolve project by title:
    - `gh project list --owner benmvp --limit 100 --format json`
    - Select the project where `title == "AI Harness"` and capture both:
      - `projectNumber` from `number` (used by `gh project field-list`)
      - `projectId` from `id` (used by `gh project item-edit --project-id`)
2. Resolve field and option IDs:
    - `gh project field-list <projectNumber> --owner benmvp --format json`
    - Capture:
      - `statusFieldId` for field `Status`
      - `backlogOptionId` for option `Backlog`
      - `planningOptionId` for option `Planning`
      - `priorityFieldId` for field `Priority`
      - `p0OptionId`, `p1OptionId`, `p2OptionId` for options `P0`, `P1`, `P2`
3. Fail fast if any required project/field/option name is missing.

## Workflow

1. Discover project and field/option IDs from fixed names.
2. Query `AI Harness` items in `Status=Backlog`, then only process items whose
  linked issue belongs to `benmvp/tools-app`.
3. Skip draft items for labeling/commenting; only mutate issue-backed items.
4. For each item, evaluate feasibility and capture rationale.
5. Rank by priority using impact, effort, urgency, and strategic alignment.
6. Map score to `Priority` and update the project `Priority` field (`P0`/`P1`/`P2`).
7. Add issue-type label (`enhancement`, `bug`, `documentation`, or `question`).
8. Add the `agent-refined` label to processed issues.
9. Promote the highest-priority ready item from `Backlog` to `Planning`.
10. Return a concise triage summary with actions taken and any blockers.

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
  - `gh label list --repo benmvp/tools-app --limit 200`
  - Create missing labels only (no error masking):
    - `gh label create agent-refined --repo benmvp/tools-app --color 7057ff --description "Items that have been analyzed and refined by an AI agent"`
    - `gh label create enhancement --repo benmvp/tools-app --color a2eeef --description "New feature or request"`
    - `gh label create bug --repo benmvp/tools-app --color d73a4a --description "Something isn't working"`
    - `gh label create documentation --repo benmvp/tools-app --color 0075ca --description "Improvements or additions to documentation"`
    - `gh label create question --repo benmvp/tools-app --color d876e3 --description "Further information is requested"`
- Add feasibility comment:
  - `gh issue comment <issue-number> --repo benmvp/tools-app --body "<feasibility-note>"`
- Add labels to processed issue:
  - `gh issue edit <issue-number> --repo benmvp/tools-app --add-label <type-label>,agent-refined`

Set project fields using IDs resolved at runtime:

- Set `Priority`:
  - `gh project item-edit --id <item-id> --project-id <project-id> --field-id <priority-field-id> --single-select-option-id <p0|p1|p2-option-id>`
- Move `Backlog` -> `Planning`:
  - `gh project item-edit --id <item-id> --project-id <project-id> --field-id <status-field-id> --single-select-option-id <planning-option-id>`

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
- Missing project/field/option by name: stop and report exactly which required
  name could not be resolved.
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
