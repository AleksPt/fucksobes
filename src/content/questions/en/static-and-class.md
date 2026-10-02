---
title: "The `static` and `class` keywords. What optimization for static properties comes out of the box?"
category: swift
order: 40
---

`static` and `class` declare type properties and methods.

- `class` members can be overridden, `static` ones cannot.
- `class` properties can only be computed, while `static` ones can be computed or stored.

The out-of-the-box optimization: static properties work as `lazy`.
