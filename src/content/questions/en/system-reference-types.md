---
title: "What built-in `reference types` are there in Swift besides classes?"
category: swift
order: 10
---

Closures, functions, actors. `indirect enum` is not one of them: it is a value type, and `indirect` only adds a level of indirection (the payload of its cases is stored on the heap).
