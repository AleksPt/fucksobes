---
title: "Task: fix a race condition in code with a DispatchGroup and a shared counter"
category: concurrency
order: 94
---

The code: two tasks on a global queue increment a shared variable `count` 10,000 times each, and a `DispatchGroup` waits for them to finish.

```swift
var count = 0
let group = DispatchGroup()

for _ in 0..<2 {
    group.enter()
    DispatchQueue.global().async {
        for _ in 0..<10_000 { count += 1 }   // data race
        group.leave()
    }
}
group.notify(queue: .global()) { print(count) }   // unpredictable, less than 20000
```

`count += 1` is a read, an increment, and a write, and two threads do this at the same time, so some of the increments are lost. The result can differ on every run. The solution is to make access to `count` mutually exclusive. For example, with a mutex:

```swift
let lock = NSLock()
group.enter()
DispatchQueue.global().async {
    for _ in 0..<10_000 {
        lock.lock(); count += 1; lock.unlock()
    }
    group.leave()
}
```

Don't forget `group.leave()` for every `enter()`: otherwise `notify` will never fire. Other options: a serial queue (`serial.sync { count += 1 }`), `DispatchSemaphore(value: 1)`, atomic operations, an actor in Swift Concurrency, or dropping the shared variable altogether: each task computes its own local result, and the total is summed after `notify`. The expected answer is `20000`.
