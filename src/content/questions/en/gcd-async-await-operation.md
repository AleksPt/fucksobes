---
title: "GCD, async/await, NSOperation: how do they differ, which one is \"better\", and what are they for?"
category: concurrency
order: 74
---

- **GCD**: queues of block tasks (FIFO, serial or concurrent), with threads managed by the system.
- **`Operation`/`OperationQueue`**: an object-oriented layer over the same ideas; operations always run concurrently, but dependencies (`dependencies`) let you build an execution order; there are KVO notifications about state.
- **async/await**: language support. Suspension points are explicitly marked with `await`, the thread is freed while waiting, and actors and data isolation protect against races (most races are caught at compile time).

"Better" depends on the task: dependencies and cancellation as objects call for `Operation`, simply submitting a block to a queue calls for GCD, and new code with compiler-level safety calls for Swift Concurrency.
