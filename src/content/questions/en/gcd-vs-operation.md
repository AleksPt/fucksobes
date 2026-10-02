---
title: "What is the difference between OperationQueue and GCD?"
category: concurrency
order: 42
---

`OperationQueue` (`NSOperationQueue`) is an object-oriented wrapper over GCD: using `NSOperation` implicitly uses Grand Central Dispatch.

**Advantage of GCD**

- Simple implementation.

**Advantages of OperationQueue**

- Support for dependencies between operations: tasks can be run in a specific order.
- Operations can be suspended, resumed, and cancelled. After a task is submitted through GCD, you lose control over its lifecycle, while `NSOperation` gives you that control.
- You can set the maximum number of operations running simultaneously in a queue.
