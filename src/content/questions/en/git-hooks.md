---
title: "What is a Git hook? What are hooks used for? Have you used them in practice?"
category: git
order: 10
---

A Git hook is a script that Git runs automatically on certain events. Hooks live in `.git/hooks/` (files without an extension, such as `pre-commit`) and can be written in any language; if the script exits with a non-zero code, the operation is aborted.

Common uses:

- `pre-commit` — checks before a commit: a linter (SwiftLint), formatting, banning debug code;
- `commit-msg` — validating the message format (for example, Conventional Commits);
- `pre-push` — running tests before pushing;
- `post-merge`, `post-checkout` — updating dependencies after the branch changes.

The `.git/hooks` directory is not part of the repository, so hooks are shared with the team via the `core.hooksPath` setting pointing to a versioned folder, or with tools such as pre-commit and Husky. Mandatory checks are still duplicated in CI, because a hook can be bypassed with the `--no-verify` flag.
