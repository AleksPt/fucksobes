---
title: "How do you undo a commit, and what is rebase?"
category: git
order: 2
---

There are two ways to undo a commit:

- `git revert <commit>` creates a **new** commit that reverses the changes. The history is preserved, so this is safe for commits that have already been published.
- `git reset` moves `HEAD` back: `--soft` keeps the changes in the index, `--mixed` (the default) keeps them in the working copy unstaged, and `--hard` discards them completely.

```bash
git reset --soft HEAD~1   # undo the last commit, keeping the changes
git revert HEAD           # undo a commit with a new commit
```

`git rebase` replays the commits of the current branch on top of a different base commit; for example, `git rebase main` moves the branch onto the latest tip of `main`. The history becomes linear, but the commits are recreated, so you should not rebase branches that others already build on.
