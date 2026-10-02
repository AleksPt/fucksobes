---
title: "How do you move a repository from one hosting service to another while preserving the commit history?"
category: git
order: 11
---

The history is stored in the repository itself, so it is enough to move all the refs (branches and tags) to the new remote:

```bash
git clone --mirror <old-repository-URL>
cd <repository>.git
git remote set-url origin <new-repository-URL>
git push --mirror
```

The `--mirror` option copies the full set of refs: all branches, tags and commits. The new repository on the target service must be created in advance and be empty. After pushing, check that the branches, tags and number of commits match, and tell the contributors the new URL, which they set with `git remote set-url`.

This move does not cover what lives not in git but on the service itself: issues, pull requests, branch settings, secrets and CI configuration, so those are migrated separately (via import or the API).
