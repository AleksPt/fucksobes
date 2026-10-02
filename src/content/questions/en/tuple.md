---
title: "What is a tuple?"
category: swift
order: 109
---

A tuple groups several values, possibly of different types, into a single compound value. It is often used to return several results from a function at once without creating a separate type.

Elements can be unnamed (accessed by index) or named:

```swift
let pair = ("Midhun", 7)
pair.0                                  // "Midhun"

let person = (name: "Midhun", age: 7)
person.name                             // "Midhun"

func minMax(_ a: [Int]) -> (min: Int, max: Int)? { ... }
let (lo, hi) = (1, 5)                   // decomposition
```

A tuple is a value type and is copied when passed. It can be compared with the `==` operator (for tuples of up to six elements, if the elements are `Equatable`) and used in a `switch` for pattern matching. It cannot conform to protocols or have methods, so for data that lives for a long time it is better to define a struct.
