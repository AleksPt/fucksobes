---
title: "Can a running operation be cancelled? (In GCD and NSOperation)"
category: concurrency
order: 39
---

Execution that has already started cannot be stopped instantly, in either GCD or `Operation`: cancellation is cooperative. Inside the task's code you need to check the `isCancelled` flag and finish early in an orderly way.

- **`Operation`:** `cancel()` cancels the operation; a running operation must check `isCancelled` itself.
- **GCD:** cancellation is available only through `DispatchWorkItem`. `cancel()` does not affect execution that has already started, and subsequent attempts to run the item return immediately. There is no cancellation for arbitrary blocks passed to `async`.
