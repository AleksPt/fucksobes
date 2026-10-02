---
title: "How do you run several asynchronous tasks on a concurrent queue and wait for them to finish?"
category: concurrency
order: 28
---

`DispatchGroup`

Through `DispatchGroup`: call `group.enter()` for each task and `group.leave()` when it finishes (or start the task with `queue.async(group:)`). You can wait synchronously with `group.wait()`, or asynchronously with `group.notify(queue:)`.

In `OperationQueue`, a similar result is achieved through dependencies: create a completion operation and make it depend on the others (`finish.addDependency(op)`), or call `waitUntilAllOperationsAreFinished()` (which blocks the thread). Since iOS 13 there is `addBarrierBlock(_:)`: the block runs after all previously added operations have finished. In GCD, `dispatch_barrier` and `DispatchSemaphore` play a similar role.
