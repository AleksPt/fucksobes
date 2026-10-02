---
title: "When does stack allocation happen?"
category: memory
order: 74
---

Stack memory is allocated **on entering a scope**, that is, a function call, a closure, or a block of code, and is freed automatically on exit, without ARC's involvement.

The condition for a value to be placed on the stack: **its size must be known at compile time**. For every value, the compiler knows in advance how many bytes to take on the stack and simply shifts the stack pointer by the required amount, which is a very cheap operation.

The following are placed on the stack:

- local variables of primitive and fixed-size value types (`Int`, `Bool`, simple `struct`s with no variable-size reference fields);
- function parameters and the return address;
- the **stack frame** structure itself for each function call.

As soon as execution leaves the scope (the function returns, the closure finishes), the stack pointer moves back and all of the frame's memory is freed instantly: no reference counting or garbage collection is required.

```swift
func makePoint() -> CGPoint {
    let point = CGPoint(x: 1, y: 2) // allocated on the stack on entering makePoint
    return point                     // copied by value into the caller's frame
}                                     // makePoint's stack frame is freed here
```

If a value's size is not known in advance (for example, a `class`, or a `struct` that stores a collection whose size varies), the compiler cannot reserve a fixed place for it on the stack: such values (or part of them) go to the heap, and only a pointer to them stays on the stack.
