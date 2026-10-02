---
title: "Where are weak references stored?"
category: memory
order: 34
---

A weak reference holds a pointer not to the object itself but to its side table (unlike strong and unowned variables, which point to the object). The side table is created for an object at the moment the first weak reference to it is formed; it holds the strong, unowned, and weak counts.

When the strong count reaches zero, the object is deinitialized, and the side table stays as long as weak references remain; once the weak count drops to zero, it is freed.

