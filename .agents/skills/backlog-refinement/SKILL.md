---
name: backlog-refinement
description: |
  Automates backlog triage for benmvp/tools-app in the AI Harness project by
  assessing feasibility, ranking priority, and labeling refined items so
  refinement validation can promote them out of Backlog.
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

Do not prompt for repo, project, field, or column names when running this
skill. These names are fixed and known.

## Mandate: refine in place

This skill **never changes an item's `Status`**. It refines items where they sit
in `Backlog` and records the result.

Promotion out of `Backlog` belongs to `/refinement-validation`, per the column
ownership rule in `.agents/workflow-criteria/REFINEMENT_CRITERIA.md`. Producing
refinement and certifying it are separate jobs, and this skill only does the
first.

The signal that an item is ready for promotion is the `agent-refined` label plus
a Planning Brief recording that every criterion is met. The validator decides
whether it agrees.

## Criteria source

The bar an item must meet lives in
`.agents/workflow-criteria/REFINEMENT_CRITERIA.md`. Read it at the start of every
run.

That file is the single source of truth for the criteria, column ownership, label
semantics, comment markers, staleness, and rejection loop protection. Do not
restate or fork it here.

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
      - `priorityFieldId` for field `Priority`
      - `p0OptionId`, `p1OptionId`, `p2OptionId` for options `P0`, `P1`, `P2`
3. Fail fast if any required project/field/option name is missing.

Status option IDs are deliberately not resolved. This skill does not write the
`Status` field, and `gh project item-list` already reports each item's status by
name for filtering.

## Workflow

1. Read `.agents/workflow-criteria/REFINEMENT_CRITERIA.md`.
2. Discover project and field/option IDs from fixed names.
3. Query `AI Harness` items in `Status=Backlog` that have none of
  `validated-refinement`, `blocked`, or `parked`, then only process items whose
  linked issue belongs to `benmvp/tools-app`.
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
13. Add exactly one area label (`codemata`, `moni`, `convertly`, `skills`, or
  `infra`) when one clearly applies and it is not already present.
14. Record in the Planning Brief whether every criterion is met, so the validator
  has an explicit claim to audit.
15. If the criteria are not met, record the unmet criteria and what would resolve
  them. Do **not** apply `blocked`; that label is only for external blockers.
16. Return a concise triage summary with actions taken and any blockers.

Items stay in `Backlog` throughout. An item refined to completion sits in
`Backlog` with `agent-refined` and no `validated-refinement` until
`/refinement-validation` runs, which is the expected intermediate state.

## Reading prior comments

Read every comment before refining, not just the issue body. Human replies often
contain the scope decisions the body lacks, and a prior rejection is the highest
signal input available.

Use the HTML markers defined in the criteria file to locate machine-authored
comments. Never match on comment prose; wording changes, markers do not.

When a `<!-- agent:validation-fail -->` comment exists:

1. Take the most recent one and treat every gap it cites as a required input.
2. Address each gap explicitly in the new Planning Brief.
3. Do **not** declare the criteria met while any cited gap is unaddressed.
  Re-posting a near-identical brief just gets the item rejected again.
4. If a gap can only be answered by a human, say so in the brief and record the
  criteria as unmet.

## Planning Brief template

Closely follow the Planning Brief template file at:

- `.agents/skills/backlog-refinement/PLANNING_BRIEF_TEMPLATE.md`

Write all refinement output into issue comments only. Do not edit the issue body.

Start the Planning Brief comment with the `<!-- agent:planning-brief -->` marker
so `/refinement-validation` and the speccing skill can locate it.

## Refinement criteria

See `.agents/workflow-criteria/REFINEMENT_CRITERIA.md`. Evaluate every criterion
and record the verdict in the Planning Brief.

If any criterion fails, record which criteria are unmet and what would resolve
them. Do not apply `blocked` for underspecified items; an underspecified item is
a column problem, not a label problem.

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
- Add area label only when applicable and missing:
  - `gh issue edit <issue-number> --repo benmvp/tools-app --add-label <area-label>`

Set project fields using IDs resolved at runtime:

- Set `Priority`:
  - `gh project item-edit --id <item-id> --project-id <project-id> --field-id <priority-field-id> --single-select-option-id <p0|p1|p2-option-id>`

Never write the `Status` field from this skill.

## Issue type label classification

Assign exactly one type label per processed issue using this order:

1. `bug`: Repro steps, regression, incorrect behavior, failure, crash, or broken output.
2. `documentation`: Docs, README, guides, examples, wording, or reference updates.
3. `question`: Primarily requesting clarification/decision rather than implementation.
4. `enhancement`: New capability, refactor, automation, or workflow improvement.

If multiple categories appear, choose the first matching rule above and note why
in the feasibility comment.

## Area label classification

Assign at most one area label per processed issue, using this precedence. The
order matters because agent tooling and repo tooling genuinely overlap.

1. `skills`: Agent skill definitions, workflow criteria, prompts, or anything
  under `.agents/`.
2. `infra`: Turborepo, Biome, CI/CD workflows, Vercel or deployment config,
  dependency management, and other build or repo tooling.
3. `codemata`: Issue clearly references `apps/codemata`, Codemata features,
  Codemata routes/tools, or Codemata UI/content.
4. `moni`: Issue clearly references `apps/moni`, Moni features, or Moni docs.
5. `convertly`: Issue clearly references `apps/convertly`, Convertly features,
  or Convertly docs.
6. No area label: Cross-cutting work spanning several areas, ambiguous ownership,
  or more than one app without a primary owner.

If an area label is applicable, first check existing labels and only add it when
missing. If multiple areas are mentioned, choose one only when a clear primary
owner exists; otherwise add none and note the ambiguity in the feasibility
comment. Treat cross-app ownership as no single area label.

## Edge cases

- Empty backlog: return a no-op summary.
- Missing project/field/option by name: stop and report exactly which required
  name could not be resolved.
- Missing project write access: stop and report permission error.
- Mixed item types (drafts and issues): only label/comment on issue-backed items.
- `parked` item: skip entirely. Do not comment, label, or set `Priority`. List it
  as skipped in the summary. Never add or remove `parked`.
- `blocked` item: skip entirely, and list it as skipped. Refinement cannot
  advance either kind of blocked item. An externally blocked item is already
  refined and is waiting on someone else; a circuit-breaker item needs a human
  decision. Only `/refinement-validation` clears `blocked`.
- Criteria failed: record the unmet criteria in the Planning Brief. The item
  stays in `Backlog`, which is where it already is. No `blocked` label.
- External blocker found: apply `blocked` and record the criteria as met if they
  otherwise are. Promotion is still the validator's call, and this item is now
  out of scope for later refinement sweeps.
- Item previously rejected by `/refinement-validation`: address every cited gap
  before declaring the criteria met; if a gap needs human input, record the
  criteria as unmet.

## Output format

Return a compact report containing:

- Total backlog items reviewed.
- Issues updated with structured refinement comments.
- Priority changes made.
- Items whose criteria are now fully met and are awaiting
  `/refinement-validation`.
- Labels applied (`agent-refined` and issue-type labels).
- Area labels applied (`codemata`, `moni`, `convertly`, `skills`, `infra`) or why
  none were added.
- Blocked labels applied for external blockers (or why not).
- Parked and blocked items skipped.
- Items carrying prior validation rejections, and how each cited gap was
  addressed.
- Follow-up proposals recorded, and that none were materialized as issues.
- Follow-up actions for unresolved risks.
- Refinement criteria status per processed issue (met/not met).

No `Status` changes are ever reported, because this skill makes none.
