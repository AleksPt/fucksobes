---
title: "How is Any implemented under the hood?"
category: swift
order: 142
---

`Any` is an existential type: a value of any type is stored in a fixed-size container (an existential container). On a 64-bit platform it takes 32 bytes (`MemoryLayout<Any>.size == 32`):

- **a buffer of 3 machine words (24 bytes)** for the value itself;
- **a pointer to the type metadata (8 bytes)**, which is used at runtime to determine what is stored inside (needed for `as?`, `type(of:)`, and copying and destroying the value).

There is no protocol witness table for `Any`, because it has no requirements. If the value fits in 24 bytes (`Int`, `Double`, a small struct), it is stored directly in the buffer. If it is larger, Swift allocates memory on the heap (a box), and the buffer holds a pointer to it. Reference types take one word.

So `Any` provides flexibility at the cost of extra memory, possible allocations, and the loss of static type information: to work with the value you have to cast it with `as?`. `AnyObject` is simpler: it is just a pointer to an object (8 bytes).
