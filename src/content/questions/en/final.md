---
title: "What is the final modifier for?"
category: swift
order: 38
---

The `final` modifier prevents inheritance and overriding:

- on a class — subclasses cannot be created;
- on a method, property, or subscript of a class — they cannot be overridden in subclasses (it can be applied to individual members of a non-final class);
- the combination `final override` prevents the member from being overridden further down the hierarchy.

Why: the code shows the intent more clearly (the design is not meant for inheritance), and the compiler gets the ability to use static dispatch: a call to a `final` method is resolved at compile time and can be inlined, without a lookup in the virtual method table. This gives a small speed gain and enables additional optimizations. `final` is not applicable to structs and enums: they have no inheritance, and their methods are called directly anyway.
