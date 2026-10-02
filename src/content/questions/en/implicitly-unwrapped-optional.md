---
title: "What is an implicitly unwrapped optional?"
category: swift
order: 112
---

An implicitly unwrapped optional is declared with `!` instead of `?` (`var name: String!`). It is an ordinary optional whose value the compiler unwraps automatically on access. If it turns out to be `nil`, the program crashes, just as with forced unwrapping.

```swift
var name: String! = "Virat"
let student: String = name   // unwrapped automatically
name = nil
let player: String = name    // crash: there is no value
let other = name             // without a type annotation it becomes an ordinary String?, no crash
```

If the type is not specified explicitly, the value is stored as an ordinary optional and is unwrapped only where it cannot be avoided.

It is used when the value will definitely appear right after initialization, but not in the initializer itself: for example, `@IBOutlet` (populated when the view is loaded) or properties that are set right after the object is created and will never become `nil` again. If the value can go away, use an ordinary optional.
