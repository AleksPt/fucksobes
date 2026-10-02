---
title: "Is it safe to read and write class variables?"
category: concurrency
order: 60
---

No, not without synchronization. If different parts of the code can change the same data at the same time, a data race occurs. Classes provide no such protection by themselves.

Data is safe when it is immutable, accessible to only one task, or protected by an actor: an actor allows access to its mutable state by only one task at a time. In GCD, you can use a serial queue to protect a shared resource, as well as locks.
