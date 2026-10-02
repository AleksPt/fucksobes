---
title: "What is NSThread? What is it used for?"
category: concurrency
order: 87
---

`Thread` (`NSThread`) is an object-oriented wrapper around a system thread (pthread). It lets you create a thread, set its name, priority, and stack size, start it (`start()`), and cancel it (`cancel()`, with completion checked manually through `isCancelled`). The main thread is available as `Thread.main`.

```swift
let thread = Thread { print("On a separate thread") }
thread.name = "worker"
thread.start()
```

Threads are rarely created manually: the developer is responsible for their lifecycle, synchronization, and number (too many threads lead to thread explosion). In practice, GCD, `OperationQueue`, and Swift Concurrency are used instead, since they manage the thread pool themselves. `Thread` is needed when you require a thread with special parameters (a large stack, a long-lived `RunLoop`) or compatibility with old code.
