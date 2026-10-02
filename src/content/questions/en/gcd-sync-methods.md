---
title: "All the synchronization methods in GCD"
category: concurrency
order: 33
---

- **Serial queue**: protects a shared resource, tasks run one at a time in a predictable order; when work is submitted asynchronously, it cannot block (unlike a lock).
- **Barrier** (`DispatchWorkItemFlags.barrier`): on a concurrent queue, tasks added before the barrier finish, then the barrier task runs, and only after it does the queue continue with the tasks added after the barrier.
- **`DispatchSemaphore`**: a counting semaphore; `signal()` increments the counter, and `wait()` decrements it and blocks the thread if the resource is unavailable.
- **`DispatchGroup`**: waiting for a set of tasks to finish through `wait()` or `notify`.
- **Locks** inside tasks: safe to use, but a held lock can completely block a serial queue.
