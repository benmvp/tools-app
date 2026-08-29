---
name: backlog-refinement
description: |
  Automates backlog triage for GitHub Projects by assessing feasibility,
  ranking priority, promoting the top item to Planning, and labeling refined
  items with agent-refined.
---

# Backlog Refinement

Use this skill to run a structured backlog triage pass for GitHub issues tracked
in a GitHub Project.

## When to use

- Weekly or sprint-start backlog reviews.
- Manual triage sessions when backlog grows or priorities shift.

## Inputs to collect first

- Repository owner and name.
- GitHub Project number and owner scope.
- Field names for status and priority (for example: `Status`, `Priority`).
- Column value names (for example: `Backlog`, `Planning`).
- Optional cap on how many backlog items to process in one pass.

## Workflow

1. Ensure project metadata exists and field names are correct.
2. Query backlog items in the project.
3. For each item, evaluate feasibility and capture rationale.
4. Rank by priority using impact, effort, urgency, and strategic alignment.
5. Update the project `Priority` field.
6. Promote the top ready item from `Backlog` to `Planning`.
7. Add the `agent-refined` label to processed issues.
8. Return a concise triage summary with actions taken and any blockers.

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

For ties:

- Prefer lower effort.
- If still tied, prefer stronger alignment.
- If still tied, keep stable ordering and note the tie.

## Recommended gh CLI patterns

- Ensure label exists:
  - `gh label create agent-refined --color 0e8a16 --description "Issue triaged by backlog refinement agent" || true`
- Add feasibility comment:
  - `gh issue comment <issue-number> --body "<feasibility-note>"`
- Add label to processed issue:
  - `gh issue edit <issue-number> --add-label agent-refined`

For project field updates and status moves, use `gh project` commands suitable to
the org/user project setup. Validate field and option names before updating.

## Edge cases

- Empty backlog: return a no-op summary.
- Missing priority/status fields: stop and report required setup.
- Missing project write access: stop and report permission error.
- Mixed item types (drafts and issues): only label/comment on issue-backed items.

## Output format

Return a compact report containing:

- Total backlog items reviewed.
- Issues updated with feasibility notes.
- Priority changes made.
- Item promoted to Planning (or reason none was promoted).
- Labels applied.
- Follow-up actions for unresolved risks.