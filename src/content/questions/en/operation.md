---
title: "Operation"
category: concurrency
order: 40
---

An abstract Foundation class that encapsulates the code and data of a single task. It is not used directly: you subclass it or use the ready-made `BlockOperation` / `NSInvocationOperation`. An operation is single-use: once it has executed its task, it cannot execute it again.

Operations are usually added to an `OperationQueue`, which runs them either directly on secondary threads or through `libdispatch` (GCD). The order is set by dependencies (`addDependency(_:)`): an operation is not ready until all its dependencies have finished. Dependencies do not distinguish between successful and unsuccessful completion (a cancelled operation also counts as finished). Cancellation (`cancel()`) does not forcibly stop the task: the code must check `isCancelled` itself. The operation's properties (`isReady`, `isExecuting`, `isFinished`, `isCancelled`) are KVO-compliant.
