---
title: "What is the difference between the Sequence, Collection, BidirectionalCollection and RandomAccessCollection protocols?"
category: algorithms
order: 31
---

These are a hierarchy of standard library protocols, where each level adds guarantees.

- **`Sequence`** — a sequence that can be traversed (`makeIterator()`, `for-in`, `map`, `filter`). It does not guarantee that the traversal can be repeated: a sequence may be single-pass (a data stream).
- **`Collection`** — a `Sequence` that can be traversed multiple times, with indices (`startIndex`, `endIndex`, `subscript`), `count` and slices. Examples: `Set`, `Dictionary`.
- **`BidirectionalCollection`** — a collection that can be traversed in both directions (`index(before:)`): `last` and `reversed()` are available in `O(1)`. Example: `String` (by characters).
- **`RandomAccessCollection`** — a bidirectional collection where moving an index by an arbitrary number of positions takes `O(1)` (`index(_:offsetBy:)`), so `count` and index access are fast. Examples: `Array`, `ArraySlice`, `ContiguousArray`, `Range<Int>`.

There are also `MutableCollection` (elements can be changed by index) and `RangeReplaceableCollection` (insertion and removal). Algorithms are written against the weakest suitable protocol, and complexity depends on the level: for example, `count` can be `O(n)` for a `Collection` but is `O(1)` for a `RandomAccessCollection`.
