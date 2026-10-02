---
title: "What is a Task in Swift Concurrency?"
category: concurrency
order: 91
---

A `Task` is a unit of asynchronous work: `async` code runs inside it. A `Task` lets you start an asynchronous function from a synchronous context.

```swift
Task {
    let user = try await api.loadUser()
    await MainActor.run { label.text = user.name }
}
```

Properties of a task:

- it starts immediately after creation, with no need to call `start`;
- it has a priority and inherits the creator's context (actor, priority, task-local values);
- it can be cancelled (`task.cancel()`); cancellation is cooperative: the code must check `Task.isCancelled` itself or call `try Task.checkCancellation()`;
- it returns its result through `await task.value` (or `task.result`);
- it can be unstructured (`Task { }`, `Task.detached { }`) or structured (child tasks via `async let` and `TaskGroup`, which cannot outlive their parent).

A task is not tied to a specific thread: after an `await` it can continue on a different thread.
