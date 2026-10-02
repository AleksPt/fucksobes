---
title: "What is thread explosion?"
category: concurrency
order: 57
---

Thread explosion is a situation where an app creates many more threads than there are CPU cores. In GCD, when a thread on a concurrent queue blocks (for example, waits on another queue or a semaphore), the system spins up a new thread for the remaining tasks; if those block too, the number of threads keeps growing.

Consequences: every blocked thread holds a stack and kernel structures, some threads may hold locks, context-switching overhead grows, and deadlocks are possible. Swift Concurrency solves this with a cooperative pool that has no more threads than cores, where `await` frees the thread instead of blocking it.
