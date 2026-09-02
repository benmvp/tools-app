# Refinement Criteria

Shared contract for the `Backlog` -> `Ready for Planning` gate in the `AI Harness`
project for `benmvp/tools-app`.

Two skills reference this file:

- `.agents/skills/backlog-refinement/SKILL.md` uses it to decide when an item's
  refinement is complete.
- `.agents/skills/refinement-validation/SKILL.md` uses it to decide what gets
  promoted out of `Backlog`.

Neither skill may restate or fork these criteria. Change them here only.

## Column ownership

The board alternates between **active** columns, where work and rework happen,
and **readiness** columns, which hold certified work that nobody has started.

One rule governs every forward transition:

> **Validators promote. Producers claim. Failure moves nothing.**

| Transition | Who | Kind |
| --- | --- | --- |
| `Backlog` -> `Ready for Planning` | `refinement-validation` | promotion |
| `Ready for Planning` -> `Planning` | spec skill | claim |
| `Planning` -> `Ready for Development` | spec-validation skill | promotion |
| `Ready for Development` -> `In Development` | developer or implementation skill | claim |

Consequences that all stages depend on:

- A readiness column is entered **only** by a validator, so its contents are
  always certified. A producer never moves an item into one.
- A producer moves an item only to **claim** it out of a readiness column into
  the next active column. That claim is what prevents two runs picking up the
  same item.
- **Failure is not a move.** A rejected item stays in the active column it was
  already in, without its gate label. It is already in the right place, because
  that column is where rework happens.
- The one exception is regression: an item already sitting in a readiness column
  that later fails re-validation is demoted back to the preceding active column.

`Backlog` is the active column for refinement. There is no readiness column
before it, because refinement is the first stage.

## Criteria

Each criterion has a stable **name**. Always refer to criteria by name, never by
position. Numbering shifts as criteria are added or reordered; names do not.

An issue's refinement is sufficient for `Ready for Planning` when all of the
following are true:

### Scope clarity

Problem, outcome, and scope are unambiguous. A reader can state what is broken or
missing, what "done" looks like, and what is explicitly out of scope.

### Area ownership

Exactly one area label (`codemata`, `moni`, `convertly`, `skills`, or `infra`) is
applied, or the issue explicitly declares cross-cutting ownership with no single
owner.

### De-risk step

Top unknowns are named, and each has a specific minimum next action, not a vague
"investigate further".

### Priority rationale

The `Priority` project field is set and the impact/urgency/alignment/effort
reasoning is recorded.

### Codebase verification

Every referenced file path, symbol, route, or module exists, and no claim is
contradicted by the current code (for example, proposing work that is already
implemented).

## Author intent governs scope

When the issue body states a desired outcome, the refinement's scope must follow
it. An agent that believes the stated outcome is unwise records the concern under
Open Questions and proceeds with the author's scope.

Never silently substitute a different outcome. Contradicting the issue body
without flagging the contradiction is a **Scope clarity** failure, because a
reader can no longer tell which outcome is intended.

Disagreement is welcome; it just has to be visible and non-blocking. Record it as
a recommendation the author can accept or reject, not as a rewritten scope.

## External blockers

An external blocker is a dependency on a third party, an upstream service, or a
human decision that no amount of further refinement can resolve.

External blockers **do not** fail the criteria. An otherwise well-refined item is
correctly defined; it is simply waiting. Such an item is promoted normally:

- It is promoted to `Ready for Planning` like any other passing item.
- It receives `validated-refinement`, because its refinement genuinely is valid.
- It also receives the `blocked` label.

Downstream stages exclude it with `-label:blocked`, not by withholding the gate
label. Quality and blocking are separate axes, and a gate label must only ever
answer the quality question.

Never hold a well-defined item in `Backlog` because it is blocked. `Backlog`
means underspecified, and holding a blocked item there loses the refinement work.

Do not use `blocked` for underspecified items. An underspecified item belongs in
`Backlog`, which is a column problem, not a label problem.

## Parked items

`parked` marks an item that a human has deliberately excluded from automated
processing. It is the way to capture a raw idea in `Backlog` without any agent
stage picking it up.

Every stage adds `-label:parked` to its selection query and reports parked items
as skipped. No stage ever adds or removes `parked`; only a human does. Removing
it is the explicit signal that the item is ready to be looked at.

`parked` is not `blocked`. A blocked item is well-defined and waiting on someone
else, and it keeps flowing through the stages. A parked item is waiting on its
author and does not flow at all.

## Label semantics

Labels fall on five independent axes. A label answers exactly one question.

| Axis | Question | Removable | Labels |
| --- | --- | --- | --- |
| Type | What kind of work is this? | Reclassify only | `bug`, `enhancement`, `documentation`, `question` |
| Area | What part of the repo? | Reclassify only | `codemata`, `moni`, `convertly`, `skills`, `infra` |
| Gate state | Which quality bars has it passed? | Yes | `validated-refinement`, `validated-spec` |
| Holding state | Is progression held, and by what? | Yes | `blocked`, `parked` |
| Provenance | Who did each stage? | **Never** | `agent-refined`, `agent-validated-refinement`, `agent-specced`, `agent-validated-spec` |

Rules:

- **Provenance labels are append-only.** They record history. Never remove one,
  including when demoting an item.
- **Only state labels are removed.** A failed validation removes
  `validated-refinement`.
- **`parked` is human-owned.** No stage adds or removes it.
- Whether an item needs (re-)refinement is derived from state, not from
  stripping provenance:
  `Status = Backlog AND no validated-refinement` means it needs refinement.

### Consumer queries

Every stage excludes `parked`, and every producer stage also excludes `blocked`.
Both are shown explicitly below, because a stage that only excludes one of them
will loop.

