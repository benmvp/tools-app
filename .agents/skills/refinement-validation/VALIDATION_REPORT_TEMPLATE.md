# Validation Report Comment Template

Comment shapes posted by the `refinement-validation` skill. Comment-only output;
never modify the issue body.

Each comment begins with its HTML marker on the first line. Markers are how other
skills locate these comments, so they must be exact.

Refer to criteria by their names from
`.agents/workflow-criteria/REFINEMENT_CRITERIA.md`, never by position. Numbering
shifts as criteria change; names do not.

---

## Pass comment

```markdown
<!-- agent:validation-pass -->
## Refinement validated

This issue meets the refinement criteria and has been promoted to
`Ready for Planning`.

### Criteria

| Criterion | Verdict | Evidence |
| --- | --- | --- |
| Scope clarity | Pass | |
| Area ownership | Pass | |
| De-risk step | Pass | |
| Priority rationale | Pass | |
| Codebase verification | Pass | |

### Codebase verification

| Claim | Check | Result |
| --- | --- | --- |
| | Existence / Contradiction | |

### Actions taken

- **Status:** `Backlog` -> `Ready for Planning`
- **Labels added:** `validated-refinement`, `agent-validated-refinement`
```

Evidence must point at something real: a section of the issue body, a specific
comment, or a file in the repo.

When re-validating an item already in `Ready for Planning`, change the status
line to `unchanged (Ready for Planning)`.

---

## Pass comment, item with no Planning Brief

Same as above, plus the section below. Use only when there is no
`<!-- agent:planning-brief -->` comment on the issue.

Every field cites where it came from. A field with no citation must be omitted,
and its absence means the item fails instead.

```markdown
### Validated summary

No Planning Brief exists on this issue, so the following summarizes what was
validated. This restates existing information only; nothing here is new.

- **Problem statement:** ... _(source: issue body)_
- **Desired outcome:** ... _(source: issue body)_
- **In scope:** ... _(source: comment by @benmvp)_
- **Out of scope:** ... _(source: comment by @benmvp)_
- **Area ownership:** ... _(source: `codemata` label)_
- **Known unknowns and de-risk step:** ... _(source: issue body)_
- **Priority rationale:** ... _(source: `Priority` field, comment by @benmvp)_
```

---

## Fail comment

```markdown
<!-- agent:validation-fail round=N -->
## Refinement not yet sufficient for promotion

This issue does not meet the refinement criteria, so it stays in `Backlog`.
Rejection **N** of 3.

### Failed criteria

| Criterion | Gap | What would resolve it |
| --- | --- | --- |
| | | |

### Criteria met

| Criterion | Evidence |
| --- | --- |
| | |

### Codebase verification

| Claim | Result |
| --- | --- |
| | |

### Actions taken

- **Status:** unchanged (`Backlog`)
- **Labels removed:** `validated-refinement`
- **Provenance labels:** unchanged

### Next step

Run `/backlog-refinement`. It must address every gap above before this issue can
be promoted to `Ready for Planning`.
```

Gaps must be specific and actionable. "Scope is unclear" tells nobody anything;
"scope does not state whether existing issues are backfilled or only new ones"
does.

Omit the "Criteria met" table when nothing passed.

On the regression path, where a stale item in `Ready for Planning` fails
re-validation, change the status line to `Ready for Planning` -> `Backlog`.

---

## Fail comment, circuit breaker tripped

Use on the third rejection. The item stays in `Backlog` and is escalated for
human input instead of being refined again.

```markdown
<!-- agent:validation-fail round=3 -->
## Refinement blocked after 3 rejections

This issue has now failed validation three times. Further agent refinement is
unlikely to resolve the remaining gaps, so it is being escalated rather than
refined again.

### Unresolved gaps

| Criterion | Gap | Why refinement cannot resolve it |
| --- | --- | --- |
| | | |

### Rejection history

1. <!-- link to round 1 comment -->
2. <!-- link to round 2 comment -->

### Actions taken

- **Status:** unchanged (`Backlog`)
- **Labels added:** `blocked`

### Next step

Human input is required on the gaps above. Once answered in a comment, re-run
`/refinement-validation` on this issue.
```

---

## External blocker comment

Criteria are met, but an unresolved external dependency exists. The item is
well-defined and waiting, so it is promoted normally and marked `blocked`.

```markdown
<!-- agent:validation-blocked -->
## Refinement valid, blocked externally

This issue meets the refinement criteria and has been promoted to
`Ready for Planning`. An external blocker prevents work from starting, so it is
labeled `blocked` and downstream speccing will skip it until that clears.

### Blocker

- **What:**
- **Owner / dependency:**
- **What would unblock it:**

### Criteria

| Criterion | Verdict | Evidence |
| --- | --- | --- |
| | | |

### Actions taken

- **Status:** `Backlog` -> `Ready for Planning`
- **Labels added:** `validated-refinement`, `agent-validated-refinement`,
  `blocked`

### Next step

Resolve the blocker and remove `blocked`, then the speccing skill can pick this
up.
```
