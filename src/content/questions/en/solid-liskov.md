---
title: "SOLID principles: the letter L"
category: architecture
order: 7
---

The **Liskov Substitution Principle** (LSP, the letter L): an object of a supertype can be replaced with an object of a subtype without breaking the program. Formally: if S is a subtype of T, then properties provable for objects of T must also hold for objects of S.

Conditions for a subtype:

- preconditions cannot be strengthened;
- postconditions cannot be weakened;
- invariants are preserved or strengthened;
- state changes forbidden by the supertype cannot be allowed (the history constraint; example: a mutable point as a subtype of an immutable one);
- method parameters are contravariant, return types are covariant, and no new exceptions may be added.

