---
title: "What are lock-free and wait-free algorithms?"
category: concurrency
order: 97
---

These are algorithms for multithreaded data structures that do without locks (mutexes), and they differ in their progress guarantees.

- **Blocking (with locks):** if the thread holding the lock is stopped, the others wait.
- **Lock-free:** at least one thread always makes progress in a finite number of steps, even if the others are suspended; an individual thread may "starve" (retry many times). It is usually built on atomic compare-and-swap (CAS) operations: a thread reads a value, computes a new one, and tries to atomically replace it, retrying on failure.
- **Wait-free:** every thread completes its operation in a bounded number of steps regardless of the others. This is the strongest guarantee and the hardest to implement.

Pros: no deadlocks or priority inversion caused by locks, and better scaling under high contention. Cons: they are complex and easy to get wrong (the ABA problem, memory ordering), and can be less efficient under low contention. Swift has atomic operations for this (the swift-atomics package and the `Atomic` type in the `Synchronization` module), but in application code queues, actors, and `OSAllocatedUnfairLock` are usually enough.
