---
title: "What is the difference between static and final?"
category: swift
order: 133
---

These are modifiers for different purposes.

- `static` makes a property or method belong to the type itself rather than to an instance: you call them through the type name (`Config.shared`), not through an object. In classes, `static` is equivalent to `final class`, meaning such a member cannot be overridden in a subclass (unlike `class`).
- `final` prohibits inheriting from a class or overriding a specific method, property, or subscript in subclasses.

```swift
final class Service {              // Service cannot be subclassed
    static let shared = Service()  // a type member
    final func run() {}            // cannot be overridden (redundant in a final class)
}
```

`final` helps the compiler call methods directly, without a virtual method table, which is slightly faster, and expresses the intent explicitly. `static` describes where a member lives: on the type or on the instance.
