---
title: "What are push, pull, fetch and merge?"
category: git
order: 6
---

- `git push` — sends the local commits of a branch to the remote repository (`remote`).
- `git fetch` — downloads new commits from the remote repository and updates the remote-tracking branches (`origin/main`), but does not change your working branch or files.
- `git pull` — is `fetch` plus integrating the downloaded changes into the current branch: a merge by default, or a rebase with `--rebase`.
- `git merge` — combines the history of another branch with the current one. If the branches have diverged, a merge commit is created; if the pointer can simply be moved forward, a fast-forward is performed. When both branches edited the same lines, a conflict occurs and has to be resolved manually.

`fetch` is safe because it changes nothing in the working branch: you first look at what has arrived and only then integrate it.
