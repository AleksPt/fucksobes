---
title: "How are value and reference types stored in memory?"
category: memory
order: 6
---

A struct's value is stored "in place": its fields lie directly in the variable, for example in a function's stack frame. Assignment creates an independent copy (value semantics).

For a class, the variable on the stack holds only a reference, while the instance itself is allocated on the heap. Besides the fields, Swift adds bookkeeping data, including the reference count (in the WWDC16 example, a class instance with two fields takes four words versus two for a struct). Assignment copies the reference, and both variables point to the same instance (reference semantics).
