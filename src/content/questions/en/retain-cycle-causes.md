---
title: "When can a retain cycle occur?"
category: memory
order: 40
---

A retain cycle occurs when class instances hold each other with strong references, so ARC cannot free them. The main cases, per the documentation:

- two class instances reference each other through strong properties;
- a closure stored as an instance property captures `self` (a closure is a reference type, and `self` holds the closure).

The cycle is broken with a `weak` or `unowned` reference; in closures this is done with a capture list (`[weak self]`, `[unowned self]`).

