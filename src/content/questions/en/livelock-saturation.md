---
title: "What are livelock and saturation (thread pool saturation)?"
category: concurrency
order: 98
---

**Livelock** is a situation where threads are not blocked and are constantly doing something, but no useful work gets done: each one reacts to the actions of the others and makes no progress. An analogy: two people in a corridor simultaneously step aside for each other in the same direction. A code example: two threads that, after failing to acquire the second resource, release the first one and retry, in lockstep.

The difference from a deadlock: in a deadlock, threads wait and do not consume CPU, while in a livelock they are active and load the CPU. It is fixed with randomized backoff, a single order of acquiring resources, and a limit on the number of retries.

**Saturation** is a state in which all of the pool's worker threads are busy (or blocked), while new tasks pile up in the queue and are not executed in time. Causes: too many blocking tasks (`sync`, semaphores, waiting for I/O), thread explosion, tasks depending on each other. GCD has a limit on the number of threads, and the Swift Concurrency pool has no more threads than cores, so a blocking call inside `async` code can stall the whole pool and lead to a deadlock.
