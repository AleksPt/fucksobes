---
title: "Where is a struct stored if it contains a class?"
category: memory
order: 12
---

The struct itself is stored as usual (for example, on the stack if it is a local variable): its fields live inside it. A class-typed field holds only a reference inside the struct, while the class instance itself is allocated on the heap.

So when the struct is copied, the reference is copied and the reference count is incremented, not the object itself: both copies point to the same instance. The reference counting overhead grows in proportion to the number of references inside the struct.
