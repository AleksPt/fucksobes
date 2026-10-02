---
title: "Why can't you declare an open struct?"
category: swift
order: 134
---

`open` allows subclassing a class and overriding its members in other modules. Structs and enums have no inheritance, so such permission makes no sense for them, and the compiler prohibits `open` for anything other than classes and their members.

For a struct, `public` is enough: the type is visible in other modules, but its instances can only be created and used. You can extend behavior outside the module through an `extension`, provided that it adds new functionality rather than overriding existing functionality. A class with `public` applied is accessible from outside the module, but it can be subclassed and its methods overridden only within its own module.
