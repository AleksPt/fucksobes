---
title: "When is the dispatch mechanism chosen?"
category: swift
order: 75
---

Static dispatch is chosen at compile time: if the compiler can determine which implementation will run, execution jumps directly to it at runtime. If the implementation cannot be determined at compile time, dispatch is dynamic: the implementation is looked up at runtime (in a vtable, a witness table, or through the Objective-C runtime) and then called.

The compiler can turn a call into a static one: for example, `final` or `private` declarations cannot be overridden, so indirect calls are replaced with direct ones.
