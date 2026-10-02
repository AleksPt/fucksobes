---
title: "Pros and cons of a multi-module architecture"
category: architecture
order: 29
---

**Pros**

1. **Readability and code structure.** Logic is split across independent modules, which makes maintenance easier.
2. **Faster builds.** Independent modules can be built in parallel.
3. **Code reuse.** Modules are easy to use in other projects.
4. **Localized changes.** A change in one module affects others minimally.
5. **Clear separation of responsibility.** Teamwork is easier to organize: each team works on its own module.
6. **Testability.** Modules can be tested separately.

**Cons**

1. **Management complexity.** Project configuration and dependencies between modules become more complicated.
2. **Synchronization difficulties.** When one module changes, its dependents have to be updated.
3. **Development overhead.** Extra effort is needed to set up infrastructure and CI/CD and to enforce the architecture.
4. **Sometimes slower builds.** If modules depend on each other, the build can slow down because of repeated compilation.
5. **Fragmentation.** Splitting into too many modules can lead to confusion.
