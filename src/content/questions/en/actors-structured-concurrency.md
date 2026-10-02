---
title: "What is an actor and how does Structured Concurrency work?"
category: concurrency
order: 75
---

An **actor** is a reference type that protects its mutable state: isolated members are accessed through `await`, and the actor handles one access at a time, like a serial executor. An actor is not tied to a single thread: its code may run on different threads of the pool, but never simultaneously.

**Structured Concurrency** is a model in which tasks form a hierarchy with a bounded lifetime: a child task (`async let`, `TaskGroup`) never outlives its parent's scope, cancellation propagates down the hierarchy, and the parent waits for all child tasks before leaving the scope.
