---
title: "Is asynchrony possible without multithreading? Give an example."
category: concurrency
order: 106
---

Yes. **Asynchrony** means that code does not run linearly and immediately, but is deferred and resumed later without blocking the current thread of execution. **Multithreading** means that several threads actually work in parallel (or interleave) at the system level. These are different axes, and asynchronous code can run entirely on a single thread.

An example is a timer on the main thread:

```swift
func scheduleGreeting() {
    print("Start")
    Timer.scheduledTimer(withTimeInterval: 2, repeats: false) { _ in
        // Runs later, but still on the main thread
        print("2 seconds have passed")
    }
    print("Timer scheduled, the thread is free")
}
```

Nothing here runs in parallel and no new threads are created: the block's execution is simply deferred in time and happens asynchronously relative to the calling code, but on the same (main) thread through the run loop.

Other examples of single-threaded asynchrony:

- **`async`/`await`** without leaving `@MainActor`: code suspends at the `await` point, but on resumption it may continue on the same thread. This is cooperative multitasking, not necessarily parallelism;
- **run loop** events: handling of touches, animations, and timers on the main thread is asynchronous relative to each other, but sequential within one thread;
- the **JavaScript** model (for comparison) is a single-threaded event loop with callbacks and promises: there is asynchrony, but no threads for the JS code itself.

In other words, asynchrony answers the question "when will the code run", while multithreading answers "on which thread (and in parallel with what else) will it run". One does not imply the other: asynchronous code can be single-threaded, and multithreaded code can be synchronous (for example, `DispatchQueue.global().sync { ... }` blocks while running on another thread).
