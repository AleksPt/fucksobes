---
title: "What are abstractions, why do they matter, and which SOLID principle do they relate to?"
category: architecture
order: 61
---

Abstraction means picking out what is essential and hiding the details: the client works with an interface (a protocol or a base class) and does not know the concrete implementation. In Swift, abstractions are defined by protocols and abstract types.

Why they matter:

- **loose coupling**: code depends on a contract rather than on details, so the implementation can be changed;
- **testability**: a stub can replace the real implementation;
- **extensibility**: new implementations are added without changing the client;
- **clarity**: there are fewer details to keep in your head, so the code is easier to read.

Several SOLID principles relate to abstractions at once. The main one is **D (Dependency Inversion)**: high-level modules depend on abstractions, not on concrete implementations. Also relevant are **O (Open/Closed)**, which is extension through new implementations without changing existing code, **L (Liskov)**, which requires implementations to be interchangeable, and **I (Interface Segregation)**, which favors small, narrow interfaces. Don't overdo it, though: unnecessary abstractions that have only one implementation make the code more complicated.
