---
title: "How does a closure differ from a function?"
category: swift
order: 21
---

Functions are a special case of closures. There are three kinds of closures: global functions (named, capture nothing), nested functions (named, can capture values from the enclosing function), and closure expressions (unnamed closures in a lightweight syntax that can capture values from the surrounding context).

A closure expression has no name and allows syntax shortcuts (type inference from context, an implicit `return` for a single expression, shorthand argument names `$0`, trailing closures). Like functions, closures are reference types.
