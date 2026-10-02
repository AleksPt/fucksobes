---
title: "How does Array work? Is it true that it is a value type?"
category: algorithms
order: 30
---

`Array` is a struct (a value type with value semantics), but its elements live in a separate buffer on the heap: the struct itself stores only a reference to that buffer (8 bytes). The buffer holds a header (element count, capacity) followed by the elements stored contiguously.

Key points:

- **Index access** is `O(1)` because the elements sit in contiguous memory.
- **Appending to the end** is amortized `O(1)`: when `capacity` runs out, a buffer roughly twice as large is allocated and the elements are moved over (`O(n)`).
- **Inserting and removing in the middle** is `O(n)`: the elements have to be shifted.
- **Copy-on-Write**: assignment copies only the reference to the buffer; a real copy is made on the first write to one of the instances, if the buffer is shared.
- The size of the struct itself is fixed while the buffer is dynamic: an array can be mutated, yet the variable holding it remains a single reference.
- For types that don't need Objective-C bridging there is `ContiguousArray` (faster on Apple platforms because it doesn't support `NSArray`), and `ArraySlice` is a view into part of an array without copying.

If the size is known in advance, `reserveCapacity(_:)` avoids reallocations.
