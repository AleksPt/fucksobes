---
title: "What is an associated type? Where is it used, and what does it help you do?"
category: swift
order: 58
---

It is a declaration inside a protocol that defines the data type the protocol works with: a type placeholder that a concrete type conforming to the protocol must specify. It is created with the **`associatedtype`** keyword. Essentially, it is generics for protocols: it lets you work with different types without duplicating code, making protocols more flexible and universal.

**When to use it**

1. When a protocol works with an abstract type that becomes known only at implementation time. For example, a protocol for containers, collections, or object factories.
2. When the type depends on the implementation. For example, an array and a set store elements differently, but the protocol has to unify them.
