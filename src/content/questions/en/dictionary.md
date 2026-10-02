---
title: "What is a dictionary? How could you write your own?"
category: algorithms
order: 9
---

`Dictionary<Key, Value>` is a collection of key-value pairs implemented as a hash table, which gives fast access to entries. The key can be any `Hashable` type, including a custom one.

```swift
struct GridPoint { var x: Int; var y: Int }
extension GridPoint: Hashable {
    static func == (l: GridPoint, r: GridPoint) -> Bool { l.x == r.x && l.y == r.y }
    func hash(into hasher: inout Hasher) { hasher.combine(x); hasher.combine(y) }
}
var names: [GridPoint: String] = [GridPoint(x: 2, y: 3): "A"]
names[GridPoint(x: 2, y: 3)] // Optional("A")
```

The standard library implementation is a hash table with open addressing and linear probing (see the Swift source).
