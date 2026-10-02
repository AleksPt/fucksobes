---
title: "What is conditional conformance? How do you implement it and what is it used for?"
category: swift
order: 103
---

Conditional conformance means conforming to a protocol conditionally: a generic type conforms to the protocol only when its parameters satisfy given requirements. It is written in an `extension` with a `where` clause.

```swift
extension Array: Equatable where Element: Equatable {}   // an array is comparable if its elements are comparable

struct Box<T> { let value: T }
extension Box: Codable where T: Codable {}
```

`[Int]` gets `Equatable`, while an array of functions does not. This is how the standard library gives `Array`, `Optional`, `Dictionary`, and other types `Equatable`, `Hashable`, and `Codable` without manual implementation. Since Swift 4.1, conditional conformance is supported at the language level.

It is used so that wrapper types automatically repeat the capabilities of the types they contain, without imposing extra constraints on the generic itself. Limitations: you cannot conform the same type to a protocol through several overlapping extensions, and at runtime a cast `as? Protocol` takes the conditions into account.
