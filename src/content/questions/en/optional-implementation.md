---
title: "What type is Optional implemented with in Swift (a struct, a class, an enum, or something else)?"
category: swift
order: 16
---

**`enum`.** `Optional` in Swift is implemented as an enum with two cases: `.none` (no value, `nil`) and `.some(Wrapped)` (there is a value).
