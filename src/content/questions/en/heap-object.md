---
title: "What is HeapObject?"
category: memory
order: 38
---

`HeapObject` is the base data structure representing **objects allocated on the heap**. It is the runtime's internal representation of an object: every class instance at runtime is an instance of the `HeapObject` structure.

It contains all the data that makes up an object in Swift: **the reference count and the type metadata** (used in `swift_retain`, `swift_release`).
