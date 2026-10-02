---
title: "What happens if you add two objects with the same hash to a Set?"
category: swift
order: 95
---

The same hash does not mean equality: it is a collision. `Set` uses the hash to find the bucket in which to look for an element, and then compares elements with `==`. Therefore:

- if the objects are equal (`==` returns `true`), the second one will not be added, because the element is already there;
- if the objects are not equal but have the same hash, both end up in the `Set`: the collision is resolved by comparison, although lookup in such a bucket is slightly slower.

Hence the requirement for `Hashable`: if `a == b`, then `a.hashValue == b.hashValue` (the converse is not true). For example, a type whose `hash(into:)` is always the same will work correctly, but with many collisions lookup degrades from `O(1)` to `O(n)`. That is why `hash(into:)` includes the same fields as `==`, and the hash should distribute values evenly.
