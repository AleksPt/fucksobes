---
title: "What are forEach, map, flatMap, compactMap, filter, and reduce?"
category: swift
order: 96
---

These are higher-order functions for sequences:

- `forEach` calls a closure for each element and returns nothing; you cannot exit it with `break` or `continue`;
- `map` transforms each element and returns a new array: `[1, 2].map { $0 * 2 }` → `[2, 4]`;
- `filter` keeps the elements that satisfy a condition;
- `reduce` folds the elements into a single value, starting from an initial one: `[1, 2, 3].reduce(0, +)` → `6`;
- `compactMap` transforms elements and drops `nil`: `["1", "a"].compactMap(Int.init)` → `[1]`;
- `flatMap` transforms each element into a sequence and "flattens" the result into a single flat array: `[[1, 2], [3]].flatMap { $0 }` → `[1, 2, 3]`.

Other examples: `sorted`, `first(where:)`, `contains(where:)`, `allSatisfy`, `min`/`max`, `zip`. They do not modify the original collection, produce declarative code, and combine well into chains. For large data sets, chains can be made lazy with `lazy` to avoid creating intermediate arrays.
