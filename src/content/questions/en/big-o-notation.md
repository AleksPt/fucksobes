---
title: "What is Big-O notation? What is it used for?"
category: algorithms
order: 26
---

Big-O describes how an algorithm's running time (or memory use) grows with the size of the input `n`. The notation gives an upper bound on growth and drops constants and lower-order terms: `3n + 10` is `O(n)`.

Common classes, from fastest to slowest:

- `O(1)` — constant time: accessing an array element by index;
- `O(log n)` — logarithmic: binary search;
- `O(n)` — linear: sequential search, traversing an array;
- `O(n log n)` — efficient sorting algorithms;
- `O(n²)` — nested loops, simple sorts (bubble, insertion);
- `O(2ⁿ)` — enumerating all subsets.

It is used to compare algorithms independently of hardware and to choose a suitable data structure: for example, searching an `Array` is `O(n)`, while in a `Set` or `Dictionary` it is `O(1)` on average. The average and worst cases are often stated separately: for quicksort they are `O(n log n)` and `O(n²)`.
