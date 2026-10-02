---
title: "How many threads can serial and concurrent queues have?"
category: concurrency
order: 103
---

A **serial queue** uses no more than one thread at any moment: blocks execute strictly one at a time, and the next one starts after the previous one finishes. The thread is not tied to the queue, though: different blocks of the same serial queue may run on different threads of the pool. The exception is `DispatchQueue.main`, which always runs on the main thread.

A **concurrent queue** can run several blocks at once, that is, use several threads. There is no hard limit in the API: the number of threads is determined by GCD based on the number of cores, the load, and whether the threads already issued are blocked.

- Real parallelism is limited by the number of cores: there can be more threads, but no more than the number of cores will actually execute at once.
- If threads get blocked (`sync`, semaphores, `sleep`), GCD creates new ones so that the queue does not stall. This is how **thread explosion** arises, and the system has a limit on the number of threads.
- Several serial queues together can also occupy several threads: one each, but in parallel with each other.

```swift
let serial = DispatchQueue(label: "serial")
let concurrent = DispatchQueue(label: "concurrent", attributes: .concurrent)

// In a serial queue, blocks run one at a time
serial.async { print("A") }
serial.async { print("B") } // starts only after A

// In a concurrent queue, blocks can run simultaneously on different threads
concurrent.async { print("C") }
concurrent.async { print("D") }
```
