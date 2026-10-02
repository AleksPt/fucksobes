---
title: "How do you make a custom struct conform to the Equatable protocol?"
category: swift
order: 60
---

It is enough to declare `Equatable` conformance in the type declaration itself: if all of the struct's stored properties conform to `Equatable`, the compiler synthesizes the implementation automatically (for an `enum`, if all associated values do).

```swift
struct Point: Equatable {
    var x: Int
    var y: Int
}
```

If these conditions are not met, the conformance is added in an extension, or you need custom behavior, implement `==` as a static method of the type; the standard library provides `!=` itself. The `==` operator must be an equivalence relation: reflexive (`a == a`), symmetric, and transitive.

```swift
struct User: Equatable {
    var id: Int
    var cachedName: String

    static func == (lhs: User, rhs: User) -> Bool {
        lhs.id == rhs.id
    }
}
```
