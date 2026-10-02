---
title: "What is the algorithmic complexity of inserting into a dictionary and into the middle of an array?"
category: algorithms
order: 7
---

**Dictionary:** it has no "middle" and the order of pairs is undefined, so insertion does not depend on position: amortized O(1), O(n) in the worst case (rehashing on growth or massive collisions).

**Array:** O(n); the same for removal. Inserting at the end is O(1).
