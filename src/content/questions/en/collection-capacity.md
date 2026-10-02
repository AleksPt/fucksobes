---
title: "The `capacity` property of Array and Set"
category: algorithms
order: 8
---

It shows how many elements the collection has already allocated memory for.

If the final number of elements is known in advance, `reserveCapacity(_:)` allocates memory once, and the collection doesn't reallocate its buffer as it grows (this avoids `O(n)` rebuilds and speeds up filling it). Capacity grows not one element at a time but with headroom (usually doubling).
