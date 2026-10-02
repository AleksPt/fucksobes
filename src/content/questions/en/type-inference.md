---
title: "What is type inference?"
category: swift
order: 128
---

Type inference is the compiler's ability to determine the type of a value or expression on its own from context, so you do not need to specify it explicitly. Swift nevertheless remains statically typed: the type is always known at compile time.

```swift
let name = "Hello"       // String
let count = 42           // Int
let price = 9.99         // Double
let flag = count > 10    // Bool

let names: [String] = [] // the type is needed here: it cannot be inferred from an empty literal
```

Literals have default types: integers are `Int`, floating-point numbers are `Double`, strings are `String`. You can specify the type explicitly when it is needed for context (`let x: Float = 1`), when it cannot be inferred, or when readability matters. Type inference also works for closures (`items.map { $0 * 2 }`), but overly complex expressions slow down compilation, and in that case you help the compiler by specifying the type explicitly.
