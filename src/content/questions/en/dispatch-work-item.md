---
title: "What is DispatchWorkItem?"
category: concurrency
order: 102
---

`DispatchWorkItem` is a wrapper object around a block of code that can be submitted to a GCD queue. Unlike a regular closure, it can be managed after it has been enqueued.

```swift
let item = DispatchWorkItem(qos: .userInitiated) {
    print("work")
}
item.notify(queue: .main) { print("done") }

DispatchQueue.global().async(execute: item)
item.wait()   // blocking wait for completion
item.cancel() // cancellation
```

What `DispatchWorkItem` gives you:

- **Cancellation** (`cancel()`): if the task has not started executing yet, it will not run; this does not interrupt a running task, so inside the block you need to check `isCancelled` yourself.
- **Waiting** (`wait()`) and **completion notification** (`notify(queue:execute:)`).
- **Its own QoS and flags** (for example, `.barrier`) for a specific task.
- The same object can be executed several times (`perform()` or by submitting it to a queue again) as long as it has not been cancelled.

Typical uses are debouncing (cancel the previous delayed task and schedule a new one) and cancelling work scheduled with `asyncAfter`.
