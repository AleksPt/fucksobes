---
title: "What is forced unwrapping?"
category: swift
order: 111
---

Forced unwrapping is the `!` operator after an optional: it extracts the value, and if it is `nil`, the program terminates with a runtime error (`Fatal error: Unexpectedly found nil while unwrapping an Optional value`). In effect, you are promising the compiler that there is definitely a value.

```swift
let value: Int? = 1
let a: Int = value!          // 1

let none: Int? = nil
let b = none!                // crash
```

It is used when `nil` would mean a programmer error (for example, `URL(string: "https://apple.com")!` for a string known to be valid, or an `IBOutlet`). In other cases, safe approaches are preferred: `if let`, `guard let`, `??`, and optional chaining. Forced casting with `as!` works the same way: if the types do not match, the app crashes.
