---
title: "We have an escaping closure, and in this closure we capture self. Do we always need to specify weak self in closures?"
category: memory
order: 43
---

**Not always.** `weak self` is needed only if a retain cycle can arise: the closure holds `self`, and `self` (directly or through a chain) holds the closure. If the closure is not stored anywhere by `self`, for example in a short animation, there is no cycle and `weak self` is not required: the closure only extends the life of `self` briefly.

1. You **need** `weak self` if:
    - the closure is stored and runs later (for example, in a network request);
    - you need to avoid a **retain cycle**, where `self` holds the closure and the closure holds `self`.
2. You **can skip** `weak self` if:
    - the closure runs immediately (a non-escaping closure);
    - no retain cycle arises, for example in short-lived closures.
