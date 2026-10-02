---
title: "What is the difference between Dependency Inversion and Dependency Injection?"
category: architecture
order: 23
---

**Dependency Injection (DI)** is a design pattern in which an object receives its dependencies from outside rather than creating them itself. Dependencies are the objects or services without which a class or struct cannot fully perform its functions. DI promotes loose coupling of components, making them easier to replace, modify, and test.

- **Dependency Inversion Principle** is a design principle: high-level and low-level modules should depend on abstractions rather than on each other.
- **Dependency Injection** is one way of obtaining dependencies (through an initializer, a property, or a method). It helps follow DIP but does not guarantee it: if you inject a concrete class rather than a protocol, the principle is still violated.
