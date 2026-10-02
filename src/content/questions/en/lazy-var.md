---
title: "What is lazy var? What is it used for?"
category: swift
order: 98
---

`lazy var` is a stored property whose initial value is computed not when the instance is created but on first access. After that the value is stored and is not computed again.

```swift
class Report {
    lazy var data: [Int] = loadHugeData()   // loaded only on first access
}
```

It is used when initialization is expensive (loading data, heavy objects) or depends on other properties of the instance (the closure can refer to `self`). Limitations: it must be a `var` (the value is computed after initialization), it is not thread-safe (a simultaneous first access from different threads may run the initialization twice), and it does not behave like a computed property: the value is not recalculated. In structs, accessing it requires `mutating`, since it changes the instance.
