---
title: "How do you optimize the memory a struct takes up (alignment)?"
category: memory
order: 67
---

A struct's fields are laid out in declaration order, and each is aligned to its own `alignment`: padding bytes appear between fields. Swift does not reorder fields itself, so the order affects the size.

```swift
struct A { var a: Int8; var b: Int64; var c: Int8 }   // size 17, stride 24
struct B { var b: Int64; var a: Int8; var c: Int8 }   // size 10, stride 16
```

In `A`, there are 7 bytes of padding after the `Int8` before the `Int64`, and another 7 at the end to round up to a multiple of the alignment. In `B`, the large field comes first, the small ones follow each other, and padding is left only at the tail.

How to reduce the size:

- order fields by descending `alignment` (first `Int64`/`Double`/references, then `Int32`, `Int16`, `Int8`/`Bool`);
- use types of the appropriate width (`Int32` instead of `Int64` when the range is enough);
- replace several `Bool`s with an enum or an `OptionSet` of flags;
- check the result with `MemoryLayout<T>.size`, `.stride`, and `.alignment`.

What matters is the `stride`: it determines how much space an element takes in an array. The optimization is worth doing for types of which there are millions in memory.
