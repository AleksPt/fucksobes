---
title: "Extensions. What can and cannot be done inside them?"
category: swift
order: 61
---

In an `extension` you can add:

- methods;
- computed properties;
- initializers;
- subscripts;
- nested types (`class`, `struct`, `enum`) — useful for encapsulating helper logic;
- protocol conformance;
- static properties and methods;
- attributes (`@objc`, `@available`).

You cannot add stored properties, because that would require changing the memory layout of the type.
