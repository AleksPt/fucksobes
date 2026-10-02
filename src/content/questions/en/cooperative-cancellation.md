---
title: "What is cooperative task cancellation in Swift Concurrency?"
category: concurrency
order: 108
---

**Cooperative cancellation** is a model in which cancellation does not forcibly interrupt a task. Calling `task.cancel()` only sets a "cancelled" flag on the task, and the task itself must check it and finish. If the code does not check the flag, it will run to completion.

How it works:

- the flag is read through `Task.isCancelled` (just a check) or `try Task.checkCancellation()` (throws `CancellationError`);
- many system `await` functions (`URLSession.data`, `Task.sleep`) check for cancellation themselves and throw `CancellationError`;
- cancellation **propagates to child tasks** (`async let`, `TaskGroup`);
- to react immediately (for example, to cancel a network task), use `withTaskCancellationHandler`;
- release resources on cancellation with `defer` or `catch`.

```swift
func processAll(_ items: [Item]) async throws {
    for item in items {
        try Task.checkCancellation() // exit if the task was cancelled
        await process(item)
    }
}

let task = Task { try await processAll(items) }
task.cancel() // only asks it to stop; the loop will see the flag itself
```
