---
title: "What options does Swift offer for passing and storing objects (closures, reference / value types)?"
category: swift
order: 5
---

- **Value types** (structs, enums, as well as the basic types, arrays, dictionaries, strings): copied on assignment or when passed to a function.
- **Reference types** (classes): a reference to the same instance is passed, and no copy is made.
- **`inout` parameters**: the value is passed into the function, modified, and passed back, replacing the original; the argument is passed with `&`.
- **Closures**: functions and closures are reference types. When you assign a closure to a constant or variable, you store a reference to it, so two variables holding the same closure refer to the same closure. A closure captures values from the surrounding context and can modify captured variables, even if the constant holding the closure itself is declared with `let`.
