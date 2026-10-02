---
title: "How do recursive locks differ from regular ones?"
category: concurrency
order: 64
---

`NSRecursiveLock` is a lock that the same thread can acquire several times without a deadlock (where a thread waits for itself forever). Other threads wait until the owner releases it as many times as it acquired it.

```swift
let lock = NSRecursiveLock()

func recurse(_ value: Int) {
    lock.lock()
    defer { lock.unlock() }
    if value > 0 { recurse(value - 1) }
}
```
