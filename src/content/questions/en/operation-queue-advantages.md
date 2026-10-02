---
title: "Why was OperationQueue created, and how does it extend GCD's capabilities?"
category: concurrency
order: 43
---

`OperationQueue` lets you:

- cancel tasks, including after they have started (through `isCancelled`);
- build a hierarchy of dependencies and a sequence for executing tasks;
- track task states.
