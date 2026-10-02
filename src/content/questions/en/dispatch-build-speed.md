---
title: "Does method dispatch affect project build speed?"
category: swift
order: 149
---

Directly, hardly at all: the dispatch method is determined at compile time and has no noticeable effect on build time. But there are indirect effects:

- **Optimizations.** Static dispatch (`final`, structs, `private`) gives the compiler opportunities for inlining and devirtualization. Whole-module optimization and generic specialization make it possible to use them, but they increase release build time and code size.
- **Generics and protocols.** Specialization creates copies of code for concrete types, which also lengthens compilation; unspecialized calls through a witness table are generally cheaper to build but run slower.
- **Modularity.** Without `@inlinable`, the compiler cannot see the body of a function from another module, so it cannot inline or specialize it. This affects runtime speed rather than build speed.
- **Dynamic and Objective-C.** A `dynamic` member is always called through the Objective-C runtime and is never inlined or devirtualized; it does not noticeably affect build speed.

The difference in build speed is determined mainly by optimizations, not by the choice of a virtual or static call. It is best to check the exact effect by measuring your own project (for example, with the Build Timing Summary in Xcode).
