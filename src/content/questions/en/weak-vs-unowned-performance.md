---
title: "Which reference is more performant, weak or unowned?"
category: memory
order: 29
---

The difference between `weak` and `unowned` is small, but neither reference is free.

- **`weak` is "heavier":**
    - on the first `weak` reference the object gets a side table, and all `weak` references point to it (extra memory);
    - every `weak` read goes through the side table and checks whether the object is still alive, returning `nil` otherwise.
- **`unowned` is lighter:**
    - no side table is needed, the reference points straight at the object;
    - but it is counted in a separate unowned count (updated atomically), and on every read the runtime checks that the object is still alive, otherwise it terminates the program (a trap);
    - only `unowned(unsafe)` works without counting and checks, but then the reference can dangle.
