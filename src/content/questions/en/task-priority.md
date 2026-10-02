---
title: "How do Task priorities work?"
category: concurrency
order: 92
---

Priority is set by the `TaskPriority` struct: `.high`, `.medium`, `.low`, `.userInitiated`, `.utility`, and `.background`. They correspond to the QoS classes in GCD: `.high` matches `.userInitiated`, `.low` matches `.utility`, and `.medium` is the default value in between.

```swift
Task(priority: .background) { await syncData() }
let current = Task.currentPriority
```

Inheritance rules:

- an unstructured `Task { }` inherits the priority and actor of the current context; if it is created from the main thread, it gets high priority;
- child tasks (`async let`, `TaskGroup`) inherit the parent's priority;
- `Task.detached` does not inherit the creator's priority: if no priority is specified, the default is used.

The system can temporarily raise a priority (priority escalation): for example, if a high-priority task waits for the result of a low-priority one. Use `.userInitiated` for user-visible work, and `.utility` or `.background` for long background work (sync, downloads).
