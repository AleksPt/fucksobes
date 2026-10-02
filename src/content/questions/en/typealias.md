---
title: "What is typealias in Swift?"
category: swift
order: 47
---

An alias for an existing data type. No new type is created: the compiler treats the alias and the original type as the same.

```swift
typealias Dollar = Double
typealias Weight = Float

let totalCosts: Dollar = 10.5
let mass: Weight = 150.0 + 70.0
```

It is used to:

- give a complex type a short, clear name: `typealias Handler = (Result<Data, Error>) -> Void`;
- express the meaning of a value (`typealias UserID = Int`) without creating a new type;
- shorten long compound types: tuples, closures, protocol compositions (`typealias Codable = Encodable & Decodable`);
- introduce aliases so that a type can be changed in one place (for example, when switching from `Float` to `Double`).

An alias provides no additional type safety: `UserID` and `Int` are interchangeable, and a separate struct is needed for a strict distinction.
