---
title: "What is Git Flow? Describe the main principles of this approach"
category: git
order: 7
---

Git Flow is a branching model with branches that have fixed roles:

- `main` (or `master`) holds only stable release code, and every release is tagged;
- `develop` is the main development branch where finished features are merged;
- `feature/*` are branches for individual tasks, created from `develop` and merged back into it;
- `release/*` is release preparation: fixing minor bugs and bumping the version, then merging into `main` and `develop`;
- `hotfix/*` are urgent fixes, created from `main` and merged into both `main` and `develop`.

Pros: a clear process for projects with scheduled releases (including mobile ones, where users cannot be rolled back to an older version). Cons: many long-lived branches, painful merges, and slow delivery of changes. For continuous delivery, simpler approaches such as trunk-based development or GitHub Flow are often chosen.