```text
backlog-refinement    -> Status=Backlog AND -label:validated-refinement
                         AND -label:blocked AND -label:parked
refinement-validation -> -label:parked AND (
                           (Status=Backlog AND label:agent-refined
                            AND -label:validated-refinement AND rejectionCount<3)
                           OR (Status="Ready for Planning" AND stale))
spec skill            -> Status="Ready for Planning" AND label:validated-refinement
                         AND -label:blocked AND -label:parked
spec validation       -> -label:parked AND (
                           (Status=Planning AND label:agent-specced
                            AND -label:validated-spec)
                           OR (Status="Ready for Development" AND stale))
next work item        -> Status="Ready for Development" AND label:validated-spec
                         AND -label:blocked AND -label:parked
```

Producers exclude `blocked` because neither kind of blocked item can be advanced
by producing more content: an externally blocked item is already sufficiently
refined and is waiting on someone else, and a circuit-breaker item needs a human
decision. Validators do **not** exclude `blocked`, because they are what clears
it once the blocker resolves.

`rejectionCount` is the number of `<!-- agent:validation-fail -->` markers on the
issue. Excluding items at 3 is what makes the circuit breaker terminal instead of
merely advisory.

Because `Backlog` holds both raw and refined-pending-validation items, the labels
are what separate them:

```text
never refined       -> Status=Backlog AND -label:agent-refined
awaiting validation -> Status=Backlog AND label:agent-refined AND -label:validated-refinement
```

## Comment markers

Every machine-authored comment starts with an HTML marker so other skills can
locate it without parsing prose. Markers are invisible in rendered Markdown.

| Marker | Author | Meaning |
| --- | --- | --- |
| `<!-- agent:planning-brief -->` | `backlog-refinement` | Structured Planning Brief |
| `<!-- agent:validation-pass -->` | `refinement-validation` | Refinement passed the criteria |
| `<!-- agent:validation-fail round=N -->` | `refinement-validation` | Refinement failed; `N` is the 1-based rejection count |
| `<!-- agent:validation-blocked -->` | `refinement-validation` | External blocker found; item promoted and labeled `blocked` |
| `<!-- agent:followup-proposal -->` | any stage | Proposed follow-up issue; see below |

Never match on comment prose. Wording changes; markers do not.

## Follow-up proposals

Work at any stage can surface work that belongs in a separate issue. Detection
and creation are deliberately separated: a stage **proposes**, and a single
dedicated mechanism (or a human) **materializes**.

No stage creates issues directly. That keeps issue creation out of skills whose
mandate forbids originating content, and gives a human a gate before agent-driven
issues start accumulating.

### When to propose

Propose only when the follow-up is a **direct consequence of scope explicitly
excluded from the current issue**, for example capability the current work
removes or defers.

Do not propose general improvements, adjacent ideas, or opportunistic cleanup. If
the current issue would still be complete and correct without it, it is not a
follow-up.

### Proposal format

A proposal is a block inside the stage's normal comment. It does not need its own
comment.

```markdown
<!-- agent:followup-proposal -->
### Proposed follow-up

- **Title:**
- **Why:** what in the current issue creates this work
- **Type:** `bug` / `enhancement` / `documentation` / `question`
- **Area:** `codemata` / `moni` / `convertly` / `skills` / `infra` / cross-cutting
- **Materialized as:** _(issue number, filled in when created)_
```

### Materialization

Whoever materializes a proposal creates the issue in `Backlog` and writes the new
issue number into `Materialized as`.

That field is the dedupe key: a proposal already carrying an issue number is
skipped. No separate state store is needed.

A materialized issue enters `Backlog` with no `validated-refinement`, so
`backlog-refinement` picks it up on the next sweep with no special handling.

## Staleness

A `validated-refinement` label goes stale when the content it was based on
changes after validation.

Do **not** compare against `issue.updatedAt`. Posting a comment bumps
`updatedAt`, so the validation comment would immediately invalidate itself.

A validated item is stale when either is true:

- `issue.lastEditedAt` (falling back to `issue.createdAt` when never edited) is
  newer than the latest `<!-- agent:validation-pass -->` comment.
- Any comment not authored by the validator is newer than the latest
  `<!-- agent:validation-pass -->` comment.

Retrieve `lastEditedAt` via GraphQL; the REST-backed `gh issue view` does not
expose it:

```sh
GH_PROMPT_DISABLED=1 GH_PAGER=cat PAGER=cat gh api graphql -f query='
  query($number: Int!) {
    repository(owner: "benmvp", name: "tools-app") {
      issue(number: $number) { createdAt lastEditedAt }
    }
  }' -F number=<issue-number>
```

## Rejection loop protection

To guarantee the refine/reject cycle terminates:

1. `backlog-refinement` must read the latest `<!-- agent:validation-fail -->`
  comment and explicitly address every gap it cites. It may not declare an item
  ready while any cited gap is unaddressed.
2. `refinement-validation` counts existing `validation-fail` markers. On the
  third rejection it stops rejecting quietly: it applies `blocked`, leaves the
  item in `Backlog`, and escalates for human input.
3. Once the count reaches 3, both stages skip the item entirely in sweep mode,
  via `-label:blocked` and `rejectionCount<3` respectively. Without that, the
  next sweep would simply post a fourth rejection.

## Comment formatting rules

Both skills follow these when writing comments:

- Inline code with backticks for file paths, commands, symbols, and other
  non-plain-text tokens.
- Fenced code blocks for multi-line code or command snippets.
- Bold bullet labels so labels are distinct from values, for example
  `- **Problem statement:** ...`.
- Never edit the issue body. All output goes into comments.
