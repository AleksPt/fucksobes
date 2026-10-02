---
title: "What are circular dependencies?"
category: architecture
order: 46
---

A circular dependency arises when two or more modules (types, packages, targets) depend on each other, directly or indirectly: A imports B and B imports A (or A → B → C → A). It is a design flaw.

Consequences: the modules cannot be built and tested separately, they are hard to reuse and change, and the compiler often refuses to build such a graph at all: in SPM and Xcode, a circular dependency between targets is a build error. A similar problem at the object level is a retain cycle, where objects hold strong references to each other and are never deallocated.

How to eliminate it:

- **dependency inversion**: move the shared interface (a protocol) into a third module that both depend on;
- move the shared code into a separate base module;
- pass the dependency through Dependency Injection or a closure/delegate instead of importing it directly;
- revisit the module boundaries so that dependencies go in one direction (layers).
