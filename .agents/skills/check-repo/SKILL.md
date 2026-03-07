---
name: check-repo
description:
    Runs formatting, linting & type checks on all changed files in the repository. Use after completing all file edits for a task, before committing. Does NOT run on every file edit, only once at the end to check all changes together.
---

# Check Repository

After you are done with **all** file edits for the current task, run these
commands once so only changed (committed/staged/untracked) files are formatted
and lint-fixed. Do not run between individual file edits.

1. **Format:** `pnpm format`
2. **Lint:** `pnpm lint --fix`
3. **Type check:** `pnpm type-check`

## When to skip

When no source files (e.g. `.ts`, `.tsx`, `.js`, `.jsx`, `.md`, `.mdx`, `.json`) were changed in this conversation.
