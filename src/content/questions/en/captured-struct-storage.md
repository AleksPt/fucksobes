---
title: "If you capture a struct in an escaping closure, is it captured on the stack or on the heap?"
category: memory
order: 13
---

On the heap.

A value captured by an `@escaping` closure must outlive the function call, so it cannot be left in the stack frame: the compiler puts the captured variable into a separate "box" on the heap, and the closure holds a reference to it. A `var` is captured by reference to the variable: if the struct is modified after the closure is created, the closure sees the change (and vice versa). A `let` and values in the capture list (`[value]`) are copied into the closure's context at the moment it is created, without a separate box. Non-escaping closures may avoid heap allocation.
