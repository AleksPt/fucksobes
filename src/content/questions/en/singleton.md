---
title: "What are singletons? What problems can they have? When should they be used, and how do you protect yourself?"
category: architecture
order: 16
---

A **singleton** is a class that returns the same instance no matter how many times it is requested: there is only one instance per process. It provides a global access point to the class's resources.

When to use it: where a single point of control is needed, for example for classes that provide a shared service or resource. Strict examples from Cocoa: `UIApplication`, `NSWorkspace`. By contrast, `FileManager.default`, `UserDefaults.standard`, and `URLSession.shared` are merely shared instances: you can create your own when needed.

The instance is obtained through a factory method (by convention, `shared…`); the class creates it lazily on first access and does not allow another one to be created.

Problems:

- global state: any code can change it, so behavior becomes hard to predict;
- hidden dependencies: a class reaches for `Foo.shared` internally, and its interface doesn't show this;
- hard to test: a singleton cannot be replaced with a stub, and its state outlives the tests;
- thread safety: mutable state accessible from anywhere is prone to data races.

How to protect yourself:

- make `init` private so a second instance cannot be created;
- declare the instance as `static let shared`: according to the Swift documentation, static properties are initialized lazily and exactly once, even when accessed from several threads at the same time (but access to the mutable state inside still has to be synchronized, for example with an actor or a queue);
- don't reach for `shared` deep inside the code; pass the dependency through a protocol and an initializer (DI) so tests can substitute a stub.
