---
title: "What are the drawbacks of a monolithic app architecture?"
category: architecture
order: 60
---

A monolith is an app in which all the code lives in one module (a single Xcode target) and is tightly coupled.

Drawbacks:

- **slow builds**: a change in one place rebuilds a lot of code, and incremental builds are ineffective;
- **tight coupling**: any part can be called from any other, there are no boundaries between modules, and the code turns into "spaghetti";
- **hard to test** and to reuse individual parts;
- **conflicts and team dependency**: everyone edits the same code, and it is hard to distribute responsibility;
- **growing complexity**: it is hard to understand the code and make changes, and the risk of regressions grows;
- **no independent development and release** of individual parts, and it is hard to replace a technology partially.

Pros of a monolith: it is simple to start, there is no overhead from inter-module interfaces, and debugging is convenient. That is why small projects often start as a monolith and, as they grow, extract modules (SPM packages, frameworks) with clear boundaries and public interfaces. A similar problem exists on the server side, where a monolith is split into microservices.
