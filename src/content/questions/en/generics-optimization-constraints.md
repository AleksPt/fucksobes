---
title: "Generics optimization and how they can be constrained"
category: swift
order: 69
---

- Protocols:

```swift
func compare<T: Comparable>(a: T, b: T) -> Bool {
    return a == b
}
```

- **`where`**
