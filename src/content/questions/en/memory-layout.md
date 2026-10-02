---
title: "What is Memory Layout?"
category: memory
order: 11
---

The way data is organized and placed in memory for a particular object, struct, or class. All of this happens automatically.

Memory layout describes:

1. **Size** — how many bytes the object occupies in memory.
2. **Alignment** — the minimum step on which the object must start in memory.
3. **Offset** — the position of each property relative to the start of the object.

You can get these values for a type through `MemoryLayout<T>`:

- `size` — how many bytes the value occupies;
- `alignment` — the address alignment requirement (usually a power of two);
- `stride` — the step from the start of one element to the start of the next in an array: `size` rounded up to a multiple of `alignment`.

```swift
struct S { var a: Int8; var b: Int64 }
MemoryLayout<S>.size       // 16
MemoryLayout<S>.alignment  // 8
MemoryLayout<S>.stride     // 16
```

The order of properties affects size because of alignment: padding bytes appear between `Int8` and `Int64`. For a class, `size` equals the size of a reference (8 bytes on a 64-bit platform), regardless of the number of properties.
