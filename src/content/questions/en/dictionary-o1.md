---
title: "Can you describe what makes lookup O(1) in a dictionary?"
category: algorithms
order: 11
---

The native `Dictionary` storage is a hash table with open addressing and linear probing: the key's hash (computed by `Hasher` via `hash(into:)`) determines a position in the array of buckets, so lookup doesn't scan all the pairs but starts right at the needed spot. Probing walks the ring of buckets until it reaches an occupied entry with the needed key or the first empty one, which marks the end of the chain.

This estimate holds for the native storage and is amortized: the implementation reports "amortized O(1)" for finding an index by key. To keep chains from filling the table, at least one empty entry always remains, and the maximum load factor in the source is 3/4.
