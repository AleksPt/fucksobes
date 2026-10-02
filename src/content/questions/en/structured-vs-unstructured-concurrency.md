---
title: "What are structured and unstructured concurrency?"
category: concurrency
order: 109
---

**Structured concurrency**: the lifetime of tasks is limited to the scope where they were created. Child tasks (`async let`, `TaskGroup`) cannot outlive their parent: the parent waits for them to finish. It follows that:

- **cancelling** the parent automatically cancels the children;
- an **error** in a child task propagates to the parent;
- **priority** and `task-local` values are inherited;
- there are no leaks of "forgotten" tasks, and the code reads from top to bottom.

**Unstructured concurrency**: tasks that have no parent waiting for them to finish:

- `Task { }` creates a new task that inherits the actor context and priority but is not tied to a scope;
- `Task.detached { }` inherits neither the actor context nor the priority.

You have to keep track of such tasks yourself: store the `Task` and call `cancel()` at the right moment, otherwise they will keep running after the screen is gone.

The rule: use structured constructs whenever possible, and use `Task { }` to enter from synchronous code (for example, from a tap handler).

```swift
// Structured: both loads live inside the function
func loadScreen() async throws -> (User, [Post]) {
    async let user = api.loadUser()
    async let posts = api.loadPosts()
    return try await (user, posts)
}

// Unstructured: lives on its own, must be cancelled manually
let task = Task { try await loadScreen() }
```
