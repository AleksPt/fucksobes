---
title: "What are computed properties?"
category: swift
order: 120
---

A computed property does not store a value; it computes it on access using `get`, and, if needed, lets you write a value through `set`. It is declared only as `var` and with an explicit type.

```swift
class Weight {
    var kilograms: Float = 0.0
    var pounds: Float {
        get { kilograms * 2.205 }
        set { kilograms = newValue / 2.205 }   // newValue is the implicit parameter name
    }
}

let w = Weight()
w.kilograms = 100
print(w.pounds)      // 220.5
w.pounds = 315
print(w.kilograms)   // 142.85715
```

If there is only a `get`, the property is read-only, and the `get` keyword can be omitted (the body is written directly). Computed properties are available in classes, structs, enums, and extensions (unlike stored properties). The value is recalculated on every access, so heavy computations are better cached in a `lazy` property, and data that must be stored belongs in a stored property with `willSet` and `didSet` observers.
