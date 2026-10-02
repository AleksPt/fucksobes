---
title: "If a struct implements a protocol and calls the method it implemented, what kind of dispatch is used?"
category: swift
order: 81
---

It depends on which type the call goes through.

- If the method is called on a value of the concrete struct type, the implementation is known at compile time, and dispatch is static.
- If the call goes through the protocol type (the value is stored in an existential container), the implementation is taken from the protocol witness table: there is one table for each type that implements the protocol, and its entries point to the implementations in the type. This is dynamic dispatch.

In generic code, the compiler can create a version of the function for a concrete type (specialization), and then the call becomes static again.
