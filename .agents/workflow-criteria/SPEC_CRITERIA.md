# Spec Criteria

Shared contract for the `Ready for Planning` -> `Ready for Development` gate in the `AI Harness` project for `benmvp/tools-app`.

Two skills reference this file:

- `.agents/skills/spec/SKILL.md` uses it to decide when a ticket is ready for a spec run.
- `.agents/skills/spec-validation/SKILL.md` uses it to decide whether a spec is good enough to move from `Planning` to `Ready for Development`.

Neither skill may restate or fork these criteria. Change them here only.

## Column ownership

The board alternates between active columns, where work happens, and readiness columns, which hold certified work nobody has started.

One rule governs every forward transition:

> Validators promote. Producers claim. Failure moves nothing.

| Transition | Who | Kind |
| --- | --- | --- |
| `Ready for Planning` -> `Planning` | `spec` | claim |
| `Planning` -> `Ready for Development` | `spec-validation` | promotion |
| `Ready for Development` -> `In Development` | developer or implementation skill | claim |

Consequences that all stages depend on:

- A readiness column is entered only by a validator, so its contents are always certified.
- A producer moves an item only to claim it out of a readiness column into the next active column.
- Failure is not a move. A rejected spec remains in `Planning`, where rework happens.
- A regression is when a valid item in `Ready for Development` or `Planning` later fails validation and is moved back to the preceding active column.

## Criteria

A spec is sufficient for `Ready for Development` when all of the following are true:

### Brief fidelity

The spec reflects the issue's problem statement, desired outcome, constraints, and scope without silently redefining them.

### Codebase verification

Every referenced file path, route, symbol, package, script, or configuration entry exists, and no claim is contradicted by the current repository state.

### Implementation decomposition

The work is split into concrete phases or steps with clear dependencies, an implementation order, and a clear done state for each phase.

### Test strategy

The spec names the validation approach for the work, including tests, manual checks, or verification steps where automation is insufficient.

### Knowledge-base handoff

The spec records every required knowledge-base or documentation update that must happen, including any call to `/living-docs-contract` or related docs maintenance work.

### Scope boundary

The spec clearly separates in-scope work from out-of-scope work, explicitly calls out deferred follow-ups, and does not broaden the issue without saying so.

## External blockers

An external blocker is a dependency on a third party, an upstream service, or a human decision that no amount of further spec writing can resolve.

External blockers do not fail the spec criteria. They are valid specs waiting on someone else.

Such an item may progress to `Ready for Development` while remaining `blocked`, and downstream stages exclude it via `-label:blocked`.

Do not use `blocked` for underspecified or low-quality specs. Those belong in `Planning`, which is where rework happens.

## Blocker removal and re-entry

When a blocker is resolved, the validator removes the `blocked` label and re-runs evaluation against the same issue and current spec.

A human may also clear `blocked` after resolving the external dependency or completing the external action themselves. This is an explicit human override for work that cannot be reliably verified by an agent, but the final gate remains validator-owned. In that case the human posts a note on the issue, removes `blocked`, and the validator re-checks the spec before continuing.

This is not a producer action. A human may clear `blocked` after resolving the external dependency, but only the validator may confirm that the dependency is resolved and that the spec still satisfies the gate before promotion or continued processing.

Resolution flow:

1. Human resolves the dependency or answer.
2. The issue is updated and any relevant comments are read.
3. The validator removes `blocked`.
4. The validator re-evaluates the issue against the spec criteria.
5. If the spec still passes, the item continues normally.
6. If the spec no longer passes, the item remains in `Planning` and `validated-spec` is removed.

## `parked` items

`parked` marks an item that a human deliberately excluded from automated processing. No stage adds or removes it.

Every stage excludes `parked` from selection and notes it as skipped.

## Label semantics

Labels fall on five independent axes. A label answers exactly one question.

| Axis | Question | Removable | Labels |
| --- | --- | --- | --- |
| Type | What kind of work is this? | Reclassify only | `bug`, `enhancement`, `documentation`, `question` |
| Area | What part of the repo? | Reclassify only | `codemata`, `moni`, `convertly`, `skills`, `infra` |
| Gate state | Which quality bars has it passed? | Yes | `validated-spec`, `validated-refinement` |
| Holding state | Is progression held, and by what? | Yes | `blocked`, `parked` |
| Provenance | Who did each stage? | Never | `agent-specced`, `agent-validated-spec`, `agent-refined`, `agent-validated-refinement` |

Rules:

