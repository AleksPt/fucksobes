---
title: "What is the difference between Void and ()?"
category: swift
order: 131
---

`Void` is an alias for the empty tuple: the standard library declares `typealias Void = ()`. So as types they are fully equivalent: `() -> Void` and `() -> ()` are the same function type.

The difference is that `()` is also a value — the only value of the empty tuple — while `Void` is only a type name. A function with no explicit return value returns `Void`, that is, `()`:

```swift
func log(_ message: String) { print(message) }   // returns ()
let result: Void = log("hi")                     // result == ()

let unit: () = ()                                // a value
```

By convention, `Void` is written in type declarations (`completion: () -> Void`) for readability, and `()` is used when you need a value or an empty parameter list.
