---
title: "How do you use @Sendable, and what does this annotation guarantee in an async context?"
category: concurrency
order: 116
---

**`@Sendable`** is an annotation indicating that a closure (or a type) can be safely passed between threads without violating memory safety. This matters in asynchronous and parallel code: the Swift scheduler may run `@Sendable` closures on other threads, including simultaneously with other tasks.

Swift Concurrency requires `@Sendable` on closures at key API points where code can actually move to another thread:

- `Task.init(priority:operation:)`;
- `Task.detached(priority:operation:)`;
- `TaskGroup.addTask { }`.

If a closure is not marked (or the compiler does not implicitly infer it) as conforming to `Sendable`, the compiler emits a warning or an error, depending on the strict concurrency mode (Swift 6).

```swift
func runInBackground() {
    Task.detached(priority: .background) { // @Sendable as required by the API
        print("Running...")
    }
}
```

What `@Sendable` guarantees:

1. **Copyability/capture isolation**: the closure does not capture unsafe references to non-`Sendable` types (for example, a regular `class` without `@unchecked Sendable`).
2. **Immutability of what is captured**: all captured variables inside must be `let` (otherwise a warning or an error).
3. **Compiler checking**: the compiler statically checks that everything captured conforms to `Sendable`, and does not let you accidentally carry a data race across a thread boundary.

If a closure captured, for example, `self` of a `UIViewController` type without `Sendable` conformance, the compiler would emit a warning, because `UIViewController` is not thread-safe and can be accessed only from the main thread.

How to use it safely:

- make closures `@Sendable`-compatible wherever they are passed to `Task.detached`, `addTask`, and similar APIs;
- avoid capturing `self` without `weak`/`unowned` if the type is not inherently thread-safe;
- use `@unchecked Sendable` only if you manually vouch for the type's thread safety, which the compiler cannot verify on its own:

```swift
final class MyManager: @unchecked Sendable {
    // you guarantee thread safety manually,
    // for example through an internal lock
}
```
