---
title: "What is the difference between a reference type and a value type? Give examples"
category: swift
order: 3
---

**A value type** stores the values themselves. When passed or assigned, it is copied in full and a separate copy is created; each variable holds its own copy, so changes do not affect the original instance. As a rule, these are all the simple types, structs, tuples, enums, and collections (`Array`, `Dictionary`, `Set`).

**A reference type** stores a reference (a pointer) to the memory region where the value lives. When passed or copied, the reference is passed, so several variables can refer to the same object, and changes affect the original object. These are classes, functions, closures, and actors. Memory is managed with reference counting (ARC); value types do not need it.

**Stack and heap.** As a rule, value types are stored on the stack and class instances on the heap, but this is a simplification: where a value lives depends not on "value or reference" but on its size, lifetime, and compiler optimizations.

**A value type may use the heap:**

- when the struct is a property of a class: it lives inside the object on the heap;
- when the value is captured by an `@escaping` closure: it is moved to the heap to outlive the call;
- when a value in a variable of a protocol type does not fit in the existential container's buffer (three machine words);
- when the type stores its data indirectly: `Array`, `String`, `Dictionary`, `indirect enum`.

A struct with a class field, or a generic `MyStruct<T>` where `T` is a class, remains a value type: it holds a reference inside itself, while the class instance itself lives on the heap. An `Any` field does not by itself mean the heap: small values are stored in a buffer inside the container.

**A class instance on the stack:** the reference variable lies on the stack, while the object itself is usually on the heap. But the optimizer may place the object on the stack if it proves that the object does not leave the function.
