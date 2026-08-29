---
description: "Use when running any gh CLI command in this repository. Enforce non-interactive gh usage and required environment prefixes when interaction is possible."
name: "GitHub CLI Non-Interactive Usage"
---
# GitHub CLI Non-Interactive Usage

- This rule applies to all `gh` commands in this repository.
- If a `gh` command may be interactive (prompts, pager, editor, confirmations), prepend `GH_PROMPT_DISABLED=1 GH_PAGER=cat PAGER=cat`.
- If a `gh` command is already explicitly non-interactive, the prefix is optional and does not need to be added.
- Prefer command flags that keep behavior deterministic and script-friendly.
- Summarize key command results for the user.

Examples:
- `GH_PROMPT_DISABLED=1 GH_PAGER=cat PAGER=cat gh pr checks 37`
- `GH_PROMPT_DISABLED=1 GH_PAGER=cat PAGER=cat gh stack submit`
