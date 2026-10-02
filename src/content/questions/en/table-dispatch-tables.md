---
title: "What do the tables in table dispatch store?"
category: swift
order: 77
---

The tables store pointers to **method implementations**, not to the classes themselves.

- A class has a virtual function table (vtable): for each method, including inherited ones, it holds the address of the implementation for that class.
- If a method is overridden in a subclass, the entry in the subclass's vtable points to the overriding implementation.
- Protocols use a witness table: for each conformance of a type to a protocol, it holds the implementations of the protocol's requirements.
