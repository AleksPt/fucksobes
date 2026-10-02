---
title: "How do you implement a Singleton in Swift?"
category: architecture
order: 34
---

A static property and a private initializer are enough:

```swift
final class Analytics {
    static let shared = Analytics()
    private init() {}
}
```

`static let` is initialized lazily on first access, and Swift guarantees that global and static properties are initialized exactly once and in a thread-safe way. `private init()` prevents creating a second instance, and `final` prevents subclassing.

If the singleton has mutable state inside, it has to be protected separately: with a queue, a lock, or an actor, because only the initialization itself is thread-safe. In Swift 6, a shared mutable instance must be `Sendable` or isolated by an actor (`@MainActor`). To keep a singleton from hurting testability, hide it behind a protocol and pass it through Dependency Injection.
