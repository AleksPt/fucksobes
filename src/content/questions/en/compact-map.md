---
title: "What is compactMap?"
category: swift
order: 28
---

`compactMap(_:)` on `Sequence` returns an array of the non-`nil` results of calling the given closure on each element. It is used when the transformation returns an optional but you need an array of non-optional values.

```swift
let possibleNumbers = ["1", "2", "three", "///4///", "5"]

let mapped: [Int?] = possibleNumbers.map { Int($0) }
// [1, 2, nil, nil, 5]

let compactMapped: [Int] = possibleNumbers.compactMap { Int($0) }
// [1, 2, 5]
```

The complexity is O(n), where n is the length of the sequence.
