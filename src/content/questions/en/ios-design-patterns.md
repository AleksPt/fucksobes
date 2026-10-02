---
title: "Which design patterns are used most often in iOS? Which GoF patterns do you know?"
category: architecture
order: 71
---

The most common ones in iOS development are:

- **Delegate**: an object delegates part of its work to another object through a protocol (`UITableViewDelegate`, `URLSessionDelegate`).
- **Observer**: subscribing to changes (`NotificationCenter`, KVO, Combine `Publisher`/`Subscriber`).
- **Singleton**: a single instance for the whole app (`UIApplication.shared`, `URLSession.shared`).
- **Factory / Abstract Factory**: creating objects without specifying the concrete class, often through a protocol.
- **Builder**: step-by-step construction of a complex object.
- **Strategy**: encapsulating interchangeable algorithms behind a common protocol.
- **Decorator**: adding behavior to an object without changing its class (SwiftUI modifiers are essentially decorators).
- **Adapter**: adapting the interface of one object to the interface the client expects.
- **Facade**: a simplified interface over a complex subsystem (for example, a service wrapping the networking layer).
- **Command**: encapsulating an action in an object (closures in Swift often replace this pattern).

The classic **GoF patterns** (the "Gang of Four") fall into three groups:

- **Creational:** Singleton, Factory Method, Abstract Factory, Builder, Prototype.
- **Structural:** Adapter, Decorator, Facade, Composite, Proxy, Bridge, Flyweight.
- **Behavioral:** Observer, Strategy, Command, State, Template Method, Chain of Responsibility, Mediator, Memento, Visitor, Iterator.

In iOS, many of them are hidden behind architectural approaches: MVC/MVVM use Observer and Delegate, DI containers use Factory, and a Coordinator is essentially a Mediator for navigation.
