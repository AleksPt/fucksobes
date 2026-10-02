---
title: "What are retain/release and when are they inserted?"
category: memory
order: 19
---

- **retain** — increments the object's reference count. When someone needs an object, it has to be "retained" so that it isn't destroyed.
- **release** — decrements the object's reference count. It is called when the object is no longer needed. If the count reaches zero, the object is freed from memory.

The compiler adds `retain`, `release`, and `autorelease` calls automatically **at compile time**.
