---
title: "What is the Hashable protocol?"
category: algorithms
order: 14
---

`Hashable` is a protocol (it inherits `Equatable`) for types whose values can be hashed into an integer. Such types can be used as `Set` elements and as `Dictionary` keys.

The requirement is the `hash(into:)` method, in which you pass to `Hasher` via `combine(_:)` the same components that `==` compares. Equal instances must feed the same values in the same order. For structs whose properties are all `Hashable`, and for enums with `Hashable` associated values, the compiler synthesizes the implementation itself; enums without associated values become `Hashable` automatically.

```swift
extension GridPoint: Hashable {
    static func == (l: GridPoint, r: GridPoint) -> Bool { l.x == r.x && l.y == r.y }
    func hash(into hasher: inout Hasher) {
        hasher.combine(x)
        hasher.combine(y)
    }
}
```
