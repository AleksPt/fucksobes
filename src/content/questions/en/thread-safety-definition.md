---
title: "What is thread safety?"
category: concurrency
order: 121
---

**Thread safety** is the property of code to work correctly under simultaneous access from several threads, without data corruption or unpredictable behavior.

Code is thread-safe if:

- shared data cannot be accessed concurrently for reading and writing at the same time without synchronization;
- the order in which threads run does not affect the final result;
- there is no data race: a situation where two threads access the same memory location at once and at least one of them writes.

**Ways to achieve thread safety:**

- serializing access through a `DispatchQueue` (a serial queue) or `NSLock`/`NSRecursiveLock`;
- `DispatchSemaphore` to limit the number of simultaneous accesses;
- an `actor` in Swift Concurrency: it isolates state and guarantees sequential access;
- immutable data (value types, `let`): if the data does not change, there is nothing to race for.

Swift's standard types (`Array`, `Dictionary`, etc.) are **not thread-safe** by themselves: mutating them simultaneously from different threads without synchronization leads to a data race.
