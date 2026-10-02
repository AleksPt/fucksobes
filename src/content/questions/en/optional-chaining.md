---
title: "What is optional chaining?"
category: swift
order: 110
---

Optional chaining is a way to access a property, method, or subscript of an optional that may be `nil`. If a `nil` is encountered in a `?.` chain, the rest of the chain is not executed, and the whole expression is `nil`. If there is a value, the call is performed as usual.

```swift
let city = person?.address?.city        // String?
person?.address?.updateZip("101000")   // runs only if person and address are not nil
if let count = list?.items.count { print(count) }
```

The result type is always optional, even if the member itself is not optional (for example, `Int?` instead of `Int`), and multiple levels of nesting do not create nested optionals. This lets you safely walk a chain of related objects without nested `if let`, and together with `??` provide a default value. It is a safe alternative to forced unwrapping.
