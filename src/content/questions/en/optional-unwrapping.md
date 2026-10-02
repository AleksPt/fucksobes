---
title: "Ways to unwrap an optional (plus compactMap on arrays)"
category: swift
order: 17
---

An optional either contains a value or is `nil`. When accessing it, you need to handle both cases; the ways to do so:

- **Optional binding** (`if let`, `guard let`, `while let`): checks whether a value is present and makes it available as a temporary constant or variable. The shorthand `if let value { ... }` is allowed. Constants from `if let` are visible only inside the `if` body, and those from `guard` are visible in the code after it.
- **Nil-coalescing** (`??`): substitutes a default value if the left side is `nil`.
- **Force unwrapping** (`!`): extracts the value and stops execution if it is `nil`; used when `nil` would mean an unrecoverable error.
- **Optional chaining** (`?.`): accessing a property or method on an optional; on `nil` the chain returns `nil`.

For arrays, `compactMap(_:)` applies a closure that returns an optional and collects into an array only the results that are not `nil`:

```swift
let possibleNumbers = ["1", "2", "three", "///4///", "5"]

let mapped: [Int?] = possibleNumbers.map { str in Int(str) }
// [1, 2, nil, nil, 5]

let compactMapped: [Int] = possibleNumbers.compactMap { str in Int(str) }
// [1, 2, 5]
```
