---
description: "Use when working with branches, rebasing, syncing, pushing, or creating PRs in this repository. Enforce gh stack commands over direct git branch-history operations for stacked pull request workflows."
name: "GitHub Stack Workflow"
---
# GitHub Stack Workflow

- Hard rule: use `gh stack` commands for stacked PR workflows, including branch creation, restacking, rebasing, syncing, and pushing, whenever an equivalent command exists.
- This rule applies across the entire repository.
- When the task involves branch management or stack-aware history updates, choose `gh stack` first.
- Use direct `git` for read-only inspection and low-risk local status checks (for example: `git status`, `git diff`, `git log`, `git show`).
- Avoid direct `git` branch-history operations that can bypass stack metadata or behavior (for example: manual rebase chains, manual stack push flows) when an equivalent `gh stack` command exists.
- If `gh stack` is unavailable or fails, automatically run the closest safe non-interactive fallback `git` command and explain why fallback was used.
- Keep commands non-interactive when possible and summarize important command results for the user.
