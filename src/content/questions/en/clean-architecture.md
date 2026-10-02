---
title: "What is Clean Architecture? What is its main idea?"
category: architecture
order: 53
---

Clean Architecture is an approach by Robert Martin (Uncle Bob) in which the application is divided into concentric layers and dependencies point only inward (the dependency rule). Inner layers know nothing about outer ones.

The layers, from the center outward:

1. **Entities**: business models and domain rules.
2. **Use Cases (Interactors)**: the application's scenarios; they orchestrate the entities.
3. **Interface Adapters**: convert data between layers: presenters, view models, controllers, gateways, and repositories.
4. **Frameworks & Drivers**: the UI, networking, the database, and third-party libraries.

For an inner layer to use an outer one (for example, a use case saves data), it declares a protocol, and the outer layer provides the implementation (dependency inversion).

In iOS, three layers are often used: Presentation (View, ViewModel/Presenter), Domain (entities, use cases, repository protocols), and Data (networking, database, repository implementations). Pros: independence from frameworks and the UI, high testability, and easy replacement of details. Cons: a lot of code, layers, and mappers; it is overkill for small projects.
