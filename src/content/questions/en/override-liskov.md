---
title: "Does override violate the Liskov substitution principle? Why?"
category: architecture
order: 58
---

Overriding a method does not in itself violate the Liskov principle (LSP, the L in SOLID): polymorphism is built on exactly that. LSP requires that an object of a subclass can be used in place of an object of the superclass without breaking the correctness of the program. What violates it is not `override` as a mechanism but a change to the contract:

- strengthening preconditions (the subclass accepts fewer values than the parent);
- weakening postconditions (it returns something the parent would not return: `nil`, or a different meaning of the result);
- throwing errors the parent does not throw, or an empty/crashing implementation (`fatalError`, a no-op);
- breaking the class's invariants.

A classic example: `Square` inherits from `Rectangle` and changes the height as well in `setWidth`. Code that works with `Rectangle` assumes width and height are independent, and it breaks when a `Square` is substituted.

How to avoid it: inherit only when there is an "is-a" relationship and the contract is preserved, use composition or protocols instead of a poor hierarchy, document expectations, and use `final` where overriding is not intended.
