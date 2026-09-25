---
title: "оптимизация дженериков и как их можно ограничить"
category: swift
order: 69
---

- Протоколы:

```swift
   func compare<T: Comparable>(a: T, b: T) -> Bool {
       return a == b
   }
```

- **`where`**
