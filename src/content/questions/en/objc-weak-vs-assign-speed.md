---
title: "Which is faster in Objective-C: weak or assign (unsafe_unretained), and why?"
category: memory
order: 64
---

`assign` (`unsafe_unretained`) is faster. Assigning to such a property is simply storing a pointer: neither the reference count nor the runtime is involved. The price is lack of safety: after the object is deallocated, the pointer is left "dangling", and accessing it causes a crash.

`weak` has overhead: on assignment, the runtime (`objc_storeWeak`) registers the reference in a special weak-reference table tied to the object, and when the object is deallocated, it walks that table and zeroes all weak references to it. These operations require locking and table lookups, so they are more expensive, but they are safe: the reference automatically becomes `nil`.

Conclusion: `weak` is the default for non-owning references (delegates, parent), while `assign` suits primitives and rare cases where speed matters and the object is guaranteed to outlive the reference. In Swift, the analogs are `weak` and `unowned(unsafe)`.
