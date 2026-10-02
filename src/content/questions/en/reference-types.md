---
title: "Strong, weak, and unowned in Swift: definitions, and which to use in which cases?"
category: memory
order: 24
---

These references manage memory and prevent retain cycles.

**Strong**

- Increments the object's reference count and keeps it in memory.
- Used when an object must stay in memory as long as a reference to it exists.
- Can cause problems: retain cycles; also, it is not always possible to make strong references valid right when the object is created, for example with delegates.

**Weak**

- Is not counted in reference counting and solves the problem of back references.
- The object can be destroyed even if weak references point to it. The weak reference then becomes `nil` (is zeroed).

**Unowned**

- A kind of weak reference designed for strict validity invariants: it is not counted in reference counting and is not zeroed, continuing to hold the object's address.
- It is expected to always point to an existing object. Trying to read a nonexistent object crashes the app with an error.
- Used when you are sure the object will exist as long as or longer than the reference to it; for example, to guarantee that the object isn't freed until some code has run. A clear reason to use `unowned` is still debated, but the arguments boil down to ease of debugging.
