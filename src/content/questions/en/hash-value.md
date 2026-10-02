---
title: "What is a hash value, how is it computed, and what does it represent?"
category: algorithms
order: 15
---

A hash value is an integer (`Int`) obtained by feeding the essential components of a value into `Hasher` via `combine(_:)` and calling `finalize()`. Within a single run of the program, `Hasher` always gives the same result for the same sequence of bytes, and because of the avalanche effect, a small change in the input or the seed changes the result drastically.

`hashValue` is not guaranteed to be the same between runs, so you must not persist it for future runs.
