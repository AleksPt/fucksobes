---
title: "Complexity (Big-O) of inserting into a dictionary"
category: algorithms
order: 13
---

`O(1)` on average (amortized), `O(n)` in the worst case.

On average an insertion takes constant time: the key's hash is computed and the bucket is determined. But when the hash table's load exceeds the allowed threshold, `Dictionary` allocates a larger buffer, recomputes the hashes and moves all the elements (`O(n)`); this happens rarely, so the amortized cost stays `O(1)`. The worst case is also possible with massive hash collisions.

Unnecessary reallocations can be avoided if the size is known: `reserveCapacity(_:)` allocates memory up front. For `Array`, appending to the end is likewise amortized `O(1)` with rare `O(n)` reallocations when capacity runs out, while insertion in the middle or at the beginning is `O(n)`.
