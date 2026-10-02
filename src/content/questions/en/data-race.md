---
title: "What is a data race?"
category: concurrency
order: 89
---

A data race occurs when two threads access the same memory location at the same time, at least one of them is writing, and there is no synchronization between the accesses. The result of such an operation is undefined: you can get corrupted data, wrong values, or a crash.

```swift
var counter = 0
DispatchQueue.concurrentPerform(iterations: 1000) { _ in
    counter += 1          // read and write from different threads without synchronization
}
// counter will almost certainly be less than 1000
```

The difference from a race condition: a data race is a specific memory access problem, while a race condition is a logic error where the result depends on the order of execution. A data race can cause one, but a race condition can also exist without a data race (for example, with correctly synchronized but wrongly ordered checks).

Protection: serial queues, `NSLock` and other locks, barriers, atomic operations, actor isolation, and value types instead of shared reference types. Races are detected by Thread Sanitizer and by Sendable checks in Swift 6.
