---
title: "Why is the stack faster than the heap?"
category: memory
order: 3
---

The stack works on the LIFO principle.

1. **Memory management is simpler.** Stack memory is allocated and freed sequentially, which costs very little.
2. **Direct access.** Stack data is accessed by an offset from the stack pointer, without the extra dereference needed for heap objects.
3. **Less fragmentation.** Stack memory is allocated contiguously, while the heap can become fragmented over time, which slows things down.
