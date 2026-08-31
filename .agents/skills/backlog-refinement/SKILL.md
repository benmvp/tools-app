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
- Refinement provenance label: `agent-refined`.
- Gate state label (read-only here): `validated-refinement`.
- Blocked label: `blocked` (external blockers only).
- Issue type labels: `enhancement`, `bug`, `documentation`, `question`.
- App labels: `codemata`, `moni`, `convertly`.

Do not prompt for repo, project, field, or column names when running this
skill. These names are fixed and known.

## Criteria source

The bar for promoting `Backlog` -> `Planning` lives in
`.agents/workflow-criteria/REFINEMENT_CRITERIA.md`. Read it at the start of every
run.

That file is the single source of truth for the criteria, label semantics,
comment markers, staleness, and rejection loop protection. Do not restate or fork
it here.

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

1. Read `.agents/workflow-criteria/REFINEMENT_CRITERIA.md`.
2. Discover project and field/option IDs from fixed names.
3. Query `AI Harness` items in `Status=Backlog` that do **not** have
  `validated-refinement`, then only process items whose linked issue belongs to
  `benmvp/tools-app`.
4. Skip draft items for labeling/commenting; only mutate issue-backed items.
5. Read the full comment history for each item, oldest to newest, including any
  prior Planning Brief and validation comments. See
  [Reading prior comments](#reading-prior-comments).
6. Analyze relevant codebase areas to reduce unknowns and produce actionable
  de-risk next steps.
7. Evaluate feasibility and capture rationale.
8. Rank by priority using impact, effort, urgency, and strategic alignment.
9. Post a structured refinement comment using the Planning Brief template,
  starting with the `<!-- agent:planning-brief -->` marker.
10. Map score to `Priority` and update the project `Priority` field (`P0`/`P1`/`P2`).
11. Add issue-type label (`enhancement`, `bug`, `documentation`, or `question`).
12. Add the `agent-refined` label to processed issues.
13. If the issue maps to a specific app, add exactly one app label (`codemata`,
  `moni`, or `convertly`) if it is not already present.
14. Promote the highest-priority ready item from `Backlog` to `Planning` only
  when the refinement criteria are met.
15. If the criteria are not met, leave the item in `Backlog` and record the
  unmet criteria in the Planning Brief. Do **not** apply `blocked`; that label
  is only for external blockers.
16. Return a concise triage summary with actions taken and any blockers.

This skill promotes items but does not validate them. Promoted items sit in
`Planning` without `validated-refinement` until `/refinement-validation` runs,
which is the expected intermediate state.

## Reading prior comments

Read every comment before refining, not just the issue body. Human replies often
contain the scope decisions the body lacks, and a prior rejection is the highest
signal input available.

Use the HTML markers defined in the criteria file to locate machine-authored
comments. Never match on comment prose; wording changes, markers do not.

When a `<!-- agent:validation-fail -->` comment exists:

1. Take the most recent one and treat every gap it cites as a required input.
2. Address each gap explicitly in the new Planning Brief.
3. Do **not** re-promote the item while any cited gap is unaddressed. Re-posting
  a near-identical brief just gets the item kicked back again.
4. If a gap can only be answered by a human, say so in the brief and leave the
  item in `Backlog` rather than promoting it.

## Planning Brief template

Closely follow the Planning Brief template file at:

- `.agents/skills/backlog-refinement/PLANNING_BRIEF_TEMPLATE.md`

Write all refinement output into issue comments only. Do not edit the issue body.

Start the Planning Brief comment with the `<!-- agent:planning-brief -->` marker
so `/refinement-validation` and the speccing skill can locate it.

## Refinement criteria

See `.agents/workflow-criteria/REFINEMENT_CRITERIA.md`. Evaluate every criterion
and record the verdict in the Planning Brief.

If any criterion fails, keep the item in `Backlog` and record which criteria are
unmet and what would resolve them. Do not apply `blocked` for underspecified
items; an underspecified item is a column problem, not a label problem.

Apply `blocked` only for an unresolved external dependency, as defined in the
criteria file.

## Follow-up proposals

When refinement excludes work that must still happen, for example capability this
issue removes or defers, record it as a follow-up proposal block in the Planning
Brief.

Do not create the issue. Proposals are materialized separately. See
`.agents/workflow-criteria/REFINEMENT_CRITERIA.md` for the format and the rule on
when a follow-up qualifies.

## Open Questions

Use this section to capture unresolved decisions or clarifications that block
spec accuracy or implementation confidence. Each question should have a clear
owner.

## Decision log

Use this section to record key triage decisions and tradeoffs made during
refinement so future reviewers can understand why a direction was chosen.

## Ready-for-spec details

Include these only when relevant to the issue:

- Existing architecture touchpoints.
- Non-functional requirements.
- Analytics and observability expectations.
- Rollout and migration constraints.
- Ready-for-spec checklist (pass/fail).

These details are not mandatory for every item, but when applicable they should
be explicit before spec drafting.

## Comment formatting rules

Follow the shared formatting rules in
`.agents/workflow-criteria/REFINEMENT_CRITERIA.md`.

## Feasibility rubric

Score each issue on:

- Technical complexity: Low, Medium, High.
- Dependencies: None, Internal, External.
- Clarity: Well-defined, Needs scope clarification.
- Alignment: Strong, Moderate, Weak.

Include a short feasibility note on each issue with:

- Risks or unknowns.
- Minimum next step to de-risk.

These feasibility details must be included inside the structured Planning Brief
comment (not as a separate short comment).

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

- Check issue labels:
  - `gh issue view <issue-number> --repo benmvp/tools-app --json labels --jq '.labels[].name'`
- Read full comment history before refining:
  - `gh issue view <issue-number> --repo benmvp/tools-app --json body,labels,comments`
- Add structured Planning Brief comment:
  - `gh issue comment <issue-number> --repo benmvp/tools-app --body-file <path>`
- Add base labels to processed issue:
  - `gh issue edit <issue-number> --repo benmvp/tools-app --add-label <type-label>,agent-refined`
- Add blocked label for an external blocker only:
  - `gh issue edit <issue-number> --repo benmvp/tools-app --add-label blocked`
- Add app label only when applicable and missing:
  - `gh issue edit <issue-number> --repo benmvp/tools-app --add-label <app-label>`

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

## App label classification

Assign at most one app label per processed issue:

1. `codemata`: Issue clearly references `apps/codemata`, Codemata features,
  Codemata routes/tools, or Codemata UI/content.
2. `moni`: Issue clearly references `apps/moni`, Moni features, or Moni docs.
3. `convertly`: Issue clearly references `apps/convertly`, Convertly features,
  or Convertly docs.
4. No app label: Cross-cutting monorepo/platform work, ambiguous ownership, or
  more than one app without a primary owner.

If an app label is applicable, first check existing labels and only add it when
missing. If multiple apps are mentioned, choose one only when a clear primary
owner exists; otherwise add none and note the ambiguity in the feasibility
comment. Treat cross-app ownership as no single app label.

## Edge cases

- Empty backlog: return a no-op summary.
- Missing project/field/option by name: stop and report exactly which required
  name could not be resolved.
- Missing project write access: stop and report permission error.
- Mixed item types (drafts and issues): only label/comment on issue-backed items.
- Criteria failed: keep in `Backlog` and record the unmet criteria in the
  Planning Brief. No `blocked` label.
- External blocker found: apply `blocked` and promote to `Planning` as usual if
  the criteria are otherwise met. A well-defined item is waiting, not
  underspecified, so it must not be held in `Backlog`.
- Item previously rejected by `/refinement-validation`: address every cited gap
  before considering promotion; if a gap needs human input, do not promote.

## Output format

Return a compact report containing:

- Total backlog items reviewed.
- Issues updated with structured refinement comments.
- Priority changes made.
- Item promoted to `Planning` (or reason none was promoted).
- Labels applied (`agent-refined` and issue-type labels).
- App labels applied (`codemata`, `moni`, `convertly`) or why none were added.
- Blocked labels applied for external blockers (or why not).
- Items carrying prior validation rejections, and how each cited gap was
  addressed.
- Follow-up proposals recorded, and that none were materialized as issues.
- Follow-up actions for unresolved risks.
- Refinement criteria status per processed issue (met/not met).
