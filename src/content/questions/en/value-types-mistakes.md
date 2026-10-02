---
title: "What mistakes can result from not understanding types?"
category: swift
order: 4
---

Mistakes occur when copy semantics and reference semantics are confused:

- Structs and enums are value types: they are copied on assignment and when passed to a function. Classes are reference types: in both cases a reference to the same instance is used. By changing a "copy" of a class, you change the original object (`alsoTenEighty.frameRate = 30.0` changes `tenEighty` as well), whereas changing a copy of a struct does not affect the original.
- A constant holding a struct makes all of its properties immutable, even those declared with `var`; for a class instance in a constant, `var` properties can be changed.
- Arrays, dictionaries, and strings are also value types (implemented as structs), although the standard library defers copying until the first modification; the visible behavior is always as if the copy were made immediately.
