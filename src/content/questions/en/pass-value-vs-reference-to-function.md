---
title: "What happens if you pass a reference-type object and a value-type object to a function?"
category: swift
order: 147
---

**Value type** (struct, enum, tuple): the function receives an independent copy (semantically; in practice the compiler and copy-on-write often avoid actual copying). Parameters are immutable by default, and changes to the copy do not affect the original. To modify the original value, use `inout`.

**Reference type** (class): the reference to the same instance is copied. The function works with a shared object, so changes to its properties are visible outside. It cannot assign a different reference to the parameter (parameters are constants), and the object itself remains a single one.

```swift
struct P { var x = 0 }
final class C { var x = 0 }

func change(_ p: P, _ c: C) {
    var p = p; p.x = 1      // the original will not change
    c.x = 1                 // the original will change
}
```

By default, Swift passes arguments without extra retain/release (parameters are "borrowed" from the caller), so passing references is cheap. If a struct contains reference fields (an array, a string, a class), copying it increments the reference count of each of them.