- Provenance labels are append-only.
- Only state labels are removed. A failed validation removes `validated-spec`.
- `parked` is human-owned. No stage adds or removes it.
- `Status = Planning AND no validated-spec` means the spec is awaiting validation.

### Consumer queries

```text
spec producer         -> Status="Ready for Planning" AND label:validated-refinement
                         AND -label:blocked AND -label:parked
spec validation      -> -label:parked AND -label:blocked AND (
                           (Status=Planning AND label:agent-specced
                            AND -label:validated-spec)
                           OR (Status="Ready for Development" AND stale))
next work item        -> Status="Ready for Development" AND label:validated-spec
                         AND -label:blocked AND -label:parked
```

## Comment markers

Every machine-authored comment starts with an HTML marker so other skills can locate it without parsing prose.

| Marker | Author | Meaning |
| --- | --- | --- |
| `<!-- agent:spec-pr issue=N -->` | `spec` | Draft PR metadata and link back to the issue |
| `<!-- agent:spec-created pr=N -->` | `spec` | Official issue comment linking draft PR and spec artifact |
| `<!-- agent:spec-open-question -->` | `spec` | Human answer needed to resolve scope uncertainty |
| `<!-- agent:spec-validation-pass -->` | `spec-validation` | Spec passed and item is ready for `Ready for Development` |
| `<!-- agent:spec-validation-fail round=N -->` | `spec-validation` | Spec failed; `N` is the 1-based rejection count |
| `<!-- agent:spec-validation-blocked -->` | `spec-validation` | External blocker found; item promoted or held while waiting |

Never match on comment prose.

## Ephemeral spec lifecycle

Spec files created under `.agents/plans/` are temporary planning artifacts for review and validation during the `Planning` stage.

Rules:
1. **Never merge plans into main:** The implementation agent/developer must delete the `.agents/plans/<issue-number>-<slug>.md` file in the same PR before it is merged into `main`.
2. **PR description evolution:**
   - In `Planning`: PR description serves as the spec review header (`<!-- agent:spec-pr issue=N -->`, `Refs #N`, link to spec plan).
   - In `Development` / `Code Review`: The developer updates the PR description with the actual changes implemented, testing evidence, changes `Refs #N` to `Closes #N` or `Fixes #N`, and marks the PR ready for review.

## Staleness

A `validated-spec` label goes stale when the underlying spec or issue context changes after validation.

A validated item is stale when either is true:

- `issue.lastEditedAt` is newer than the latest `<!-- agent:spec-validation-pass -->` comment.
- Any comment not authored by the validator is newer than the latest pass comment.
- The spec PR has new code or docs changes that contradict the validated spec.

## Rejection loop protection

To guarantee the spec/reject cycle terminates:

1. `spec` must read the latest issue comment whose marker begins with `<!-- agent:spec-validation-fail` and explicitly address every cited gap.
2. `spec-validation` counts rejections by prefix. Only comments whose marker begins with `<!-- agent:spec-validation-fail` count toward the breaker. Routine review comments or non-machine comments do not count.
3. On the second rejection it stops rejecting and applies `blocked`, leaving the item in `Planning` and escalating for human input.
4. Once the count reaches 2, both stages skip the item entirely in sweep mode, via `-label:blocked` and the rejection threshold.

## Comment formatting rules

- Use the issue for scope and human decisions.
- Use the PR for inline review of spec correctness.
- Inline code with backticks for file paths, commands, symbols, and other non-plain-text tokens.
- Fenced code blocks for multi-line code or command snippets.
- Bold bullet labels so labels are distinct from values.
- Never edit the issue body. All output goes into comments unless the workflow explicitly says otherwise.

## Non-code implementation work

Work that is operational rather than code-based still follows the same planning and validation pattern, but it does not necessarily produce a mergeable code PR.

Examples include:

- GitHub settings
- domain or DNS configuration
- Firebase or auth setup
- deployment or platform configuration
- other admin or infrastructure tasks

For these cases:

- the same draft-PR planning flow still applies
- the PR is closed without merge when the work is complete
- the issue remains the canonical tracker and is moved to a final state as the operational result is complete
- the spec is still considered temporary and should be cleaned up before final archival or merge of any subsequent code PR

## Output format

Return a compact report containing:

- Total items reviewed.
- Items claimed into `Planning`.
- Items validated and promoted to `Ready for Development`.
- Items left in `Planning` after failing validation.
- Items blocked by unresolved dependency or human decision.
- Labels added or removed, per issue.
- Open questions that required a human answer.
- Follow-up actions.
