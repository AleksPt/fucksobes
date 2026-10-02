---
title: "What is the difference between a reference type and a value type? Give examples"
category: swift
order: 3
---

**A value type** stores the values themselves. When passed or assigned, it is copied in full and a separate copy is created; each variable holds its own copy, so changes do not affect the original instance. As a rule, these are all the simple types, structs, tuples, enums, and collections (`Array`, `Dictionary`, `Set`).

**A reference type** stores a reference (a pointer) to the memory region where the value lives. When passed or copied, the reference is passed, so several variables can refer to the same object, and changes affect the original object. These are classes, functions, closures, and actors. Memory is managed with reference counting (ARC); value types do not need it.

**Stack and heap.** As a rule, value types are stored on the stack and reference types on the heap. But there are exceptions.

**A value type on the heap:**

- when the struct is a property of a class;
- when the struct has an `Any` field;
- when the struct is very large and does not fit on the stack;
- when a value object is captured in an `@escaping` closure: it is moved to the heap to keep it alive;
- when a protocol type is expected for the struct (and the struct does not fit in 3 machine words);
- when the struct has a generic type: if the generic is a reference type, an instance of `MyStruct<T>` is stored on the heap;
- `indirect enum`: its final size cannot be determined at compile time.

**A reference type on the stack:**

- when a class instance is declared as a local variable inside a function;
- when the size of the class is known in advance: then it can be moved to the stack as an optimization.
