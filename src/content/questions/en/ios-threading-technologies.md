---
title: "What technologies in iOS can you use for working with threads? What are their advantages and disadvantages?"
category: concurrency
order: 122
---

From low-level to high-level:

- **`Thread`/`pthread`**: working with a thread directly. Pros: full control over thread creation and priority. Cons: the lowest level, so you have to manage the lifecycle, synchronization, and termination manually; it is easy to create too many threads (thread explosion) and incur context-switching overhead.
- **GCD (`DispatchQueue`)**: tasks are submitted to a queue (serial/concurrent), and the runtime takes care of spinning up and reusing threads. Pros: a simple API, efficient thread pool management, barriers, groups, semaphores. Cons: after a task is submitted to a queue you have no control over its lifecycle (you cannot suspend or cancel a task that has already started), and building dependencies between tasks is inconvenient.
- **`OperationQueue`/`Operation`**: an object-oriented wrapper over GCD. Pros: dependencies between operations, suspend/resume/cancel, a limit on the maximum number of concurrent operations, KVO-observable states. Cons: more boilerplate and overhead compared to bare GCD for simple cases.
- **`async`/`await` and structured concurrency (Swift Concurrency)**: the modern approach: asynchronous code is written as sequential code, and the compiler manages suspension and resumption. Pros: compiler-level safety (`Sendable` and actors protect against data races), built-in cooperative cancellation, structured tasks (`TaskGroup`) with a clear lifetime. Cons: requires newer OS versions (iOS 13+/15+ for some APIs), migrating legacy completion-handler code takes effort, and blocking code inside a `Task` can exhaust the shared thread pool.
- **`RunLoop`**: not for parallelism, but for sequential event handling on a single thread (timers, input sources). Pros: gives asynchrony without creating new threads. Cons: not suitable for parallelizing heavy work.

The choice is usually this: a simple asynchronous task calls for GCD; dependencies, cancellation, and lifecycle control call for `OperationQueue`; new code, especially with chains of async calls and an ownership structure, calls for `async`/`await`; low-level work with the thread itself is rare and needed only in specific cases (for example, integrating with C libraries).
