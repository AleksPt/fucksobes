---
title: "What is the difference between let and var?"
category: swift
order: 2
---

`let` declares a constant: its value cannot be changed after it is set. `var` declares a variable: it can be assigned a different value later.

For instances of value types, constness extends to all properties: if a struct is assigned to a constant, its properties cannot be changed, even if they are declared with `var`. For classes (reference types) this is not the case: `let` fixes the reference, but the `var` properties of the instance can still be changed.
