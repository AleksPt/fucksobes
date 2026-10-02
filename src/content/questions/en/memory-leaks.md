---
title: "Tell me what a memory leak is. How do you find them?"
category: memory
order: 48
---

In Swift, a memory leak most often comes from a retain cycle: class instances hold each other with strong references and therefore are never freed. An example is a closure stored in an instance's property that captures `self`.

**How to find them**

- **Debug Memory Graph** in Xcode: shows the app's objects and heap allocations and the references between them; with Malloc Stack logging enabled, you can see where a node was allocated.
- **Allocations** in Instruments: the size and number of allocations; the Generations view (Mark Generation before and after a scenario) helps isolate allocations that remain after a specific feature.

**How to fix them:** make one of the references in the cycle `weak` or `unowned`; for closures, specify a capture list.

