---
title: "Can you tell me more about GCD: what are the main paradigms and entities?"
category: concurrency
order: 10
---

GCD (Grand Central Dispatch) runs tasks in queues: a `DispatchQueue` is a FIFO queue of blocks submitted to it, which runs them serially or concurrently on a thread pool managed by the system.

Main entities:
- **Serial queue**: one task at a time, in the order added.
- **Concurrent queue**: starts tasks in the order added but does not wait for the ones already running to finish; there are global concurrent queues.
- **Main queue**: a serial queue on the application's main thread.
- **`sync` / `async`**: with `sync` the code waits for the task to finish, with `async` it keeps running.
- **`DispatchGroup`**: tracking a set of tasks as a single unit.
- **`DispatchSemaphore`**: a counting semaphore.
- **Dispatch sources**: notifications about system events.

You must not call `sync` on the same queue on which the current task is running: a serial queue is guaranteed to block.
