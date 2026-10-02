---
title: "The `inout` modifier"
category: swift
order: 43
---

Function parameters are constants by default. A parameter with the `inout` modifier (written before the type) receives a value at the call, is modified inside the function, and is passed back, replacing the original value, so the changes persist after the call.

Only a variable can be passed as the argument (not a constant or a literal), and `&` is placed before it. `inout` parameters cannot have default values, and variadic parameters cannot be marked `inout`.

```swift
func swapTwoInts(_ a: inout Int, _ b: inout Int) {
    let temporaryA = a
    a = b
    b = temporaryA
}

var someInt = 3
var anotherInt = 107
swapTwoInts(&someInt, &anotherInt)
// someInt == 107, anotherInt == 3
```
