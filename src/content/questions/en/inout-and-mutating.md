---
title: "The inout and mutating keywords"
category: swift
order: 44
---

`inout` passes a variable into a function so that changes made inside are visible to the caller after the function returns.

Formally this is copy-in copy-out (call by value result): the value is copied at the call, the copy is modified in the body, and on return it is assigned to the original. So for a computed property or a property with observers, the getter runs at the call and the setter on return. An optimization: if the argument is stored at a physical address in memory, the same memory location is used both inside and outside the function (call by reference). Write your code so that it behaves correctly with or without this optimization.

`mutating` is placed before `func` in a method of a struct or enum. By default, methods of value types cannot change their properties; `mutating` allows this (including assigning a new instance to `self`). Mechanically it is the same `inout`: in a mutating method, `self` is passed as `inout` (in SIL the method takes `@inout Point`). That is why such a method cannot be called on a constant (`let`): a constant cannot be passed as `inout`.

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
