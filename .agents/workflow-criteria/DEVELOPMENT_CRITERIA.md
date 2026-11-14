# Development Criteria

Shared contract for the `Ready for Development` -> `Code Review` gate in the
`AI Harness` project for `benmvp/tools-app`.

Two skills reference this file:

- `.agents/skills/development/SKILL.md` uses it to decide what a validated
  implementation must satisfy before it is ready for review.
- `.agents/skills/development-validation/SKILL.md` uses it to decide whether an
  implementation is good enough to move from `In Development` to
  `Code Review`.

Neither skill may restate or fork these criteria. Change them here only.

## Column ownership

The board alternates between active columns, where work happens, and readiness
columns, which hold certified work nobody has started.

One rule governs every forward transition:

> Validators promote. Producers claim. Failure moves nothing.

| Transition | Who | Kind |
| --- | --- | --- |
| `Ready for Development` -> `In Development` | `development` | claim |
| `In Development` -> `Code Review` | `development-validation` | promotion |
| `Code Review` -> `Done` | a future stage (see [Beyond Code Review](#beyond-code-review)) | promotion |

Consequences that all stages depend on:

- A readiness column is entered only by a validator, so its contents are always
  certified.
- A producer moves an item only to claim it out of a readiness column into the
  next active column.
- Failure is not a move. A rejected implementation remains in `In Development`,
  where rework happens.
- A regression is when a valid item in `Code Review` later fails re-validation
  and is moved back to `In Development`; the validator also removes
  `validated-development` so the item cannot appear ready while rework is
  pending.

## Criteria

An implementation is sufficient for `Code Review` when all of the following are
true:

### Spec fidelity

The implementation matches the current spec file in `.agents/plans/` (as
amended for any material deviations) phase by phase: every phase and every item
in the verification plan is addressed by the diff, tests, or an explicit,
recorded deviation. A phase that is silently unaddressed is a failure, not an
omission to note.

### Deviation transparency

Any material deviation from the original spec (a scope, behavior, or approach
change discovered during implementation) is recorded in the spec file itself
and, when it changes what the issue author should expect, in an issue comment
marked `<!-- agent:development-deviation -->`. Trivial implementation details
that do not change spec-visible behavior do not require an issue comment.

### Spec file integrity

The ephemeral spec file for this issue still exists in `.agents/plans/` and
reflects the current implementation. It is not deleted at this gate — see
[Ephemeral spec lifecycle](#ephemeral-spec-lifecycle) for why, and fails
validation if it is missing or stale.

### Test strategy fulfillment

The verification plan the spec named (automated checks, manual checks, success
signal) was actually carried out, not just described. Automated tests referenced
by the spec exist and pass.

### Documentation currency

Every doc update the spec's knowledge-base section called for actually happened,
per `/living-docs-contract`. The validator independently re-verifies the
current-state and architecture-contracts docs for the touched app(s) against the
final code; it does not trust a producer comment claiming docs were updated.

### Repo health

`pnpm format`, `pnpm lint`, and `pnpm type-check` (per `/check-repo`) pass
cleanly on the PR branch.

## External blockers

An external blocker is a dependency on a third party, an upstream service, or a
human decision that no amount of further implementation can resolve.

External blockers do not fail the development criteria. An implementation that
is otherwise complete may progress to `Code Review` while remaining `blocked`,
and downstream stages exclude it via `-label:blocked`.

Do not use `blocked` for incomplete or low-quality implementations. Those belong
in `In Development`, which is where rework happens.

## Blocker removal and re-entry

When a blocker is resolved, the validator removes the `blocked` label and
re-runs evaluation against the same issue, spec, and current implementation.

A human may also clear `blocked` after resolving the external dependency or
completing the external action themselves. This is an explicit human override
for work that cannot be reliably verified by an agent, but the final gate
remains validator-owned. In that case the human posts a note on the issue,
removes `blocked`, and the validator re-checks the implementation before
continuing.

## `parked` items

`parked` marks an item that a human deliberately excluded from automated
processing. No stage adds or removes it.

Every stage excludes `parked` from selection and notes it as skipped.

## Label semantics

Labels fall on five independent axes. A label answers exactly one question.

| Axis | Question | Removable | Labels |
| --- | --- | --- | --- |
| Type | What kind of work is this? | Reclassify only | `bug`, `enhancement`, `documentation`, `question` |
| Area | What part of the repo? | Reclassify only | `codemata`, `moni`, `convertly`, `skills`, `infra` |
| Gate state | Which quality bars has it passed? | Yes | `validated-refinement`, `validated-spec`, `validated-development` |
| Holding state | Is progression held, and by what? | Yes | `blocked`, `parked` |
| Provenance | Who did each stage? | Never | `agent-refined`, `agent-validated-refinement`, `agent-specced`, `agent-validated-spec`, `agent-developed`, `agent-validated-development` |

Rules:

- Provenance labels are append-only.
- Only state labels are removed. A failed validation removes
  `validated-development`.
- `parked` is human-owned. No stage adds or removes it.
- `Status = "In Development" AND no validated-development` means the item is
  either awaiting its first validation, awaiting rework, or actively being
  worked. Comment markers distinguish these states.

### Consumer queries

```text
development            -> -label:blocked AND -label:parked AND (
               (Status="Ready for Development" AND label:validated-spec)
               OR (Status="In Development" AND implementation-pending
                 AND rejectionCount<2))
development-validation -> -label:parked AND -label:blocked AND (
               (Status="In Development" AND label:agent-developed
               AND -label:validated-development AND development-ready)
               OR (Status="Code Review" AND stale-development))
next work item          -> Status="Code Review" AND label:validated-development
                           AND -label:blocked AND -label:parked
```

`implementation-pending` is true when the latest `development-started` marker
or the latest `development-validation-fail` marker is newer than the latest
`development-ready` marker. `development-ready` is true when a marker exists
and is newer than each latest `development-started` and
`development-validation-fail` marker that exists. Compare issue-comment
timestamps; a validation-fail marker is the issue comment, not the PR review
comment. This lets producers resume interrupted work or perform requested
rework, while preventing validation from rejecting the same unchanged
implementation or running during active rework.

## Comment markers

Every machine-authored comment starts with an HTML marker so other skills can
locate it without parsing prose.

| Marker | Author | Meaning |
| --- | --- | --- |
| `<!-- agent:development-started issue=N -->` | `development` | Notes the implementation branch/PR was claimed or work resumed |
| `<!-- agent:development-ready issue=N -->` | `development` | Records a completed implementation pass ready for validation |
| `<!-- agent:development-deviation -->` | `development` | A material deviation from the spec, recorded for the issue author |
| `<!-- agent:development-validation-pass -->` | `development-validation` | Implementation passed and item is ready for `Code Review` |
| `<!-- agent:development-validation-fail round=N -->` | `development-validation` | Implementation failed; `N` is the 1-based rejection count |
| `<!-- agent:development-validation-blocked -->` | `development-validation` | External blocker found; item promoted or held while waiting |
| `<!-- agent:development-validation-circuit-breaker -->` | `development-validation` | Rejection threshold reached; human input is required before rework continues |

Never match on comment prose.

## Ephemeral spec lifecycle

The spec file at `.agents/plans/<issue-number>-<slug>.md` is a working artifact,
not documentation, but it must survive past this gate.

Rules:

1. **Keep it current, not just present.** `development` updates the spec file
   as the plan changes during implementation, so it always reflects what was
   actually built.
2. **Do not delete it here.** `development-validation` never deletes the spec
   file and fails the gate if it is missing, because the file is still needed
   as context for whatever handles feedback during `Code Review`.
3. **Deletion happens later, in the same run as the merge.** Removing the spec
   file requires its own commit, which is a separate action from merging and
   can itself trigger new CI runs or new review feedback. That means deletion
   is not safe to perform at this gate; it belongs to whatever eventually
   closes out `Code Review`.

See [Beyond Code Review](#beyond-code-review) for how this is expected to be
picked up.

## Beyond Code Review

Two more stages are expected once `Code Review` itself is designed, but neither
is in scope for `development` or `development-validation` and neither is named
yet, to avoid pigeonholing that future design:

- A producer-style skill that stays within `Code Review` (it does not move
  `Status`) and responds to review feedback, from both the Copilot reviewer and
  the human maintainer, using the spec file for context on what was intended.
- A final skill that owns `Code Review` -> `Done`. It confirms review threads
  are resolved and CI is green, deletes the spec file (its own commit), then
  merges. Because that deletion commit can itself trigger new CI runs or new
  review feedback, this skill must re-check state after its own commit and
  defer back to the review-response skill rather than force a merge if
  anything reopens.

## Staleness

A `validated-development` label goes stale when the underlying implementation or
spec changes after validation.

`stale-development` is a derived predicate evaluated from the staleness rules
below; it is not a GitHub label or literal query filter.

A validated item is stale when either is true:

- The spec file has changed since the latest
  `<!-- agent:development-validation-pass -->` comment.
- The PR has new code or docs commits since the latest
  `<!-- agent:development-validation-pass -->` comment.
- Any comment not authored by the validator is newer than the latest pass
  comment.

## Rejection loop protection

To guarantee the develop/reject cycle terminates:

1. `development` must read the latest issue comment whose marker begins with
   `<!-- agent:development-validation-fail` and explicitly address every cited
   gap.
2. `development` posts a new `development-ready` marker only after completing
  the requested rework and updating the PR. Validation must not select the
  item again until that marker is newer than the latest failure marker.
3. `development-validation` counts rejections by prefix. Only comments whose
   marker begins with `<!-- agent:development-validation-fail` count toward the
  breaker. `rejectionCount` is the number of matching issue comments. Routine
  review comments or non-machine comments do not count.
4. On the second rejection it removes `validated-development`, sets `Status` to
  `In Development`, applies `blocked`, and escalates for human input.
5. Once the count reaches 2, both stages skip the item entirely in sweep mode,
  via `-label:blocked` and the rejection threshold.

## Comment formatting rules

- Use the issue for scope and human decisions, including deviation notices.
- Use the PR for inline review of implementation correctness.
- Inline code with backticks for file paths, commands, symbols, and other
  non-plain-text tokens.
- Fenced code blocks for multi-line code or command snippets.
- Bold bullet labels so labels are distinct from values.
- Never edit the issue body. All output goes into comments unless the workflow
  explicitly says otherwise.

## Output format

Return a compact report containing:

- Total items reviewed.
- Items claimed into `In Development`.
- Items validated and promoted to `Code Review`.
- Items left in `In Development` after failing validation.
- Items blocked by unresolved dependency or human decision.
- Labels added or removed, per issue.
- Deviation notices posted.
- Open questions that required a human answer.
- Follow-up actions.
