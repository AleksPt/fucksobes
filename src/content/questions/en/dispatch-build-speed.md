---
title: "Does method dispatch affect project build speed?"
category: swift
order: 149
---

Directly, hardly at all: the dispatch method is determined at compile time and has no noticeable effect on build time. But there are indirect effects:

- **Optimizations.** Static dispatch (`final`, structs, `private`) gives the compiler opportunities for inlining and devirtualization. Whole-module optimization and generic specialization make it possible to use them, but they increase release build time and code size.
- **Generics and protocols.** Specialization creates copies of code for concrete types, which also lengthens compilation; unspecialized calls through a witness table build faster but run slower.
- **Modularity.** Across modules without `@inlinable`, calls remain unoptimized (indirect), but incremental builds are faster.
- **Dynamic and Objective-C.** `@objc dynamic` adds metadata and bridge generation, but does not significantly affect the build.

The difference in build speed is determined mainly by optimizations, not by the choice of a virtual or static call. In practice, build time is improved through modularity, precise expression types, and build mode settings.
