---
title: "Can you make tasks run sequentially in a concurrent queue?"
category: concurrency
order: 105
---

Yes, in several ways, although by default a concurrent queue runs tasks in parallel, with no guarantee about the order of completion.

- **`DispatchWorkItem` + `notify`/explicit dependencies**: start the next task only from the completion block of the previous one, building the chain manually.
- **`DispatchGroup`** with `wait()` or `notify(queue:)`: group the tasks and wait for each to finish before starting the next.
- **A barrier task** (`.barrier`): it is guaranteed to wait for all previously added tasks to finish and does not let the following ones start until it finishes itself, so for a brief moment it turns the concurrent queue into a serial one. It is suitable when you need to slip in an isolated task once (for example, a write to a shared resource), rather than make the whole queue sequential.
- **A serial queue as the `target`**: set a serial queue as the concurrent queue's target (`target`); then all tasks will physically run sequentially on the target queue's thread, although formally they were added to the concurrent one.
- Simply add tasks **synchronously** (`sync` instead of `async`) one after another from a single thread: the next task is added to the queue only after the current one finishes, which also gives sequential execution, but blocks the calling thread.

```swift
let queue = DispatchQueue(label: "com.app.concurrent", attributes: .concurrent)
let group = DispatchGroup()

group.enter()
queue.async {
    performFirst()
    group.leave()
}

group.notify(queue: .main) {
    // Runs only after the first task has finished
    performSecond()
}
```

If you need sequential execution for *all* of a queue's tasks permanently, rather than as an exception, it is simpler and more reliable to use a **serial** queue right away: that is what it is for.
