---
title: "How are collisions resolved?"
category: algorithms
order: 20
---

The native `Dictionary` storage is a hash table with open addressing and linear probing: on a collision the element goes into the next free bucket, and the array of buckets forms a logical ring. The chain ends at the first unoccupied bucket, and `Dictionary` does not use tombstones on deletion.

This is described in a comment on the implementation in the Swift standard library source.
