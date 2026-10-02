---
title: "What is POP (Protocol Oriented Programming)? How does it differ from OOP?"
category: architecture
order: 31
---

Protocol-Oriented Programming is a Swift approach in which behavior is described by protocols, and shared implementation is added through protocol extensions (`extension Protocol`). Types (including structs and enums, which have no inheritance) conform to the protocols they need and get the default implementation.

The difference from OOP: in classic OOP, shared behavior is passed down by inheriting from a base class, that is, through an "is-a" hierarchy and only for classes. In POP, a type can conform to many protocols, so composition is more flexible, there are no problems with deep hierarchies or a single superclass, and you can work with value types. Protocols also make testing easier: the real implementation is replaced with a mock.

Limitations: protocols with an `associated type` or `Self` requirements are harder to use as a type (you need `some` or `any`), and dynamic dispatch for methods not declared in the protocol works differently from what people expect.
