---
title: "What is functional programming? What are its characteristics?"
category: architecture
order: 65
---

Functional programming (FP) is a paradigm in which a program is built as a composition of functions rather than a sequence of state changes.

Main ideas:

- **pure functions**: the result depends only on the arguments, with no side effects;
- **immutability**: data is not modified; new values are created instead;
- **first-class and higher-order functions**: they can be passed around, returned, and stored (`map`, `filter`, `reduce`);
- **composition** of small functions into complex ones;
- **declarative style**: you describe what you want to get, not how;
- recursion instead of loops, lazy evaluation, algebraic data types.

Swift is a multi-paradigm language and supports FP: closures, higher-order functions, `let`, value types, `enum` with associated values, `Optional` and `Result` as monads with `map/flatMap`, and `lazy`. Combine, SwiftUI, and unidirectional architectures (Redux, TCA) are built on these ideas.

Pros: predictability, ease of testing, and safety in multithreading. Cons: a steep learning curve, possible copying of data and higher memory consumption, and harder debugging of long chains.
