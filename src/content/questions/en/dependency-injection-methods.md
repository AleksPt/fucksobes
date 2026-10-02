---
title: "What ways of injecting a dependency are there?"
category: architecture
order: 22
---

1. **Constructor Injection** (through an initializer): the most common and safest way; the dependency is passed when the object is created and cannot be changed.
2. **Property Injection** (through properties): the dependency is set through a property after the object is created. It is less safe, because the property may remain unset.
3. **Method Injection** (through methods): the dependency is passed through the method that uses it, for example `configure`.
4. **Protocol Injection** (through protocols)
5. **Service Locator**
6. **Environment Variables Injection** (through environment variables)
7. **Factory Injection** (through object factories)

To simplify dependency management, you can use DI frameworks, for example **Swinject**.
