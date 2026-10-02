---
title: "Which search and sorting algorithms do you know? Which do you use at work?"
category: algorithms
order: 27
---

Search:

- linear — checking elements one by one, `O(n)`, works on any data;
- binary — on a sorted array, compares the target with the middle element and discards half, `O(log n)`;
- hash table lookup (`Set`, `Dictionary`) — `O(1)` on average;
- breadth-first (BFS) and depth-first (DFS) traversal of graphs and trees.

Sorting:

- simple ones — bubble, selection, insertion: `O(n²)`, insertion sort is good on nearly sorted data;
- merge sort: always `O(n log n)`, stable, requires `O(n)` extra memory;
- quicksort: `O(n log n)` on average, `O(n²)` in the worst case, in place;
- heapsort: `O(n log n)`, in place, unstable.

At work you almost always use the standard library: `sort()`, `sorted(by:)`, `contains`, `firstIndex(where:)`, `filter`. Since Swift 5, the standard library's `sort` has been a stable sort based on Timsort (a hybrid of merge and insertion sort), although stability is formally not guaranteed by the documentation. You implement your own algorithm when special conditions apply: very large data, memory constraints or a specific data structure.
