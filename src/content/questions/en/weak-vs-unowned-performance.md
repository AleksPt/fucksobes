---
title: "Which reference is more performant, weak or unowned?"
category: memory
order: 29
---

The difference between `weak` and `unowned` is minimal.

- **`weak` is "heavier":**
    - when the object is deallocated, ARC adds an operation to zero the `weak` reference;
    - each `weak` reference is tracked through a side table, which requires extra memory and time.
- **`unowned` is faster:**
    - it requires no extra memory management and works like a plain reference to the object;
    - there is no zeroing check, which makes it more performant where objects are freed often.
