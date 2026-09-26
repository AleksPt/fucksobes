---
title: "Чем рекурсивные локи отличаются от обычных"
category: concurrency
order: 64
---

`NSRecursiveLock` — блокировка, которую один и тот же поток может захватывать несколько раз без взаимной блокировки (deadlock, когда поток навсегда ждёт сам себя). Остальные потоки при этом ждут, пока владелец освободит её столько же раз, сколько захватил.

```swift
let lock = NSRecursiveLock()

func recurse(_ value: Int) {
    lock.lock()
    defer { lock.unlock() }
    if value > 0 { recurse(value - 1) }
}
```
