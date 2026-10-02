---
title: "When should you use a Set instead of an Array?"
category: algorithms
order: 28
---

`Set` is an unordered collection of unique elements, while `Array` is an ordered collection where values can repeat. Choose `Set` when:

- **uniqueness** matters: duplicates are not wanted (identifiers, tags, visited vertices);
- you need fast membership checks: `contains` on a `Set` is `O(1)` on average, versus `O(n)` on an `Array`;
- you need set operations: `union`, `intersection`, `subtracting`, `isSubset(of:)`;
- the order of elements doesn't matter.

The requirement: elements must be `Hashable`. `Array` fits when order matters, you need index access or repeats are acceptable. The price of `Set` is extra memory for the hash table and no ordering (iteration may yield any order). If you need both order and uniqueness, use an array together with a helper `Set` for checks, or `OrderedSet` from swift-collections.
