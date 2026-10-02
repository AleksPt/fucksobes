---
title: "What is the difference between a struct and a class, and when to use which?"
category: swift
order: 6
---

1. **Inheritance.** Classes support inheritance, structs do not.
2. **Copy semantics.** Structs are passed by value (copied), classes by reference.
3. **Deinitialization.** Classes have `deinit`, structs do not.
4. **Mutating methods.** In structs they require the `mutating` keyword.
5. **ARC.** Classes are managed by ARC (Automatic Reference Counting); structs do not need it.
6. **Allocation.** Struct instances are usually created on the stack, and class instances on the heap.
7. **Type casting.** For classes, `is`, `as?`, and `as!` work at runtime (checking and casting along the inheritance hierarchy); structs have no such capability.
8. **Constants.** If a class instance is declared with `let`, you can still change its `var` properties (the constant holds the reference); for a struct instance declared with `let`, the properties cannot be changed.

Choose a struct when you need to encapsulate a few simple values, copying is expected, the properties are themselves value types, and inheritance is not needed. In all other cases a class fits: for example, when object identity matters and a single instance is shared.
