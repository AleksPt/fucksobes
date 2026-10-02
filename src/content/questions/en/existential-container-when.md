---
title: "Existential container: is it always created when a type implements a protocol?"
category: swift
order: 150
---

No. An existential container is needed only when a protocol is used as the type of a value: `let x: any Drawable`, `[any Drawable]`, a parameter `(x: any Drawable)`. The mere fact that a type conforms to a protocol does not create a container: a `Circle: Drawable` struct, when used as a `Circle`, is stored without any wrapper.

The container is not created, or is eliminated, if:

- the protocol is used as a generic constraint (`<T: Drawable>`) and the compiler specializes the function for the concrete type;
- an opaque type `some Drawable` is used (the concrete type is known to the compiler, so no wrapper is needed);
- the compiler optimizes the code (devirtualization, specialization, elimination of redundant `any`).

If a container is still created, on a 64-bit platform it has 3 words for the value, a pointer to the metadata, and pointers to witness tables (40 bytes for an ordinary protocol, 32 for `Any`, which has no witness table). Values larger than the buffer are allocated on the heap. For class-constrained protocols (`AnyObject`), the container is smaller: a pointer to the object plus a witness table (16 bytes).
