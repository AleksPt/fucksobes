---
title: "What kinds of DI libraries do you know?"
category: architecture
order: 70
---

DI can be done without any libraries at all, by assembling dependencies manually in one place (the composition root) and passing them through initializers. But ready-made solutions usually fall into several approaches:

- **Runtime containers (closure registration).** For a type key, a factory closure is registered in the container, and the needed instance is resolved at runtime. Example: **Swinject** (a registry of closures; it does not use reflection). Pros: flexibility, minimal boilerplate. Cons: an error in the dependency graph (you forgot to register a type) only surfaces at runtime, not at compile time.
- **Code-generation libraries (compile-time DI).** The dependency graph is described declaratively, and the library itself generates the injection code at build time. Example: **Needle** (by Uber). Pros: errors in the dependency graph are caught by the compiler rather than at runtime, and there is no runtime resolution overhead. Cons: harder to set up, and it requires a code-generation step in the build pipeline.
- **Lightweight libraries based on property wrappers.** A dependency is obtained through a special property wrapper that lazily resolves the needed type on first access. Examples: **Factory**, **Resolver**. Pros: minimal infrastructure and a convenient syntax similar to `@Environment` in SwiftUI. Cons: the type is resolved implicitly, "by magic", so it is harder to trace the dependency graph by eye.
- **Manual DI (Pure DI).** No libraries at all: all dependencies are created and passed through initializers in one place (`AppDependencies`, the composition root). Pros: minimal magic, the compiler catches all errors, and dependencies are visible in signatures. Cons: as the dependency graph grows, object initialization can become verbose.

The choice usually depends on project size: small and medium projects more often get by with manual DI or lightweight libraries, while large ones lean either toward runtime containers for flexibility or toward compile-time solutions for reliability on large graphs.
