---
title: "What are thread-safe variables? Is reading and writing class properties thread-safe?"
category: concurrency
order: 104
---

A variable is **thread-safe** if it can be accessed from several threads at the same time and the result stays correct: there is no data race, and the value is not corrupted or read "half-written".

Class properties are **not thread-safe** by themselves:

- simultaneous **reads** are safe as long as nobody writes;
- **read + write** or **write + write** from different threads is a data race: you can read a stale or corrupted value, lose an update, or crash (for example, when mutating an `Array` or `Dictionary`);
- `let` constants and immutable value types are safe because they do not change after initialization.

How to make access safe:

- restrict access with a **serial queue** (all reads and writes go through it);
- **concurrent queue + barrier**: reads in parallel, writes exclusively with `.barrier`;
- **locks**: `NSLock`, `os_unfair_lock`, `NSRecursiveLock`;
- **atomic** operations for simple values (the Swift Atomics package);
- **`actor`**: state isolation at the language level.

```swift
final class Counter {
    private let queue = DispatchQueue(label: "counter.queue")
    private var _value = 0

    // Reads and writes go through a single serial queue
    var value: Int { queue.sync { _value } }

    func increment() {
        queue.sync { _value += 1 }
    }
}
```
