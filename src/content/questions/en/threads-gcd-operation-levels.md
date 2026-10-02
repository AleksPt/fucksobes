---
title: "Threads, GCD, Operation: which one is the top level?"
category: concurrency
order: 8
---

The highest level is `Operation` / `OperationQueue`: an object-oriented wrapper over asynchronous work with dependencies, cancellation, and KVO. An operation queue runs operations either directly on secondary threads or through `libdispatch` (GCD).

Below that is GCD (`DispatchQueue`): you submit work to a queue, and the system itself spins up threads to run it. The lowest level is threads (`Thread`), which you have to manage manually.
