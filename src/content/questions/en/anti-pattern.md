---
title: "What is an anti-pattern?"
category: architecture
order: 45
---

An anti-pattern is a common way of solving a typical problem that looks reasonable but is ineffective in practice and leads to trouble: hard-to-maintain code, bugs, and performance loss. Unlike a design pattern, it is a template for what not to do.

Examples:

- **God Object**: a class that knows and does too much (in iOS, the Massive View Controller);
- **Spaghetti code**: tangled logic with no structure;
- **Copy-paste**: duplicating code instead of reusing it;
- **Magic numbers and strings**: values with no name;
- **Premature optimization**: optimizing before a bottleneck has been found;
- **Singleton** when it is used as global mutable state: it hides dependencies and makes testing harder;
- **Callback hell**: closures nested several levels deep.

Knowing anti-patterns helps you spot problems during code review and refactoring. At the same time, what counts as a "bad" approach depends on context: a Singleton is appropriate for a truly unique resource, and problems arise when it is overused.
