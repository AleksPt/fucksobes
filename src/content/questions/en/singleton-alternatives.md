---
title: "What can we use instead of a singleton?"
category: architecture
order: 17
---

Dependency Injection: the dependency is passed to the object from outside (through an initializer, a property, or a method parameter) rather than taken from a global `shared`. It is usually hidden behind a protocol so that a stub can be substituted in tests:

```swift
protocol Analytics { func track(_ event: String) }

final class Screen {
    private let analytics: Analytics
    init(analytics: Analytics) { self.analytics = analytics }
}
```

The instance is created once at the top level (for example, in a composition root or through a dependency container) and passed to whoever needs it. This still leaves a single instance, but the dependencies are explicit and the code is easier to test. Other options: environment values in SwiftUI (`@Environment`), a service locator (with caveats), and passing closures.
