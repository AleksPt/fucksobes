---
title: "With which dependencies will the final app be larger?"
category: tooling
order: 9
---

As a rule, the app is **larger** with **static dependencies**: at link time a library's code is copied into every binary that uses it (the app, extensions, frameworks), and if several targets link the same library, its code is duplicated. A dynamic framework sits in the bundle as a single copy, but in full, and it also takes up space in the app, so the difference depends on how many binaries use the dependency.
