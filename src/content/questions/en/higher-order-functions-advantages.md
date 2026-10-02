---
title: "List the advantages of higher-order functions"
category: swift
order: 127
---

Higher-order functions take other functions (closures) as arguments or return functions: `map`, `filter`, `reduce`, `sorted(by:)`, `forEach`.

Advantages:

- **flexibility**: behavior is passed as a parameter, so one function fits different tasks (for example, `sorted(by:)` with different criteria);
- **brevity and readability**: a loop that accumulates a result is replaced by a single line, and it is clear what the code does rather than how;
- **reuse and composition**: small functions are assembled into chains;
- **safety**: there is no manual management of indices and mutable state;
- **asynchrony**: callback closures (`completion`) let you describe what to do after the work finishes.

Disadvantages: long chains are harder to read and debug, and each step creates an intermediate array (this can be reduced by adding `lazy`).
