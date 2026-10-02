---
title: "What is IoC (Inversion of Control) and how does it differ from DI (Dependency Injection)?"
category: architecture
order: 49
---

**IoC (Inversion of Control)** is a general principle: control over the flow of execution or over object creation is handed "outward" to external code or a framework instead of being done by the object itself. The usual approach is that your code calls a library. With IoC it is the other way around: the framework calls your code at the right moment (the Hollywood principle: "don't call us, we'll call you"). In iOS this is how `UIApplicationDelegate`, the `UIViewController` lifecycle methods, `UITableViewDataSource`, and callbacks work.

**DI (Dependency Injection)** is one specific technique for implementing IoC: an object does not create its dependencies itself but receives them from outside (through an initializer, a property, or a method). The creation and choice of implementations are moved into external code (a composition root, a DI container).

```swift
final class Screen {
    private let service: NetworkService
    init(service: NetworkService) { self.service = service }   // the dependency comes from outside
}
```

In short: IoC is the idea, and DI is a way to apply it to manage dependencies. Other ways to implement IoC: the Template Method, callbacks and events, a service locator, and the Strategy pattern. Don't confuse it with the Dependency Inversion Principle (DIP from SOLID): it says that modules should depend on abstractions and does not describe how to pass dependencies.
