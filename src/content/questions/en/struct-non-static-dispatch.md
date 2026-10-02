---
title: "How can you get non-static dispatch for a struct?"
category: swift
order: 148
---

Structs have no inheritance, so their methods are called directly: static dispatch (and inlining is possible). Neither a virtual method table nor `dynamic` with the Objective-C runtime is available for structs.

Dynamic (indirect) dispatch can be obtained through protocols:

- **the existential type `any P`**: a call to a method declared in the protocol goes through the container's protocol witness table, that is, indirectly;
- **unspecialized generics**: `func f<T: P>(_ x: T)`, when compiled without optimizations or split across modules, calls the method through a witness table;
- **closures and function values** stored by the struct (`let action: () -> Void`): the call is indirect;
- methods declared only in a protocol `extension` are called statically, while those declared in the protocol itself are called dynamically.

In summary: a struct remains statically dispatched as long as it is accessed through its concrete type, while when working through a protocol or a closure, the choice of implementation is moved to runtime.
