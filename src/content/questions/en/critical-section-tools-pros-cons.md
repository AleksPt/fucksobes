---
title: "What multithreading tools do you use to protect a critical section? What are the pros and cons of these approaches?"
category: concurrency
order: 105
---

Several tools are used to protect a critical section (shared mutable state):

- **Serial `DispatchQueue`**. Pros: simple, no manual locking, `async` does not block the calling thread. Cons: `sync` from the same queue causes a deadlock, a value cannot be returned synchronously from `async`, and there is switching overhead.
- **Concurrent queue + `.barrier`**. Pros: reads run in parallel and writes are exclusive, which suits a "many readers, one writer" scheme. Cons: more complex code, a barrier works only on your own concurrent queues (not on global ones), and blocking can lead to thread explosion.
- **Locks** (`NSLock`, `NSRecursiveLock`, `os_unfair_lock`, `OSAllocatedUnfairLock`). Pros: the smallest overhead, fast protection of short sections. Cons: `unlock` is called manually (`defer` helps), deadlocks are easy to cause, `NSLock` and `os_unfair_lock` are not recursive, and they block the thread.
- **`DispatchSemaphore(value: 1)`**. Pros: a clear idea that works with any code. Cons: a semaphore has no owner, priority inversion is possible, and it is easy to block a pool thread.
- **Atomic operations** (the Swift Atomics package). Pros: no locks, fast for a single value. Cons: suitable only for simple values and counters, not for compound invariants.
- **`actor`**. Pros: isolation is checked by the compiler, no manual locks. Cons: access only through `await`, reentrancy is possible (state can change between `await`s), and it works only inside Swift Concurrency.

The choice depends on the task: for short access to a single property a lock or a queue is enough, for a read/write scheme use a barrier, and for new code on Swift Concurrency use an actor.

```swift
final class Cache {
    private let lock = NSLock()
    private var storage: [String: Data] = [:]

    func value(for key: String) -> Data? {
        lock.lock(); defer { lock.unlock() }
        return storage[key]
    }

    func set(_ data: Data, for key: String) {
        lock.lock(); defer { lock.unlock() }
        storage[key] = data
    }
}
```
