---
title: "Inout. If we pass a value type through inout inside a method, where will it be stored: on the heap or on the stack?"
category: memory
order: 14
---

In the same place where the original variable lives: `inout` does not copy the value into a separate area. The type is known at compile time, so its size is known too, and the parameter is passed by address: a local variable stays on the stack, a property of a class instance stays on the heap together with the object.

Formally, `inout` works as copy-in copy-out, but for a value stored at a physical address, the call-by-reference optimization uses the same memory location. A temporary copy is needed, for example, for a computed property: its getter and setter are called.
