---
title: "Collisions and search complexity"
category: algorithms
order: 21
---

A collision is a situation where keys land on the same position in the table. `Dictionary` resolves them with linear probing: it tries the following buckets in a ring (after the last one comes the first) until it finds the needed key or an empty entry, which marks the end of the chain. The table always has an empty entry, and the maximum load factor is 3/4. `Dictionary` does not use tombstone markers for deleted entries.

Lookup complexity in a native dictionary is documented as amortized O(1). For this to hold, keys must implement `Hashable` correctly: equal values must feed the same components to `Hasher` in the same order.
