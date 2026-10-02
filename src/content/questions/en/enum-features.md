---
title: "Name the features of enums in Swift"
category: swift
order: 91
---

An `enum` in Swift is a full-fledged type, not just a set of constants:

- **an enumeration value** is a type with a limited set of cases (`case`), and the compiler checks that a `switch` is exhaustive;
- **associated values** — each case can carry data of different types: `case success(Data)`, `case failure(Error)`;
- **raw values** — all cases have values of the same type (`Int`, `String`); for `String` and `Int` they can be inferred automatically, and you can create an enum from a raw value with `init?(rawValue:)`;
- **properties and methods**: computed properties, methods, initializers, static members and extensions, and protocol conformance;
- **a value type**: it is copied when passed, and methods that modify it are marked `mutating`;
- **`CaseIterable`** provides the `allCases` collection;
- **`indirect`** allows recursive enums.

An enum cannot have stored instance properties: only computed and static ones. It is a convenient foundation for states, operation results, and finite state machines.
