---
title: "The inout and mutating keywords"
category: swift
order: 44
---

`inout` marks a function parameter: the value is passed in, the function can modify it, and after returning, the new value replaces the original in the caller. Function parameters are constants by default, and arguments are passed by value. An inout argument must be a variable, and `&` is placed before it at the call site. Such parameters cannot have default values, and variadic parameters cannot be `inout`.

Formally this is copy-in copy-out: the value is copied at the call, the copy is modified in the body, and on return it is assigned to the original. An optimization: if the argument is stored at a physical address, the same memory location is used (call by reference).

`mutating` is placed before `func` in a method of a struct or enum. By default, methods of value types cannot change their properties; `mutating` allows this (including assigning a new instance to `self`). Such a method cannot be called on a constant (`let`) of a struct type.

```swift
func swapTwoInts(_ a: inout Int, _ b: inout Int) {
    (a, b) = (b, a)
}

struct Point {
    var x = 0.0, y = 0.0
    mutating func moveBy(x dx: Double, y dy: Double) {
        x += dx
        y += dy
    }
}
```
