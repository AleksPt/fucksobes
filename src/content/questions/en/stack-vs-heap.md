---
title: "What are the stack and the heap?"
category: memory
order: 2
---

The stack is used for static memory allocation, and the heap for dynamic allocation. Both live in RAM.

- Where a value lives depends not on "value or reference" but on its size and lifetime. Class instances are usually on the heap (the optimizer may put an object that does not leave the function on the stack), while the reference to them lies on the stack. Value types are usually on the stack, but end up on the heap if they are a class field, are captured by an escaping closure, do not fit into an existential container, or store their data indirectly (`Array`, `String`).
- The stack is faster than the heap.
- There is one heap per app, while a stack is created for each thread.
