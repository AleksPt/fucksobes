---
title: "How do you calculate the size of a protocol in memory (MemoryLayout)?"
category: memory
order: 61
---

When a value is stored with a protocol type (`any P`), Swift uses an existential container, whose size is given by `MemoryLayout<P>.size`. On a 64-bit platform:

- a regular protocol (`protocol P {}`): **40 bytes** = a 3-machine-word buffer for the value (24) + a pointer to the metatype (8) + a pointer to the protocol witness table (8);
- a marker protocol like `Sendable`: **32 bytes**, since there is no witness table;
- `AnyObject`: **8 bytes**, a class existential container that holds only a pointer to the object on the heap;
- a class-constrained protocol with methods (for example, `Actor`): **16 bytes** = a pointer to the object (8) + a pointer to the witness table (8).

```swift
protocol P {}
print(MemoryLayout<P>.size)          // 40
print(MemoryLayout<AnyObject>.size)  // 8
```

Values that fit in the three-word buffer are stored directly in the container, while larger ones go on the heap, with a pointer to them in the buffer. So using a protocol as a type can lead to allocations, whereas constrained generics (`<T: P>`) or `some P` avoid this.
