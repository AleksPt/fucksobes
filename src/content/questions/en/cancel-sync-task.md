---
title: "We have a synchronous task and we have started it. What options do we have for cancelling it? Can we do it at all?"
category: concurrency
order: 38
---

- **GCD.** Use `DispatchWorkItem` and its `cancel()` method to cancel the task if it has not started executing yet. If the task is already running, it will keep running, but you can check the `isCancelled` flag inside the block and finish it early.
- **Operation.** It has built-in cancellation support: the `cancel()` method on an `Operation` instance cancels the task if it has not started executing yet.
