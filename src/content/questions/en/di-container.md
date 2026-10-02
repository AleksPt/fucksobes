---
title: "What is a DI container?"
category: architecture
order: 63
---

A DI container is an object that knows how to create dependencies and hands them out on request. Types are registered in it (usually a protocol mapped to a way of creating it), and then the needed instance is "resolved" together with its own dependencies.

```swift
final class Container {
    private var factories: [String: () -> Any] = [:]
    func register<T>(_ type: T.Type, factory: @escaping () -> T) {
        factories[String(describing: type)] = factory
    }
    func resolve<T>(_ type: T.Type) -> T {
        factories[String(describing: type)]!() as! T
    }
}

container.register(NetworkService.self) { URLSessionService() }
let service = container.resolve(NetworkService.self)
```

Containers usually support scopes: singleton (one instance), transient (a new one on every request), graph, and others. Ready-made solutions: Swinject, Factory, Needle.

Pros: dependencies are created in one place, it is convenient to substitute implementations in tests, and there is less manual wiring. Cons: registration errors are only discovered at runtime, it adds complexity, and using the container inside classes turns into the Service Locator anti-pattern. Good practice: assemble dependencies in a composition root and pass them through initializers.
