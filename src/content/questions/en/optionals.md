---
title: "What is an optional? How does it work?"
category: swift
order: 15
---

`Optional` is the type Swift uses whenever it works with an optional value. It is a convenient mechanism for cases where a variable's value may be absent. It is implemented as an enum: it contains either a value or `nil`.

```swift
public enum Optional<Wrapped>: ExpressibleByNilLiteral {
    case none
    case some(Wrapped)
}
```

Working with optionals:

- force unwrapping;
- `map` — transforms an optional if it contains a value, and does nothing if it is empty;
- `flatMap` — helps remove an extra level of `Optional`;
- nil coalescing (`??`).
