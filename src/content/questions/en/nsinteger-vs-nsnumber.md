---
title: "What is the difference between NSInteger and NSNumber?"
category: swift
order: 72
---

`NSNumber` is an object and a reference type: it can be serialized, stored in arrays, and so on, and it also has many methods for converting to other data types.

`NSInteger` is not an object but an integer typedef: on 32-bit platforms it is `int`, on 64-bit platforms `long`. In Swift it is imported as `Int`.
