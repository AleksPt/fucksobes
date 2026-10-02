---
title: "If you capture a struct in an escaping closure, is it captured on the stack or on the heap?"
category: memory
order: 13
---

On the heap.

A value captured by an `@escaping` closure must outlive the function call, so it cannot be left in the stack frame: the compiler puts the captured variable into a separate "box" on the heap, and the closure holds a reference to it. Capture is by reference to the variable, not by a copy of the value: if the struct is modified after the closure is created, the closure sees the change (and vice versa). To fix the value as of the moment the closure is created, specify it in the capture list (`[value]`). Non-escaping closures may avoid heap allocation.
