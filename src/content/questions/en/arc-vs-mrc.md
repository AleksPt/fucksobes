---
title: "What is ARC? What is the difference between ARC and MRC?"
category: memory
order: 21
---

**ARC** (Automatic Reference Counting) is automatic reference counting. **MRC** (Manual Reference Counting) is manual management of the reference count.

Every object has a counter showing how many references point to it. When the counter reaches zero, the object is freed from memory.

- In **MRC**, the developer calls `alloc`, `retain`, `release`, `autorelease`, and `dealloc` by hand. This raises the risk of leaks and errors such as double free.
- In **ARC**, it is all the same, but the compiler inserts the `retain` and `release` calls itself at compile time. The reference counting itself still happens at runtime.

**Why we don't use MRC:**

- MRC is more complex and demands more attention to memory.
- ARC saves developers' time and makes code safer and simpler.

A **retain cycle** occurs when two objects hold strong references to each other: the reference count never reaches zero, and the objects are not freed.
