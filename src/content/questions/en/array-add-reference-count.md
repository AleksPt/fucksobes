---
title: "What happens to references when you add an object to an array?"
category: memory
order: 46
---

The object's reference count **increases by 1**: the collection keeps the object alive as long as it is inside.

To store weak references in an array (for example, to delegates) and avoid retain cycles, use `NSPointerArray` or custom solutions.
