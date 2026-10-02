---
title: "What is a side table and what problem does it solve?"
category: memory
order: 32
---

A side table is a separate table of reference counts that the runtime creates for an object when a `weak` reference to it is formed. It stores a pointer to the object and the counts: strong, unowned, and weak (plus flags); the object itself has no weak reference count.

The problem it solves: a `weak` variable points not to the object itself but to its side table. So when the strong reference count reaches zero, `deinit` runs and the object's memory is freed, while the side table lives on as long as weak references remain, allowing `nil` to be read safely. When the weak reference count drops to zero, the side table is freed.

