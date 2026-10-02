---
title: "Is a thread created when a DispatchQueue is created? At what moment does a queue get a thread?"
category: concurrency
order: 95
---

No, creating a queue does not create a thread. `DispatchQueue` is a lightweight object that stores a queue of blocks and a reference to a target queue (ultimately one of the system queues). Threads belong to a shared pool managed by the system.

A thread is allocated at the moment a block executes: when a task is ready to run, GCD takes a free thread from the pool (or creates a new one if the pool is empty and resources are available) and runs the block on it. After execution, the thread returns to the pool and can serve other queues. Therefore:

- a serial queue has no "own" thread: different blocks may run on different threads, and only the order and the absence of simultaneity are guaranteed;
- `DispatchQueue.main` is an exception: it is tied to the main thread;
- for `sync`, the block sometimes runs directly on the calling code's thread (an optimization), without switching;
- creating many queues is cheap, but blocking pool threads by waiting (`sync`, semaphores) can lead to thread explosion.
