---
title: "What design patterns are there?"
category: architecture
order: 15
---

**Creational**

- **Factory Method**: creates objects through factory methods rather than directly through a constructor.
- **Singleton**: ensures a class has a single instance with a global access point. Used for: app settings and managers (for example, `UserDefaults`, `URLSession`).
- **Builder**.

**Structural**

- **Adapter**: adapts a class's interface to the required form.
- **Facade**: provides a simplified interface to a complex system or a group of classes. It hides complex logic and gives a convenient access point to the subsystems.
- **Decorator**.

**Behavioral**

- **Observer**: lets objects subscribe to events of another object.
- **Delegation**.
