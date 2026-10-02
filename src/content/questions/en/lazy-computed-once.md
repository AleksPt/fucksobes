---
title: "Can lazy properties be computed more than once?"
category: swift
order: 105
---

No. The value of a `lazy var` is computed on first access and stored in the property, and on subsequent accesses the stored value is returned, without running the initialization code again.

```swift
class Sample {
    var a = 10, b = 2
    lazy var sum: Int = { print("computing"); return a + b }()
}

let s = Sample()
s.sum          // "computing", 12
s.a = 20
s.sum          // 12: no recalculation
```

That is why `lazy` is not suitable for a value that must follow changes in other properties: use a computed property for that. A `lazy` value can be recomputed only by manually assigning it a new value: it is a `var`. A caveat: without synchronization, the first access from several threads at the same time may run the initialization more than once, because `lazy` is not thread-safe.
