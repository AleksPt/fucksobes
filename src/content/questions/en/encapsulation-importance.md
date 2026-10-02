---
title: "Why is encapsulation important?"
category: architecture
order: 62
---

Encapsulation bundles data with the methods that work with it and hides the internal structure of a type, exposing only a minimal interface. In Swift it is provided by access levels (`private`, `fileprivate`, `internal`, `public`), `private(set)`, and protocols.

Why it matters:

- **protecting invariants**: the state cannot be corrupted directly; all changes go through methods that check correctness;
- **loose coupling**: clients depend on the public interface rather than on details, so the implementation can change without edits to the rest of the code;
- **fewer bugs**: the area where state can change is limited, which makes debugging easier;
- **a type is easier to understand and use**: only the necessary API is visible;
- **security**: data and logic are closed off from outside access.

Example: `public private(set) var balance` lets the balance be read from outside but changed only inside the type, through `deposit` and `withdraw` with validation.
