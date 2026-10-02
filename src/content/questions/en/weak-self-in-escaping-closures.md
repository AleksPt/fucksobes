---
title: "We have an escaping closure, and in this closure we capture self. Do we always need to specify weak self in closures?"
category: memory
order: 43
---

**Not always.** You need to look at whether we reference the object strongly. If the reference is weak, for example in a short animation, `weak self` is not required.

1. You **need** `weak self` if:
    - the closure is stored and runs later (for example, in a network request);
    - you need to avoid a **retain cycle**, where `self` holds the closure and the closure holds `self`.
2. You **can skip** `weak self` if:
    - the closure runs immediately (a non-escaping closure);
    - no retain cycle arises, for example in short-lived closures.
