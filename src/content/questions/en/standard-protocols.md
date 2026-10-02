---
title: "What default protocols are there in Swift besides Hashable? What do they mean?"
category: swift
order: 59
---

The main standard library protocols:

- **`Equatable`** — values can be compared for equality with `==` and `!=`; it is the base for `Hashable` and `Comparable`. The implementation is synthesized automatically if the type meets the conditions and the conformance is declared in the type declaration itself.
- **`Comparable`** — types with a natural order; it inherits `Equatable`, so the only operator you must write is `<` (`==` comes from `Equatable` and is usually synthesized), and the remaining comparison operators (`>`, `<=`, `>=`) are provided by the standard library. For such elements, `sort()` is available without arguments.
- **`Identifiable`** — a stable identity of a value (the `id` property); for classes there is a default implementation based on `ObjectIdentifier`, unique only for the lifetime of the object.
- **`CustomStringConvertible`** — a custom text representation through `description`; it is used by `print(_:)` and `String(describing:)`.
- **`Codable`** — a typealias for `Decodable & Encodable`: the type can be converted to an external representation and back.
- **`CaseIterable`** — a collection of all values of the type, `allCases`; for enums without associated values, the compiler synthesizes it automatically.
