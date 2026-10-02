---
title: "What is the difference between assign and retain?"
category: memory
order: 60
---

These are property attributes in Objective-C that define how a value is stored.

- `retain` (under ARC it corresponds to `strong`) — the property owns the object: on assignment the reference count is incremented and the old value is released. The object lives as long as at least one strong reference to it exists.
- `assign` — a plain assignment with no ownership and no change to the count. It suits primitives (`int`, `BOOL`, `CGFloat`). For objects it is unsafe: after the object is deallocated, the property is left with a "dangling" pointer, and accessing it will crash.

For non-owning references to objects, use `weak` (zeroed automatically when the object is deallocated) or `unsafe_unretained`, the `assign` analog for objects. In Swift they correspond to `strong` (the default), `weak` and `unowned` (the safe one), and `unowned(unsafe)` (the analog of `assign`/`unsafe_unretained`).
