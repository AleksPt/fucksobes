---
title: "What is dispatch?"
category: swift
order: 73
---

> Method dispatch is how a program decides which code to execute when a function is called.

Dispatch is the process of determining **which specific implementation of a method or function to call** in response to a call, based on the context (for example, the type of the object the method is called on). It is needed for polymorphism, dynamic behavior, and other key concepts. It lets you:

1. **Call the right method under polymorphism.** If several types (classes, structs, or protocols) implement the same method, dispatch determines which method to use for the specific type.
2. **Implement dynamic behavior with inheritance and overriding.** In a class hierarchy, the subclass's overriding method is called even if the call goes through a reference to the base class.
3. **Honor the contract of interfaces and protocols.** The method is called on an object that conforms to the protocol, even if the actual type is unknown at compile time.
4. **Optimize performance** by choosing static or dynamic dispatch.

**Kinds of dispatch**

- **`Direct Dispatch` (static)** — the fastest. The address of the called function is determined at compile time, so the cost of the call is minimal. To use static dispatch, mark methods `private` or classes `final`.
- **`Table Dispatch` (dynamic)** — a common kind. The function address is determined at runtime. Each subclass has its own table with a function pointer for each method; new subclass methods are appended to the end of the table. At runtime the table is consulted to determine the method. Swift has two subtypes:
    - **`Virtual Table`** — used with class inheritance, which brings extra overhead;
    - **`Witness Table`** — used to implement protocols, with no inheritance.
- **`Message Dispatch`** — the slowest. It powers mechanisms such as KVC/KVO or Core Data (?). Its main feature is the ability to change dispatch behavior at runtime using swizzling.
