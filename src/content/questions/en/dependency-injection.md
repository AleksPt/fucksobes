---
title: "What is Dependency Injection?"
category: architecture
order: 21
---

**Dependency Injection**

> DI is a set of software design principles and patterns that make it easier to write loosely coupled code.

**Dependency Injection** is an object configuration pattern in which dependencies are supplied from outside rather than created by the object itself. In other words, objects are configured by external objects.

Ways to inject dependencies:

- **Interface injection** requires creating an additional protocol for injection into each object, which seems excessive.
- **Property injection** (through a public property) lets you create an object and start using it before all the needed dependencies have been injected. This can lead to bugs caused by an inconsistent object state. In addition, the injectable fields have to be public, and they can be changed from outside at any moment, which breaks encapsulation.
- **Method injection** (through a public method) is very similar to property injection, but the injection happens through a method. It is used less often but has the same drawbacks.
- **Constructor injection** (through an initializer) leads to boilerplate in the initializer, which grows with the number of dependencies. Such an initializer is a sign that too many dependencies have been placed in the object, and it is worth recalling the Single Responsibility Principle and thinking about a better decomposition.

**Dependency Inversion**

The Dependency Inversion Principle: dependencies within the system are built on abstractions. High-level modules do not depend on low-level modules. Abstractions do not depend on details; details depend on abstractions.

> Depend on abstractions, not on anything concrete.

Because of this, modules can be easily replaced with others, and changes in a low-level module do not affect a high-level one.
