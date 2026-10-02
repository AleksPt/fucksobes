---
title: "How does reference counting work in ARC?"
category: memory
order: 18
---

**ARC** automatically frees the memory used by class instances when they are no longer needed. Reference counting applies only to class instances; structs and enums (value types) do not take part in it.

- When you assign a class instance to a property, constant, or variable, you create a strong reference to it; as long as it exists, ARC will not free the instance.
- A `weak` reference does not keep the instance alive: ARC sets it to `nil` automatically when the instance is deallocated.
- An `unowned` reference does not keep the instance alive either, but it is expected to always have a value: ARC does not nil it out, and accessing it after deallocation is a runtime error.

If two instances hold strong references to each other, they will not be freed (a retain cycle); `weak` and `unowned` solve this.

