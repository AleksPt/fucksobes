---
title: "What is the difference between compactMap and flatMap?"
category: swift
order: 97
---

Both transform elements and collect the result into an array, but they solve different problems:

- `compactMap` applies a closure that returns an optional and drops `nil` values (unwrapping the rest): `["1", "x", "3"].compactMap { Int($0) }` → `[1, 3]`.
- `flatMap` applies a closure that returns a sequence and concatenates the results into a single flat array: `[[1, 2], [3]].flatMap { $0 }` → `[1, 2, 3]`.

At one time `flatMap` could do both: with a closure that returned an optional, it dropped `nil` values. In Swift 4.1 that overload was deprecated and replaced with `compactMap`, so that the name reflects the meaning more accurately. For optionals, `flatMap` still exists as an `Optional` method: it unwraps the result without double optionality.
