---
title: "What design principles can you name?"
category: architecture
order: 6
---

## SOLID

**S: Single Responsibility Principle**

An entity should have one area of responsibility. This is usually understood as: there should be only one reason to change. Anything counts as an entity: a variable, a struct/class, a protocol, a module.

*Example.* If a view controller handles the UI, networking, and navigation, it has several reasons to change, and when requirements change you will have to go into the same place again. It is better to decompose it into several entities.

**O: Open/Closed Principle**

Modules should be open for extension but closed for modification: new functionality is added without changing existing code, for example through `extension`. Abstraction (a protocol) helps here: thanks to polymorphism, new implementations can be added and used without changing existing code.

*Example.* An app shows notifications to the user. We start with text ones, but the system should also support other kinds (with images, with action buttons, and so on) without changing the source code of the class that sends the notifications.

**L: Liskov Substitution Principle**

Subclasses must not change the logic expected from the parent class or contradict its behavior.

*Example of a violation.* Calling `fatalError` in an overridden `viewDidLoad` of a `UIViewController` subclass.

**I: Interface Segregation Principle**

Fat interfaces should be split into smaller ones so that entities know only about the methods they need for their work.

*Example.* `Codable` is a composition of two protocols, `Encodable` and `Decodable`.

**D: Dependency Inversion Principle**

High-level modules should not depend on low-level modules. Both should depend on abstractions.

*Example.* A network service that fetches data from an API is a low-level module, and a presenter that uses this service is a high-level one. If the service property in the presenter is a concrete class, the principle is violated: the presenter depends on a concrete class, and to use another service (for example, in tests) you would have to rewrite the presenter's code. To follow the principle, the service conforms to a `NetworkService` protocol, and the property in the presenter is declared with that protocol. Then the presenter can use different network services without changing its code.

## DRY

Don't repeat the same code in different places. When there is duplication, it is better to extract the shared logic into a separate function or module. A change needs to be made in only one place, so maintenance is easier and there is less risk of bugs and inconsistencies.

## KISS

The principle calls for simplicity in code and design: don't complicate solutions unnecessarily. Simple code is easier to read, understand, and maintain, has fewer bugs, and makes the team's work easier.

## YAGNI

Don't implement functionality "for the future" that isn't needed right now. Trying to anticipate every scenario adds needless complexity and costs time, and project needs may change, so such functionality may never be needed. It is better to focus on current requirements and add new capabilities as needed.
