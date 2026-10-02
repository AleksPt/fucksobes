---
title: "In what cases can deadlocks occur in Swift Concurrency?"
category: concurrency
order: 79
---

Swift Concurrency runs on a cooperative thread pool with no more threads than cores, and it relies on a contract: a thread can always make forward progress. A deadlock is possible when this contract is violated.

- Blocking primitives: semaphores and condition variables are unsafe in Swift Concurrency because they hide the dependency between tasks from the runtime. A typical case: create an unstructured task and then wait for it on a semaphore, so a pool thread can block forever.
- A lock held across an `await`: after an `await`, a task can continue on another thread, so do not hold locks across a suspension point.

Ordinary locks (`os_unfair_lock`, `NSLock`) are safe on short, well-understood critical sections: the thread holding the lock is guaranteed to make progress toward releasing it.
