---
title: "Are Swift's standard data types thread-safe?"
category: concurrency
order: 58
---

Values of standard types with value semantics (`Int`, `String`, `Array`, `Dictionary`) can be safely passed between concurrent contexts: copies are independent (with copy-on-write) and have no shared mutable state. That is why collections are conditionally `Sendable`: `Array: Sendable where Element: Sendable`.

If the elements are reference types or closures with mutable state, the guarantee disappears: copies of the array point to the same objects, and changes to an object are visible from both copies.
