# Planning Brief Comment Template

Use this template for the refinement comment posted on each processed issue.
This template is comment-only output; do not modify the issue body.

The comment must start with this marker on its first line, so
`/refinement-validation` and the speccing skill can locate it:

```text
<!-- agent:planning-brief -->
```

## Context

- **Problem statement:**
- **Why now:**
- **Impacted users/workflows:**

## Outcome

- **Desired user/business outcome:**
- **Success signal:**

## Scope

- **In scope:**
- **Out of scope:**

## Constraints

- **App ownership (codemata/moni/convertly or cross-app with no single app label):**
- **Technical or platform constraints:**
- **Dependency constraints:**

## Suggested approach

1.
2.
3.

## Feasibility assessment

- **Technical complexity (Low/Medium/High):**
- **Dependencies (None/Internal/External):**
- **Clarity (Well-defined/Needs scope clarification):**
- **Alignment (Strong/Moderate/Weak):**

## Risks and assumptions

- **Risks or unknowns:**
- **Assumptions:**

## De-risk next step

- **Minimum next step to unblock planning:**

## Priority rationale

- **Impact (1-5):**
- **Urgency (1-5):**
- **Strategic alignment (1-5):**
- **Effort cost (1-5):**
- **Score:** `impact + urgency + strategicAlignment - effortCost =`
- **Priority mapping (P0/P1/P2):**

## Refinement criteria check

Criteria are defined in `.agents/workflow-criteria/REFINEMENT_CRITERIA.md`.
Refer to them by name, never by position.

- **Scope clarity:** Yes/No
  - **Author intent honored:** Yes/No. Scope follows the issue body, and any
    disagreement is recorded as an Open Question rather than a rewritten scope.
    This is part of Scope clarity, not a separate criterion.
- **App ownership:** Yes/No
- **De-risk step:** Yes/No
- **Priority rationale:** Yes/No
- **Codebase verification:** Yes/No
- **Result:** Met/Not Met
- **If Not Met, what would resolve each gap:**

## External blocker (only when one exists)

- **What:**
- **Owner / dependency:**
- **What would unblock it:**

## Prior validation rejections (only when present)

- **Latest rejection round:**
- **Gaps cited, and how each is addressed in this brief:**

## Open questions (only when relevant)
1.
2.
3.

## Proposed follow-ups (only when relevant)

Use only when the current issue's scope explicitly excludes work that must still
happen, for example capability this issue removes or defers. See
`.agents/workflow-criteria/REFINEMENT_CRITERIA.md`. Do not propose general
improvements or adjacent ideas.

Repeat the block per follow-up.

<!-- agent:followup-proposal -->
### Proposed follow-up

- **Title:**
- **Why:**
- **Type:**
- **App:**
- **Materialized as:**

## Ready-for-spec details (only when relevant)

- **Existing architecture touchpoints:**
- **Non-functional requirements:**
- **Analytics and observability expectations:**
- **Rollout and migration constraints:**
- **Ready-for-spec checklist (pass/fail):**

## Decision log (optional)
