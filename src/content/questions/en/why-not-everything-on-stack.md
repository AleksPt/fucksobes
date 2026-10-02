---
title: "Why don't we store everything on the stack? Why don't we store reference types on the stack?"
category: memory
order: 9
---

The stack is very fast: memory is allocated on entering a function and freed on exit by simply moving the stack pointer. But it is tied to the function call. The heap is needed when memory must have a dynamic lifecycle; the price is searching for a free block, synchronization between threads, and reference counting.

Class instances are usually placed on the heap (the optimizer may put an object that does not leave the function on the stack, which is called stack promotion): they have reference semantics and identity, and several references can share one instance. The reference itself, meanwhile, lies on the stack.
