---
title: "How do you find the common elements of two arrays? What is the complexity?"
category: algorithms
order: 29
---

The simplest way is to turn the arrays into sets and take the intersection:

```swift
let a = [1, 3, 5, 7, 9]
let b = [0, 3, 4, 7, 8]
let common = Set(a).intersection(b)   // [3, 7], order is undefined
```

Complexity: creating a `Set` from an `Array` is `O(n)`, and the intersection is `O(min(n, m))` on average (for each element of the smaller set, a `contains` check in `O(1)`), so `O(n + m)` in total. Extra memory is `O(n)`. The hash table makes lookup fast, but the elements must be `Hashable`, and order and duplicates are lost.

Alternatives:

- two nested loops — `O(n·m)`, no extra memory, suitable only for small arrays;
- sort both arrays and use two pointers — `O(n log n + m log m)`, extra memory `O(1)`, preserves order and accounts for duplicates;
- if you need to preserve the order of the first array: `a.filter(Set(b).contains)`.
