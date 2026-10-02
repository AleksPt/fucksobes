---
title: "What is the difference between nil and .none?"
category: swift
order: 18
---

For `Optional` there is no difference: `nil` is `.none`. Nuances appear in two cases:

- for a nested optional `Int??`, `nil` means the outer `.none`, while `.some(nil)` is the outer `.some` holding an inner `nil`, so it is not equal to `nil`;
- if the wrapped type has its own `.none` case, then in the context of `E?` the spelling `.none` is read as `Optional.none` (the compiler warns), while `E.none` is `.some(.none)`.

```swift
let x: Int?? = .some(nil)
x == nil            // false

enum E { case none }
let a: E? = .none   // Optional.none, that is nil
let b: E? = E.none  // .some(.none), not nil
```
