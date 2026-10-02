---
title: "What is map?"
category: swift
order: 27
---

`map(_:)` is a `Sequence` method that returns an array of the results of applying the given closure to each element of the sequence. The closure can return a value of the same type or a different one.

```swift
let cast = ["Vivien", "Marlon", "Kim", "Karl"]
let letterCounts = cast.map { $0.count }
// [6, 6, 3, 4]
```
