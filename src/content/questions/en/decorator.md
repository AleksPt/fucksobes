---
title: "What is the Decorator pattern?"
category: architecture
order: 44
---

Decorator is a structural pattern that dynamically adds new behavior to an object by "wrapping" it in another object with the same interface. The wrapper delegates calls to the original object and supplements them with its own logic before or after the call. Unlike inheritance, behaviors can be combined at runtime without creating many subclasses.

In Swift, the pattern is usually built on protocols:

```swift
protocol DataSource { func load() -> [String] }

struct RemoteSource: DataSource {
    func load() -> [String] { ["a", "b"] }
}

struct LoggingSource: DataSource {
    let base: DataSource
    func load() -> [String] {
        print("load started")
        return base.load()
    }
}

let source: DataSource = LoggingSource(base: RemoteSource())
```

This is how logging, caching, metrics, and retries are added. Another way to extend behavior without inheritance in Swift is `extension`, but it adds functionality to the type as a whole, whereas a decorator acts on a specific instance.
